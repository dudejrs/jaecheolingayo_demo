'use client';

import type {Coord} from "../bubbleMap"
import {StyleProps} from "../map";
import Text from "../text"

export interface ImageMarkerProps {
	className?: string
	href: string
	id?: string
	coord: Coord
	width: number
	height: number
	onClick? : () => void
}

export default function SimpleMarker<T>({
	className,
	id="rrr",
	href,
	coord,
	width,
	height,
	onClick,
	...kwargs
}: ImageMarkerProps & StyleProps) {
	return (
		<g transform={`translate(${coord.x} ${coord.y})`}>
			<image href={href}
				id={id}
	           x={-width/2} y={-height/2} 
	           width={width} height={height}
	           className={className} {...kwargs}
	           cursor={ onClick ? "pointer" : ""} onClick={onClick || undefined}
	           filter="url(#shadow-filter)">
				<animateTransform
		          attributeName="transform"
		          type="translate"
		          values={`0 ${-height * 0.1}; 0 ${height * 0.1}; 0 ${-height * 0.1}`}
		          dur={`1.5s`}
		          repeatCount="indefinite"
		        />
				<animateTransform
		          attributeName="transform"
		          type="scale"
		          from="0"
		          to="1"
		          dur={`0.5s`}
		          keyTimes="0;1"
		          keySplines="0.25 0.8 0.25 1"
		          repeatCount="1"
		        />
	       </image>
	    </g>
	)
}

