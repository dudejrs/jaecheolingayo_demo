'use client';
import type {Coord} from "./bubbleMap"
import {StyleProps} from "./map";
import Text from "./text"
import opentype from 'opentype.js';

export interface MarkerProps<T> {
	className? : string
	coord: Coord
	size: number
	font: opentype.Font
	onClick? : () => void
	fontSize?: number
	data?: T
	dataToString : (data: T) => string
}

export default function Marker<T>({
	className,
	coord,
	size,
	font,
	fontSize,
	data,
	onClick,
	dataToString,
	...kwargs
}: MarkerProps<T> & StyleProps) {
	return (
		<g>
			<circle cx={coord.x} cy={coord.y} r={size} className={className} {...kwargs} cursor={ onClick ? "pointer" : ""} onClick={onClick || undefined}/>
				{
					data && (<Text text={dataToString(data)} font={font} size={size} x={coord.x} y={coord.y} stroke="blue" fill="white"/>)
				}
		</g>
		)
}
