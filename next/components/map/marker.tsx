'use client';
import type {Coord} from "./bubbleMap"
import {StyleProps} from "./map";
import Text from "./text"

export interface MarkerProps {
	className? : string
	coord: Coord
	size: number
	fontSize?: number
	data?: number
}

export default function Marker({
	className,
	size,
	fontSize,
	coord,
	data,
	...kwargs
}: MarkerProps & StyleProps) {
	return (
		<g>
			<circle cx={coord.x} cy={coord.y} r={size} className={className}  {...kwargs} />
				{
					data && (<Text text={data} size={size} x={coord.x} y={coord.y} stroke="blue" fill="white"/>)
				}
		</g>
		)
}
