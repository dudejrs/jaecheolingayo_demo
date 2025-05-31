'use client';

import {useEffect, useState, useRef} from 'react';
import {Point, Ratio, Px} from './types';
import {Path} from './geojson/types';
import {useGeoJson} from './geojson';
import {usePan, useZoom, useViewbox} from "./hook"
import {calculateStrokeWidth} from './util'

interface StyleProps {
	stroke?: string
	fill?: string,
	strokeWidth?: Px | number,
}

interface MapProps extends StyleProps {
	width?: number,
	height?: number,
  children?: React.ReactNode
  className?: string
  pathStyles?: StyleProps
} 

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

const DEFAULT_PATH_STYLES: StyleProps = {
	strokeWidth: "0.8px",
	fill:"var(--color-background-alt)",
	stroke:"var(--color-border)"
}

export default function Map({
	width = 600,
	height = 600,
	children,
	strokeWidth=1,
	className = "",
	fill="",
	pathStyles=DEFAULT_PATH_STYLES
} : MapProps) {

	const svgRef = useRef<SVGSVGElement | null>(null);
  const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height)
  const {onMouseDown, onMouseMove, onMouseUp} = usePan(svgRef, ratio, base, setBase)
  const {onDoubleClick, onWheel} = useZoom(svgRef,ratio, setRatio, base, setBase, 1.5)
  const paths: Path[] = useGeoJson('/data/boundaries.json')


	return (
		<div>
			{
				children
			}
			<svg
					ref={svgRef} 
					className={`${className}`} 
					fill={`${fill}`} 
					width={width} 
					height={height} 
					viewBox={`${base.x} ${base.y} ${ratio.width} ${ratio.height}`} 
					xmlns="http://www.w3.org/2000/svg"
					style={{ transform: 'scaleY(-1)' }} 
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseUp={onMouseUp}
					onMouseLeave={onMouseUp}
					onDoubleClick={onDoubleClick}
					onWheel={onWheel}
				>
			  <g id="regions">
			  	{paths.map((d, idx) => (
			  		<path
			  			key={idx}
			  			d={d}
			  			{...pathStyles}
			  			strokeWidth={calculateStrokeWidth(pathStyles.strokeWidth, new Ratio(width, height), ratio)}
			  			style={{ cursor: 'pointer' }}
			  			/>
	  			))}
			  </g>
			</svg>
		</div>
		);
}
