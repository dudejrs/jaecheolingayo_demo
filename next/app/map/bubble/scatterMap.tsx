'use client'

import {useEffect, useCallback, useState} from "react"

import {ScatterMap} from "@/components/map"
import {Point, Ratio} from "@/components/map/types"
import Marker from "@/components/map/marker/simple"
import {calculateSize} from "@/components/map/util";

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

interface RawPoint {
	x: number
	y: number
}

interface RawRatio {
	width: number
	height : number
}

interface Data {
	coord: RawPoint
	data: number
}

interface ScatterMapProps {
	width?: number
	height?: number
	data: Data[]
	base: RawPoint 
	ratio: RawRatio
}

export default function TestScatterMap({
	width=600,
	height=600,
	data = [],
	base: rawBase = DEFAULT_ORIGIN_POINT,
	ratio: rawRatio = DEFAULT_RATIO
} : ScatterMapProps ){
	const baseOrigin = new Point(rawBase.x, rawBase.y)
	const ratioOrigin = new Ratio(rawRatio.width, rawRatio.height)
	const [updateKey, setUpdateKey] = useState(0);

	useEffect(()=>{
		setUpdateKey(prev => prev + 1)
	},[data])

	const mapCoords = useCallback(({x, y}: RawPoint)=>{
		return {
			x : x - DEFAULT_ORIGIN_POINT.x,
			y : DEFAULT_RATIO.height -  y + DEFAULT_ORIGIN_POINT.y
		}
	},[])

	const makeMarker = (({coord, data} : Data, i: number, ratio: Ratio) => (<Marker key={i} 
									coord={mapCoords(coord)} 
									size={calculateSize(5, new Ratio(width, height), ratio)}
									fill="var(--pccs-blue-bright)"
								/>))

	return (
		<ScatterMap key={updateKey} 
			width={width} height={height}
			data={data}
			base={baseOrigin} 
			ratio={ratioOrigin}
			makeMarker={makeMarker}
		/>
	)
}