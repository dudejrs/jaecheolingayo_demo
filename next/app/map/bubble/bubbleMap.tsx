'use client'

import {useCallback, useState, useEffect, useRef} from "react"
import {BubbleMap} from "@/components/map"
import type {Cluster} from "@/components/map/bubbleMap"
import {Point, Ratio} from "@/components/map/types"
import {useFont} from "@/components/map/hook"
import Marker from "@/components/map/marker"
import {calculateSize} from "@/components/map/util";
import {kMeans} from "@/lib/clustering"

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

interface RawPoint {
	x: number 
	y: number
}

interface RawRatio {
	width: number
	height: number
}

interface Data {
	coord: RawPoint 
	data : number
}

interface BubbleMapProps {
	width?: number 
	height?: number
	base: RawPoint
	ratio: RawRatio
	className?: string
	data : Data[]
	calculateFunc:  (v: number[]) => number
	generateRandomDatum: Generator<Data>
	n?: number 
	k?: number
}

function distance(d1: Data, d2: Data) {
	const {x: x1, y: y1} = d1.coord
	const {x: x2, y: y2} = d2.coord

	const dx = Math.abs(x2 - x1)
	const dy = Math.abs(y2 - y1)

	return Math.sqrt(dx * dx + dy * dy)
}

function average(data : Data[]) {
	const averageX = data.map(({coord}) => coord.x).reduce((sum, x) => sum + x, 0) / data.length
	const averageY = data.map(({coord}) => coord.y).reduce((sum, y) => sum + y, 0) / data.length

	return {
		coord : {
			x: averageX,
			y: averageY
		},
		data : -1
	}
}

function calculateMarkerSize(
  data: number| undefined,
  maxData: number,
  baseSize: number = 12,
  maxSize: number = 32
): number {
	if (!data) {
		return (baseSize + maxSize) / 2
	}

	const scalingFactor = Math.sqrt(data / maxData);
	const size = baseSize + scalingFactor * (maxSize - baseSize);
	return size
}

export default function TestBubbleMap({
	width = 600,
	height = 600,
	className,
	base : rawBase,
	ratio : rawRatio,
	k : kOrigin = 5,
	n : n = 20,
	data = [],
	generateRandomDatum,
	calculateFunc : calculateFunc_
}: BubbleMapProps) {
	const baseOrigin = new Point(rawBase.x, rawBase.y)
	const ratioOrigin = new Ratio(rawRatio.width, rawRatio.height)
	const totalClusters = useRef<number>(0)
	const font = useFont();
	const [updateKey, setUpdateKey] = useState(0);
	const changeTotalCluster = useRef(true);

	useEffect(() => {
	  setUpdateKey(prev => prev + 1);
	  changeTotalCluster.current = true;
	}, [kOrigin, n, data,calculateFunc_]);


	const calculateFunc = useCallback((data: Data[])=> {
		return calculateFunc_(data.map(d => d.data))
	}, [calculateFunc_])
	
	const updateFunc = useCallback((base: Point, ratio: Ratio)=>{
		const k = Math.pow(Math.ceil(ratioOrigin.max / ratio.max), 2) * kOrigin
		const clusters = kMeans(data, k, n, generateRandomDatum, distance, average, calculateFunc)
		
		if (changeTotalCluster.current) {
			totalClusters.current = clusters.reduce((acc, {data}) => acc + data.value, 0);
			changeTotalCluster.current=false;
		}

		return Promise.resolve(clusters.map(({centroid, data}) => {
			return {
				coord : centroid.coord,
				data 
			}
		}))
	}, [data, calculateFunc_, kOrigin, data, n])

	const mapCoords = useCallback(({x, y}: RawPoint)=>{
		return {
			x : x - DEFAULT_ORIGIN_POINT.x,
			y : DEFAULT_RATIO.height -  y + DEFAULT_ORIGIN_POINT.y
		}
	},[])

	const makeMarker = ({coord, data} : Cluster<number, Data[]>, i: number, ratio: Ratio) : React.ReactNode => (
		font && <Marker key={i}
			font={font}
			coord={mapCoords(coord)}
			data={data}
			size={calculateSize(calculateMarkerSize(data.value, totalClusters.current, 12, 40), new Ratio(width, height), ratio)} 
			dataToString={data => data.value.toString()}
			fill="var(--pccs-blue-bright)"
			/>
	)

	return (
		<BubbleMap 
			key={updateKey}
			width={width} height={height} 
			base={baseOrigin}
			ratio={ratioOrigin}
			ignoreUpdateFunc={() => true}
			updateFunc={updateFunc}
			makeMarker={makeMarker}
			/>);
}