'use client'

import {useRef, useEffect, useCallback} from "react"

import {BubbleMap} from "@/components/map"
import type {Cluster} from "@/components/map/bubbleMap"
import {Point, Ratio} from '@/components/map/types'
import {useFont, useDebounce} from '@/components/map/hook'
import Marker from "@/components/map/marker";
import {calculateSize} from "@/components/map/util";
import {StyleProps} from "@/components/map/map";

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

type Coord = {
	x: number
	y: number
}

interface BubbleMapProps {
	width: number
	height: number
	tags: number[] | null
	onMarkerClick: (x: number, y: number, members: number[]) => () => void
}

const DEFAULT_MARKER_STYLE : StyleProps = {
	fill: "var(--gray-50)"
}

function arrayEqual<T>(a1: T[], a2: T[]) {
	if (a1 == a2) {
		return true; 
	}

	if (a1.length !== a2.length) {
		return false;
	}

	const arr1 = a1.slice().sort();
	const arr2 = a2.slice().sort()

	for (let i = 0; i < a1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
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

export default function NRBubbleMap({
	width,
	height,
	tags=[],
	onMarkerClick 
}: BubbleMapProps){
	const totalClusters = useRef<number>(0)
	const currentTags = useRef<number[]>(tags);
	const prevTags = useRef<number[]>(tags);
	const font = useFont();

	useEffect(()=>{
		currentTags.current = tags
	}, [tags])

	const ignoreUpdateFunc = useCallback(()=>{
		if (prevTags.current && currentTags.current && arrayEqual(prevTags.current, currentTags.current)) {
			return true;
		}
		return false;
	}, [tags])

	const updateFunc = useCallback((base: Point, ratio: Ratio) => {
		prevTags.current = currentTags.current

		const params = new URLSearchParams({
			x: base.x.toString(),
			y: base.y.toString(),
			width: ratio.width.toString(),
			height: ratio.height.toString(),
			k : ratio.k.toString(),
		});
		
		if (currentTags.current) {
			params.set("tags", currentTags.current.toString())
		}

		return fetch(`/api/seller/kmeans?${params.toString()}`)
			.then(res => res.json())
			.then(r => {
				console.log(r);
				return r
			})
			.then(({clusters} : {clusters : Cluster<number, number[]>[]})=> clusters
				.filter(({data}) => data.value > 0 )
				)
			.then(c => {
				if (!totalClusters.current){
					const counts = c.map((cluster) : number => cluster.data!.value)
					totalClusters.current = counts.reduce((acc, c) => acc + c, 0)
				}
				return c
			})
	}, [tags]);

	const mapCoords = useCallback(({x, y}: Coord)=>{
		return {
			x : x - DEFAULT_ORIGIN_POINT.x,
			y : DEFAULT_RATIO.height -  y + DEFAULT_ORIGIN_POINT.y
		}
	},[])

	const makeMarker = ({coord, data} : Cluster<number, number[]> , i: number, ratio: Ratio) => (font &&  <Marker key={i} 
							coord={mapCoords(coord)} 
							font={font} 
							data={data} 
							size={calculateSize(calculateMarkerSize(data.value, totalClusters.current), new Ratio(width, height), ratio)} 
							{...DEFAULT_MARKER_STYLE} 
							onClick={onMarkerClick && onMarkerClick(coord.x, coord.y, data.members)} 
							dataToString={(data) => data.value.toString()}
							/>
							)

	return (
		<BubbleMap width={width} height={height} 
			updateFunc={updateFunc} 
			ignoreUpdateFunc={ignoreUpdateFunc} 
			makeMarker={makeMarker}
			/>
		);
}