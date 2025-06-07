'use client';

import {useEffect, useState, useRef, useMemo} from 'react';
import Map from "./map";
import {Point, Ratio, Px} from './types';
import {Path, PathInformation} from './geojson/types';
import {useGeoJson} from './geojson';
import {usePan, useZoom, useViewbox} from "./hook"
import {calculateStrokeWidth, calculateSize} from './util'


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
					<filter id="terrainTexture">
					  <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise"/>
					  <feDisplacementMap in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G"/>
					</filter>


					<filter id="dropShadow">
						<feDropShadow dx={calculateSize(1.5, new Ratio(width, height), ratio)} dy={calculateSize(1.5, new Ratio(width, height), ratio)} stdDeviation={calculateSize(3, new Ratio(width, height), ratio)} floodColor="gray" floodOpacity="0.125"/>
					</filter>

					<filter id="dropShadow2">
						<feDropShadow dx={calculateSize(1.5, new Ratio(width, height), ratio)} dy={calculateSize(1.5, new Ratio(width, height), ratio)} stdDeviation={calculateSize(4.5, new Ratio(width, height), ratio)} floodColor="black" floodOpacity="0.5"/>
					</filter>

					<filter id="water-filter">
				      <feTurbulence id="feTurb" type="fractalNoise" baseFrequency="0.0005 0.0005" seed="7" numOctaves="2" />
				      <animate xlinkHref="#feTurb" attributeName="baseFrequency" dur="40s" keyTimes="0;0.5;1" values="0.00004 0.000075;0.000075 0.00004;0.00004 0.000075" repeatCount="indefinite"/>
				      <feDisplacementMap id="feDisp" in="SourceGraphic" scale={calculateSize(33, new Ratio(width, height), ratio)} />
				    </filter>

					<pattern id="water" width={calculateSize(1000, new Ratio(width, height), ratio)} height={calculateSize(750, new Ratio(width, height), ratio)} patternUnits="userSpaceOnUse">
						<image href="/water.jpg" width={calculateSize(1000, new Ratio(width, height), ratio)} height={calculateSize(750, new Ratio(width, height), ratio)} />
					</pattern>
				</defs>

				<rect x={-DEFAULT_RATIO.width * 2} y={-DEFAULT_RATIO.height * 2} width={DEFAULT_RATIO.width * 4} height={DEFAULT_RATIO.height * 4} fill="url(#water)" filter="url(#water-filter)"/>

				<g id="ctprvn_regions" filter="url(#dropShadow2)">
				  	{ctprvn_paths.map(({path: p, ...properties}, idx) => (
				  		<path
				  			key={idx}
				  			className={`${getNameProperties(properties)}`}
				  			d={p}
				  			{...ctprvnPathStyles}
				  			strokeWidth={calculateStrokeWidth(0.2, new Ratio(width, height), ratio)}
				  			style={{ cursor: 'pointer' }}
				  			{...getStyles(getNameProperties(properties), styles)}
				  			fill="rgba(255,255,255,1)"
				  			filter="url(#dropShadow)"
				  			/>
		  			))}
				</g>
				<g id="sig_regions">
					{
						shouldLoadSigPaths && ratio.min < DEFAULT_RATIO.min / 2 && sig_paths.length > 0 && 
							sig_paths.map(({path: p, ...properties}, idx) => (
								<path
									key={`sig-${idx}`}
									className={`${getNameProperties(properties)}`}
									d={p}
									{...sigPathStyles}
									strokeWidth={calculateStrokeWidth(0.3, new Ratio(width, height), ratio)}
									style={{ cursor: 'pointer'}}
									{...getStyles(getNameProperties(properties), styles)}
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

