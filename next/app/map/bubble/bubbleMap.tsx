'use client'

import {useCallback, useRef} from "react"
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

interface Coord {
	x: number 
	y: number
}

interface Ratio_ {
	width: number
	height: number
}

interface Data {
	coord: Coord 
	data : number
}

interface BubbleMapProps {
	width?: number 
	height?: number
	base: Coord
	ratio: Ratio_
	className?: string
	data : Data[]
	calculateFunc:  (v: number[]) => number
	generateRandomDatum: Generator<Data>
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
	base : base_,
	ratio : ratio_,
	k = 5,
	data = [],
	generateRandomDatum,
	calculateFunc : calculateFunc_
}: BubbleMapProps) {
	const base = new Point(base_.x, base_.y)
	const ratio = new Ratio(ratio_.width, ratio_.height)
	const totalClusters = useRef<number>(0)
	const font = useFont();

	const calculateFunc = useCallback((data: Data[])=> {
		return calculateFunc_(data.map(d => d.data))
	}, [calculateFunc_])
	
	const updateFunc = useCallback(()=>{
		const clusters = kMeans(data, k, 20, generateRandomDatum, distance, average, calculateFunc)
		
		if (!totalClusters.current) {
			totalClusters.current = clusters.reduce((acc, {data}) => acc + data.value, 0);
		}
		return Promise.resolve(clusters.map(({centroid, data}) => {
			return {
				coord : centroid.coord,
				data 
			}
		}))
	}, [data, calculateFunc_])

	const mapCoords = useCallback(({x, y}: Coord)=>{
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
			size={calculateSize(calculateMarkerSize(data.value, totalClusters.current), new Ratio(width, height), ratio)} 
			dataToString={data => data.value.toString()}
			/>
	)

	return (
		<BubbleMap width={width} height={height} 
			base={base}
			ratio={ratio}
			ignoreUpdateFunc={() => false}
			updateFunc={updateFunc}
			makeMarker={makeMarker}
			/>);
}