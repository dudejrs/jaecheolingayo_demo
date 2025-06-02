'use client';
import {useState, useEffect} from 'react';
import {Point, Ratio} from './types'
import Map from "./map";
import {useViewbox} from './hook';
import {StyleProps, MapProps} from "./map";

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

type Seller = {
	id: number
	coord: {
		x: number,
		y: number
	}
}

export default function BubbleMap({
	width = 600,
	height = 600,
	...props
}: MapProps) {
	const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height)
	const [sellers, getSellers] = useState<Seller[]>([])

	useEffect(()=> {
		const params = new URLSearchParams({
			x: base.x.toString(),
			y: base.y.toString(),
			width: ratio.width.toString(),
			height: ratio.height.toString()
		});

		fetch(`/api/seller/kmeans?${params.toString()}`)
			.then(res => res.json())
			.then(console.log)
	},[ratio, base])

	return (
		<Map ratio={ratio} setRatio={setRatio} base={base} setBase={setBase} {...props}>
		</Map>
		);
}