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

export type Cluster<K= number, T=unknown> = {
	coord: Coord
	data: {
		value : K 
		members: T
	}
}

export interface BubbleProps<K = number, T=unknown> {
	ignoreUpdateFunc : () => boolean
	updateFunc: (base: Point, ratio: Ratio) => Promise<Cluster<K, T>[]>
	makeMarker: (cluster: Cluster<K, T>, i: number, ratio: Ratio) => React.ReactNode
}

interface ViewboxProps {
	ratio?: Ratio
	base?: Point
}

export default function BubbleMap<K, T>({
	width = 600,
	height = 600,
	ignoreUpdateFunc = () => true,
	updateFunc,
	makeMarker,
	ratio: originRatio = DEFAULT_RATIO,
	base: originBase = DEFAULT_ORIGIN_POINT, 
	...props
}: MapProps & BubbleProps<K, T> & ViewboxProps) {
	const {ratio, setRatio, base, setBase} = useViewbox(originRatio, originBase, originBase.midPointOf(originRatio), width, height)
	const [clusters, setClusters] = useState<Cluster<K, T>[]>([])
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
	},[ratio, base, debouncedFetch, ignoreUpdateFunc, updateFunc])

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