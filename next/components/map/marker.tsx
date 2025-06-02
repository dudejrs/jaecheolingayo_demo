'use client';
import type {Coord} from "./bubbleMap"
import {StyleProps} from "./map";
import Text from "./text"
import opentype from 'opentype.js';

export interface MarkerProps {
	className? : string
	coord: Coord
	size: number
	font: opentype.Font
	fontSize?: number
	data?: number
}

export default function Marker({
	className,
	coord,
	size,
	font,
	fontSize,
	data,
	...kwargs
}: MarkerProps & StyleProps) {
	return (
		<g>
			<circle cx={coord.x} cy={coord.y} r={size} className={className}  {...kwargs} />
				{
					data && (<Text text={data} font={font} size={size} x={coord.x} y={coord.y} stroke="blue" fill="white"/>)
				}
		</g>
		)
}
