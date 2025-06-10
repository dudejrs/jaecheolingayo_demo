'use client';
import {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {Point, Ratio} from './types'
import Map from "./map";
import {useViewbox} from './hook';
import {StyleProps, MapProps} from "./map";
import {useFont, useDebounce} from './hook'
import Marker from "./marker";
import {calculateSize} from "./util";

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

export type Coord = {
	x: number,
	y: number
}

export type Data = {
	count : number,
	sellers : number[]
}

export type Cluster = {
	coord: Coord
	data?: number
	sellers: number[]
}

export interface BubbleProps {
	markerStyle?: StyleProps
	onMarkerClick?: (x: number, y: number, sellers: number[]) => () => void
	tags?: number[]
}

const DEFAULT_MARKER_STYLE : StyleProps = {
	fill: "var(--gray-50)"
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

export default function BubbleMap({
	width = 600,
	height = 600,
	markerStyle = DEFAULT_MARKER_STYLE,
	onMarkerClick= (x: number, y: number, sellers: number[]) => () => {},
	tags,
	...props
}: MapProps & BubbleProps) {
	const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height)
	const [clusters, setClusters] = useState<Cluster[]>([])
	const totalClusters = useRef<number>(0)
	const prevBase = useRef<Point>(null);
	const prevRatio = useRef<Ratio>(null);
	const prevTags = useRef<number[]|null|undefined>(tags);
	const POINT_THRESHOLD = 0.3
	const RATIO_THRESHOLD = 0.05

	const font = useFont();
	const mapCoords = useCallback(({x, y}: Coord)=>{
		return {
			x : x - DEFAULT_ORIGIN_POINT.x,
			y : DEFAULT_RATIO.height -  y + DEFAULT_ORIGIN_POINT.y
		}
	},[])

// 
// T T -> return
// T F  -> fetch 
// F T -> fetch
// F F -> fecth

	const doFetch = useCallback((base: Point, ratio: Ratio, tags?: number[]) => {
			if (prevTags.current && tags && arrayEqual(prevTags.current, tags) && prevRatio.current && prevBase.current && prevBase.current.distance(base) / prevRatio.current.min < POINT_THRESHOLD && prevRatio.current.d(ratio) < RATIO_THRESHOLD ) {
				console. log ( tags && arrayEqual(prevTags.current, tags))
				return;
			}

			prevBase.current = base
			prevRatio.current = ratio
			prevTags.current = tags

			const params = new URLSearchParams({
				x: base.x.toString(),
				y: base.y.toString(),
				width: ratio.width.toString(),
				height: ratio.height.toString(),
				k : ratio.k.toString(),
			});
			
			if (tags) {
				params.set("tags", tags.toString())
			}

			fetch(`/api/seller/kmeans?${params.toString()}`)
				.then(res => res.json())
				.then(({clusters} : {clusters : Cluster[]})=> clusters)
				.then(c => {
					if (!totalClusters.current){
						const counts = c.map((cluster) : number => cluster.data!)
						totalClusters.current = counts.reduce((acc, c) => acc + c, 0)
					}
					setClusters(c)
				})
	}, []) 

	const debouncedFetch = useDebounce(doFetch, 100);

	useEffect(()=> {
		console.log("useEffect")
		debouncedFetch(base, ratio, tags);
	},[ratio, base, tags, debouncedFetch])

	return (
		<Map width={width} height={height} ratio={ratio} setRatio={setRatio} base={base} setBase={setBase} {...props}>
			<g>
				{
					font && clusters.map(
						({coord, data, sellers}, i) => 
						(<Marker key={i} sellers={sellers} 
							coord={mapCoords(coord)} 
							font={font} 
							data={data} 
							size={calculateSize(calculateMarkerSize(data, totalClusters.current), new Ratio(width, height), ratio)} 
							{...markerStyle} 
							onClick={onMarkerClick && onMarkerClick(coord.x, coord.y, sellers)} />))
				}
			</g>
		</Map>
		);
}