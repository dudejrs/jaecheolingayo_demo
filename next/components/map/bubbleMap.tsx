'use client';
import {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {Point, Ratio} from './types'
import Map from "./map";
import {useViewbox} from './hook';
import {StyleProps, MapProps} from "./map";
import {useDebounce} from './hook'
import Marker from "./marker";
import {calculateSize} from "./util";

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

export type Coord = {
	x: number,
	y: number
}

export type Cluster<T> = {
	coord: Coord
	data: T
}

export interface BubbleProps<T> {
	ignoreUpdateFunc : () => boolean
	updateFunc: (base: Point, ratio: Ratio) => Promise<Cluster<T>[]>
	makeMarker: (cluster: Cluster<T>, i: number, ratio: Ratio) => React.ReactNode
}

export default function BubbleMap<Data>({
	width = 600,
	height = 600,
	ignoreUpdateFunc = () => true,
	updateFunc,
	makeMarker,
	...props
}: MapProps & BubbleProps<Data>) {
	const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height)
	const [clusters, setClusters] = useState<Cluster<Data>[]>([])
	const prevBase = useRef<Point>(null);
	const prevRatio = useRef<Ratio>(null);

	const POINT_THRESHOLD = 0.3
	const RATIO_THRESHOLD = 0.05

	const doUpdate = useCallback((base: Point, ratio: Ratio) => {
			if (ignoreUpdateFunc() && prevRatio.current && prevBase.current && prevBase.current.distance(base) / prevRatio.current.min < POINT_THRESHOLD && prevRatio.current.d(ratio) < RATIO_THRESHOLD ) {
				return;
			}
			prevBase.current = base
			prevRatio.current = ratio

			updateFunc(base, ratio)
				.then(c => {
					setClusters(c)
				})
	}, []) 

	const debouncedFetch = useDebounce(doUpdate, 100);

	useEffect(()=> {
		debouncedFetch(base, ratio);
	},[ratio, base,debouncedFetch, ignoreUpdateFunc, updateFunc])

	return (
		<Map width={width} height={height} ratio={ratio} setRatio={setRatio} base={base} setBase={setBase} {...props}>
			<g>
				{
					clusters.map(
						(cluster, i) => (makeMarker(cluster, i, ratio)))
						
				}
			</g>
		</Map>
		);
}