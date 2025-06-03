'use client';

import {useEffect, useState, useRef, useMemo} from 'react';
import {Point, Ratio, Px} from './types';
import {Path} from './geojson/types';
import {useGeoJson} from './geojson';
import {usePan, useZoom, useViewbox} from "./hook"
import {calculateStrokeWidth} from './util'


export interface ViewBoxProps {
	base: Point
	setBase: (b: Point) => void
	ratio: Ratio,
	setRatio: (r: Ratio) => void
}

export interface StyleProps {
	stroke?: string
	fill?: string,
	strokeWidth?: Px | number,
	strokeOpacity? : string
}

export interface MapProps extends StyleProps {
	width?: number,
	height?: number,
  children?: React.ReactNode
  className?: string
  ctprvnPathStyles?: StyleProps
  sigPathStyles?: StyleProps
} 

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)

const DEFAULT_CTPRVN_PATH_STYLES: StyleProps = {
	strokeWidth: "0.8px",
	fill:"var(--color-background-alt)",
	stroke:"var(--color-border)"
}

const DEFAULT_SIG_PATH_STYLES: StyleProps = {
	strokeWidth: "0.6px",
	fill:"none",
	stroke:"var(--color-border)",
	strokeOpacity: "0.5"
}

export default function Map({
	width = 600,
	height = 600,
	children,
	strokeWidth=1,
	className = "",
	fill="",
	ctprvnPathStyles=DEFAULT_CTPRVN_PATH_STYLES,
	sigPathStyles=DEFAULT_SIG_PATH_STYLES,
	ratio,
	setRatio,
	base,
	setBase
} : MapProps & ViewBoxProps) {

	const svgRef = useRef<SVGSVGElement | null>(null);
	const {onMouseDown, onMouseMove, onMouseUp} = usePan(svgRef, ratio, base, setBase)
	const {onDoubleClick, onWheel} = useZoom(svgRef,ratio, setRatio, base, setBase, 1.5)

	const ctprvn_paths: Path[] = useGeoJson('/data/ctprvn_boundaries.json')
	const [shouldLoadSigPaths, setShouldLoadSigPaths] = useState(false);
	const sig_paths : Path[] = useGeoJson('/data/sig_boundaries.json', shouldLoadSigPaths)

	useEffect(() => {
		if (!shouldLoadSigPaths && ratio.min < 360000) {
			setShouldLoadSigPaths(true);
		}
	}, [ratio.min, shouldLoadSigPaths]);

	useEffect(()=> {
	},[shouldLoadSigPaths])

	return (
		<div>
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
				<g id="ctprvn_regions">
				  	{ctprvn_paths.map((d, idx) => (
				  		<path
				  			key={idx}
				  			d={d}
				  			{...ctprvnPathStyles}
				  			strokeWidth={calculateStrokeWidth(ctprvnPathStyles.strokeWidth, new Ratio(width, height), ratio)}
				  			style={{ cursor: 'pointer' }}
				  			/>
		  			))}
				</g>
				<g>
				{
					shouldLoadSigPaths && ratio.min < 360000 && sig_paths.length > 0 && 
						sig_paths.map((d, idx) => (
							<path
								key={`sig-${idx}`}
								d={d}
								{...sigPathStyles}
								strokeWidth={calculateStrokeWidth(sigPathStyles.strokeWidth, new Ratio(width, height), ratio)}
								style={{ cursor: 'pointer', fill: 'rgba(0,0,0,0)' }}
							/>
						))
				}
				</g>	
				{
					children
				}
			</svg>
		</div>
		);
}
