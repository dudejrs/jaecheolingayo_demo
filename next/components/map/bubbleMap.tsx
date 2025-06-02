'use client';
import {useState, useEffect} from 'react';
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

export default function BubbleMap({
	width = 600,
	height = 600,
	...props
}: MapProps) {
	const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height)
	const [clusters, setClusters] = useState<Cluster[]>([])

	useEffect(()=> {
		const params = new URLSearchParams({
			x: base.x.toString(),
			y: base.y.toString(),
			width: ratio.width.toString(),
			height: ratio.height.toString()
		});

		fetch(`/api/seller/kmeans?${params.toString()}`)
			.then(res => res.json())
			.then(({clusters})=> clusters)
			.then(c => setClusters(c))
	},[])

	useEffect(() => {
		console.log(clusters)
	},[clusters])

	return (
		<Map ratio={ratio} setRatio={setRatio} base={base} setBase={setBase} {...props}>
			<g>
				{
					clusters.map(({coord, data}, i) => (<Marker key={i} coord={coord} data={data} size={calculateSize(30, new Ratio(width, height), ratio)} fill="red"/>))
				}
			</g>
		</Map>
		);
}