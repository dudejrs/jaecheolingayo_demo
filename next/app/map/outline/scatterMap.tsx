'use client'

import {useEffect, useCallback, useState} from "react"

import {quickHull} from "@/lib/outline"
import {Outline} from "@/components/map/path"
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
	type: number
}

interface Group {
	[i : number] : RawPoint[]
}

interface ScatterMapProps {
	width?: number
	height?: number
	data: Data[]
	base: RawPoint 
	ratio: RawRatio
}

const colors = [
	"var(--pccs-blue-bright)",
	"var(--pccs-red-bright)",
	"var(--pccs-yellow-bright)",
	"var(--pccs-green-bright)",
	"var(--pccs-purple-bright)",
	"var(--pccs-orange-bright)",
	"var(--pccs-purple-red-bright)",
	"var(--pccs-red-orange-bright)",
	"var(--pccs-yellow-orange-bright)",
	"var(--pccs-yellow-green-bright)",
	"var(--pccs-blue-green-bright)",
	"var(--pccs-blue-purple-bright)",
]

export default function TestScatterMap({
	width=600,
	height=600,
	data = [],
	base: rawBase = DEFAULT_ORIGIN_POINT,
	ratio: rawRatio = DEFAULT_RATIO
} : ScatterMapProps ){
	const baseOrigin = new Point(rawBase.x, rawBase.y)
	const ratioOrigin = new Ratio(rawRatio.width, rawRatio.height)
	const [hulls, setHulls] = useState<RawPoint[][]>([])
	const [updateKey, setUpdateKey] = useState(0);

	useEffect(()=>{
		setUpdateKey(prev => prev + 1)

		const groups = data
			.map(({coord, type}) => {
				return {
					coord: mapCoords(coord),
					type
				}
			})
			.reduce((acc : Group , {coord, type} : Data) => {
			if (!acc[type]) {
				acc[type] = []
			}
			acc[type].push(coord)
			return acc
		}, {});

		const hulls = Object.values(groups)
			.map(g => g.slice())
			.map(quickHull)

		console.log(hulls)
		setHulls(hulls)

	},[data])

	const mapCoords = useCallback(({x, y}: RawPoint)=>{
		return {
			x : x - DEFAULT_ORIGIN_POINT.x,
			y : DEFAULT_RATIO.height -  y + DEFAULT_ORIGIN_POINT.y
		}
	},[])

	const makeMarker = (({coord, type} : Data, i: number, ratio: Ratio) => (<Marker key={i} 
									coord={mapCoords(coord)} 
									size={calculateSize(5, new Ratio(width, height), ratio)}
									fill={colors[type]}
								/>))

	return (
		<ScatterMap key={updateKey} 
			width={width} height={height}
			data={data}
			base={baseOrigin} 
			ratio={ratioOrigin}
			makeMarker={makeMarker}>
			{
				hulls && hulls.length && hulls.map((hull, i) => (
					< Outline key={i} points={hull} fill={colors[i]} offset={-2000} />
					) )
			}
		</ScatterMap>
	)
}