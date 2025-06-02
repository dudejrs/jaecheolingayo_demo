'use client';
import {useState, useEffect, useRef} from 'react';
import {Point, Ratio} from './types'
import Map from "./map";
import {useViewbox} from './hook';
import {StyleProps, MapProps} from "./map";
import Marker from "./marker";
import {calculateSize} from "./util";

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

export type Coord = {
	x: number,
	y: number
}

export type Cluster = {
	coord: Coord
	data?: number
}

export interface BubbleProps {
	markerStyle?: StyleProps
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

export default function BubbleMap({
	width = 600,
	height = 600,
	markerStyle = DEFAULT_MARKER_STYLE,
	...props
}: MapProps & BubbleProps) {
	const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height)
	const [clusters, setClusters] = useState<Cluster[]>([])
	const  totalClusters = useRef<number>(0)

	useEffect(()=> {
		const handler = setTimeout(()=> {
			const params = new URLSearchParams({
				x: base.x.toString(),
				y: base.y.toString(),
				width: ratio.width.toString(),
				height: ratio.height.toString(),
				k : ratio.k.toString()
			});

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
		}, 500);

		return () => {
			clearTimeout(handler)
		}
	},[ratio, base])

	return (
		<Map ratio={ratio} setRatio={setRatio} base={base} setBase={setBase} {...props}>
			<g>
				{
					clusters.map(({coord, data}, i) => (<Marker key={i} coord={coord} data={data} size={calculateSize(calculateMarkerSize(data, totalClusters.current), new Ratio(width, height), ratio)} {...markerStyle} />))
				}
			</g>
		</Map>
		);
}