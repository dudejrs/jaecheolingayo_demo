'use client';

import {useEffect, useState, useRef, useMemo} from 'react';
import Map from "../map";
import {Point, Ratio, Px} from '../types';
import {Path, PathInformation} from '../geojson/types';
import {useGeoJson} from '../geojson';
import {usePan, useZoom, useViewbox} from "../hook"
import {calculateStrokeWidth, calculateSize} from '../util'
import ImageMarker from "../marker/image"


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
  styles? :  Record<string, StyleProps>
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

function BasePoint({base, ratio, width, height} : {base: Point, ratio: Ratio, width: number, height: number}){
	return (
		<circle cx={base.x - DEFAULT_ORIGIN_POINT.x} cy={DEFAULT_RATIO.height - base.y + DEFAULT_ORIGIN_POINT.y} r={calculateStrokeWidth(30, new Ratio(width, height), ratio)} fill="yellow" />
		)
}

function ViewBox({base, ratio, width, height}: {base: Point, ratio: Ratio, width: number, height: number}) {
	return (
		<rect width={ratio.width} height={ratio.height} x={base.x - DEFAULT_ORIGIN_POINT.x} y={DEFAULT_RATIO.height - base.y +DEFAULT_ORIGIN_POINT.y - ratio.height} strokeWidth={calculateStrokeWidth(10, new Ratio(width, height), ratio)} stroke="blue" fill="None"/>
		)
}

function getNameProperties(properties : {[property: string] : string}) {
	if (!properties) {
		return "알수 없음";
	}
	if (Object.keys(properties).includes("ctp_kor_nm")){
		return properties["ctp_kor_nm"]
	}

	if (Object.keys(properties).includes("full_nm")) {
		return properties["full_nm"]
	}
	return "알수 없음"
}

function getStyles(name: string, styles: {[name: string]: StyleProps}) {
	if (!name || !styles||  !Object.keys(styles).includes(name)) {
		return {}
	}

	return styles[name]
}

export default function StyledMap({
	width = 600,
	height = 600,
	children,
	strokeWidth=1,
	className = "",
	fill="",
	ctprvnPathStyles=DEFAULT_CTPRVN_PATH_STYLES,
	sigPathStyles=DEFAULT_SIG_PATH_STYLES,
	styles = {}
} : MapProps ) {

	const svgRef = useRef<SVGSVGElement | null>(null);
	const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height);
	const {onMouseDown, onMouseMove, onMouseUp} = usePan(svgRef, ratio, base, setBase)
	const {onDoubleClick, onWheel} = useZoom(svgRef,ratio, setRatio, base, setBase, 1.5)

	const ctprvn_paths: PathInformation[] = useGeoJson('/data/ctprvn_boundaries.json', DEFAULT_ORIGIN_POINT.x, DEFAULT_ORIGIN_POINT.y, DEFAULT_RATIO.width, DEFAULT_RATIO.height )
	const [shouldLoadSigPaths, setShouldLoadSigPaths] = useState(false);
	const sig_paths : PathInformation[] = useGeoJson('/data/sig_boundaries.json', DEFAULT_ORIGIN_POINT.x, DEFAULT_ORIGIN_POINT.y, DEFAULT_RATIO.width, DEFAULT_RATIO.height, shouldLoadSigPaths)

	useEffect(() => {
		if (!shouldLoadSigPaths && ratio.min < DEFAULT_RATIO.min / 2) {
			setShouldLoadSigPaths(true);
		}
	}, [ratio, shouldLoadSigPaths]);

	return (
		<div>
			<svg
					ref={svgRef} 
					className={`overscroll-contain ${className}`} 
					fill={`${fill}`} 
					width={width} 
					height={height} 
					viewBox={`${base.x - DEFAULT_ORIGIN_POINT.x} ${DEFAULT_RATIO.height - base.y +DEFAULT_ORIGIN_POINT.y - ratio.height} ${ratio.width} ${ratio.height}`} 
					xmlns="http://www.w3.org/2000/svg"
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseUp={onMouseUp}
					onMouseLeave={onMouseUp}
					onDoubleClick={onDoubleClick}
					onWheel={onWheel}
				>
				<defs>
					<filter id="paintBlue" >
				      <feTurbulence baseFrequency=".0000045" type="fractalNoise" numOctaves="4" seed="137" result="NOISE"/>
				      
				      <feDisplacementMap in="SourceAlpha" scale="10000" result="BLOBS"/>

				      <feColorMatrix in="NOISE" type="matrix" colorInterpolationFilters="sRGB"          
				      	values="0.61 0   0   0   0
				        0   0.96  0   0   0
				        0   0   0.99  0   0
				        0   0   0   1   0.25 " result="COLOURED-NOISE" ></feColorMatrix>
				      
				      <feComposite operator="in" in="COLOURED-NOISE" in2="BLOBS" result="FILL"></feComposite>
				      
				       <feBlend in="FILL" in2="paper" mode="multiply"/>
				    </filter>
				    
				    <filter id="blurEdge" >
				      <feGaussianBlur in="SourceGraphic" stdDeviation={calculateSize(5, new Ratio(width, height), ratio)}/>
				    </filter>

				    <mask id="maskBlur">
				      <use href="#ctprvn_regions2" fill="white" filter="url(#blurEdge)" />
				    </mask>

				    <pattern id="paper" width={calculateSize(2000, new Ratio(width, height), DEFAULT_RATIO)} height={calculateSize(1333, new Ratio(width, height), DEFAULT_RATIO)} patternUnits="userSpaceOnUse">
						<image href="/white-paper-texture.jpg" width={calculateSize(2000, new Ratio(width, height), DEFAULT_RATIO)} height={calculateSize(1333, new Ratio(width, height), DEFAULT_RATIO)} />
					</pattern>
				</defs>

				<rect x={-DEFAULT_RATIO.width * 2} y={-DEFAULT_RATIO.height * 2} width={DEFAULT_RATIO.width * 4} height={DEFAULT_RATIO.height * 4}  fill="url(#paper)"/>

				<defs>
					<g id="ctprvn_regions" >
					  	{ctprvn_paths.map(({path: p, ...properties}, idx) => (
					  		<path
					  			key={idx}
					  			d={p}
					  			stroke="none"
					  			fill="white"
					  			/>
			  			))}
					</g>
					<g id="ctprvn_regions2" >
					  	{ctprvn_paths.map(({path: p, ...properties}, idx) => (
					  		<path
					  			key={idx}
					  			d={p}
					  			stroke="none"
					  			fill="white"
					  			/>
			  			))}
					</g>
				</defs>	
  				<use href="#ctprvn_regions" filter={"url(#paintBlue)"} mask="url(#maskBlur)" />
  		
				{
					children
				}
			</svg>
		</div>
		);
}

