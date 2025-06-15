'use client';

import {Point, Ratio} from './types'
import Map from "./map";
import {useViewbox} from './hook';
import {StyleProps, MapProps} from "./map";

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

interface ViewboxProps {
	ratio?: Ratio
	base?: Point
}

interface ScatterMapProps<T>{
	data: T[]
	makeMarker: (data: T, i: number, ratio: Ratio) => React.ReactNode,
	children? : React.ReactNode
}

export default function ScatterMap<T>({
	width = 600,
	height = 600,
	data,
	ratio: originRatio = DEFAULT_RATIO,
	base: originBase = DEFAULT_ORIGIN_POINT, 
	makeMarker,
	children,
	...props
}: MapProps & ViewboxProps & ScatterMapProps<T>){
	const {ratio, setRatio, base, setBase} = useViewbox(originRatio, originBase, originBase.midPointOf(originRatio), width, height);

	return (
	<Map width={width} height={height} ratio={ratio} setRatio={setRatio} base={base} setBase={setBase} {...props}>
		<g>
				{
					data && data.map(
						((d, i) => makeMarker(d, i, ratio)))
				}
		</g>
		{
			children
		}
	</Map>
	)
}