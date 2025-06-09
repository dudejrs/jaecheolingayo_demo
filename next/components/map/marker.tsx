'use client';
import type {Coord} from "./bubbleMap"
import {StyleProps} from "./map";
import Text from "./text"
import opentype from 'opentype.js';

export interface MarkerProps {
	className? : string
	sellers? : number[]
	coord: Coord
	size: number
	font: opentype.Font
	onClick? : () => void
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
	sellers,
	onClick,
	...kwargs
}: MarkerProps & StyleProps) {
	return (
		<g>
			<circle cx={coord.x} cy={coord.y} r={size} className={className} {...kwargs} cursor={ onClick ? "pointer" : ""} onClick={onClick || undefined}/>
				{
					data && (<Text text={data} font={font} size={size} x={coord.x} y={coord.y} stroke="blue" fill="white"/>)
				}
		</g>
		)
}
