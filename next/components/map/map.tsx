'use client';

import {useEffect, useState, useRef} from 'react';
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

enum ZOOM_DIRECTION {
	IN, OUT
}

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)
const ZOOM_FACTOR = 1.12; 
const MIN_VIEWBOX_SIZE = 10000;

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

	const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef<boolean>(false);
  const movedDuringPress = useRef(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastPoint = useRef<Point| null>(null);

  const startLongPressTimer = (event: React.MouseEvent<SVGSVGElement>) => {
    longPressTimer.current = setTimeout(() => {
      if (!movedDuringPress.current) {
        handleLongPress(event);
      }
    }, 1000);
  };

   const cancelLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    dragging.current = true;
    movedDuringPress.current = false;
    lastPoint.current = new Point(event.clientX, event.clientY);
    startLongPressTimer(event)
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !dragging.current || !lastPoint.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientPoint = new Point(event.clientX, event.clientY)
    const relativePoint = clientPoint.minus(lastPoint.current)

    if (relativePoint.distanceFromOrigin > 5) {
    	movedDuringPress.current = true;
    	cancelLongPressTimer();
    }

    const realRatio = new Ratio(rect.width, rect.height)
    const reflectedPoint = relativePoint.xAxisReflected

    const newBasePoint = reflectedPoint.convert(realRatio, ratio, base)
    setBase(newBasePoint)

    lastPoint.current = clientPoint
  };

  const handleMouseUp = () => {
    dragging.current = false;
    cancelLongPressTimer();
  };

	
	const handleLongPress = (event: React.MouseEvent<SVGSVGElement>) => {
		if (!svgRef.current) return

		const svg = svgRef.current;
		const rect = svg.getBoundingClientRect();

		const clientPoint = new Point(event.clientX, event.clientY)
		const basePoint = new Point(rect.left, rect.top);
		const relativePoint = clientPoint.minus(basePoint)
		const realRatio = new Ratio(rect.width, rect.height)
		const invertedPoint = realRatio.invertY(relativePoint)
		const newMidPoint =  invertedPoint.convert(realRatio,ratio,base)

		moveTo(newMidPoint, ratio)
  };


  const zoom = (midPoint: Point, direction: ZOOM_DIRECTION) => {
    const r = direction === ZOOM_DIRECTION.IN ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
    const new_ratio = ratio.scale(r)
		moveTo(midPoint, new_ratio)
		setRatio(ratio.scale(r))
  };

  const handleDoubleClick = (event: React.MouseEvent<SVGSVGElement>) => {
  	if (!svgRef.current) return

  	const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();

    const clientPoint = new Point(event.clientX, event.clientY)
		const basePoint = new Point(rect.left, rect.top);
		const relativePoint = clientPoint.minus(basePoint)
		const realRatio = new Ratio(rect.width, rect.height)
		const invertedPoint = realRatio.invertY(relativePoint)
		const newMidPoint =  invertedPoint.convert(realRatio,ratio,base)

    zoom(newMidPoint, ZOOM_DIRECTION.IN);
  };

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const direction = event.deltaY < 0 ? ZOOM_DIRECTION.IN : ZOOM_DIRECTION.OUT;
   	const midPoint = base.midPointOf(ratio)
   	zoom(midPoint, direction)
  };

  const moveTo = (midPoint: Point, ratio: Ratio) => {
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

	useEffect(()=>{
		console.log(base)
	}, [base])

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
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					onDoubleClick={handleDoubleClick}
					onWheel={handleWheel}
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

// 1000 = 1px/600px * 72000