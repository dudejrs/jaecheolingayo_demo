'use client';

import type {Coord} from "../bubbleMap"
import {StyleProps} from "../map";
import Text from "../text"

export interface SimpleMarkerProps<T> {
	className? : string
	coord: Coord
	size: number
	onClick? : () => void
}

export default function SimpleMarker<T>({
	className,
	coord,
	size,
	onClick,
	...kwargs
}: SimpleMarkerProps<T> & StyleProps) {
	return (
		<circle cx={coord.x} cy={coord.y} r={size} className={className} {...kwargs} cursor={ onClick ? "pointer" : ""} onClick={onClick || undefined}/>		
		)
}
	