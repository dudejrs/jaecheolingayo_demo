'use client';

import {useEffect, useState} from 'react';
import {Point, Ratio} from './types';
import {Path} from './geojson/types';
import {GeoJsonToPaths} from './geojson';


type Px = `${number}px` | `${number}.${number}px`

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

const DEFAULT_PATH_STYLES: StyleProps= {
	strokeWidth: "0.8px",
	fill:"var(--color-background-alt)",
	stroke:"var(--color-border)"
}

function isPx(value: Px | number | undefined ): value is Px {
	if (!value) {
		return false;
	}

  return (
    typeof value === 'string' &&
    /^\d+(\.\d+)?px$/.test(value)
  );
}

function calculateStrokeWidth(strokeWidth: Px | number | undefined=1, targetRatio: Ratio, originRatio: Ratio) {
	if (isPx(strokeWidth)) {
		strokeWidth = Number.parseFloat(strokeWidth)
	}
	return originRatio.min * strokeWidth / targetRatio.min 
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

	const [ratio, setRatio] = useState<Ratio>(Ratio.create(DEFAULT_RATIO, width, height))
	const [base, setBase] = useState<Point>(ratio.originPointOf(DEFAULT_MID_POINT)) 
	const [paths, setPaths] = useState<Path[]>([]);
	
	const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
		const svg = event.currentTarget;
		const rect = svg.getBoundingClientRect();

		const clientPoint = new Point(event.clientX, event.clientY)
		const basePoint = new Point(rect.left, rect.top);
		const relativePoint = clientPoint.minus(basePoint)
		const realRatio = new Ratio(rect.width, rect.height)
		const invertedPoint = realRatio.invertY(relativePoint)
		const newMidPoint =  invertedPoint.convert(realRatio,ratio,base)

		moveTo(newMidPoint)
  };

  const moveTo = (midPoint: Point) => {
  	const newBasePoint = ratio.originPointOf(midPoint)
  	setBase(newBasePoint)
  }


	useEffect(()=>{
		fetch('/data/boundaries.json')
			.then(res => res.json())
			.then(res => res.map(GeoJsonToPaths))
			.then(setPaths)
			.catch((err) => console.error('GeoJSON을 로드하고 SVG Path 엘리먼트로 변환하는데 실패하였습니다.:', err));

	},[])

	return (
		<div>
			{
				children
			}
			<svg className={`${className}`} fill={`${fill}`} width={width} height={height} viewBox={`${base.x} ${base.y} ${ratio.width} ${ratio.height}`} xmlns="http://www.w3.org/2000/svg"
				style={{ transform: 'scaleY(-1)' }} onClick={handleClick}>
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

// 1000 = 1px/600px * 72000