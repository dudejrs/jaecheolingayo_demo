import {RefObject, useRef} from 'react';
import {Point, Ratio} from "../types"

const DEFAULT_ZOOM_FACTOR = 1.2; 

const enum ZOOM_DIRECTION {
	IN, OUT
}

export default function  useZoom (
  svgRef: RefObject<SVGSVGElement | null>, 
  ratio: Ratio, 
  setRatio: (r: Ratio) => void, 
  base: Point, setBase: (p: Point) => void, 
  zoomFactor:number = DEFAULT_ZOOM_FACTOR
) {

	const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
	const isWheelEnabled = useRef(true);

  const zoom = (midPoint: Point, direction: ZOOM_DIRECTION, zoomFactor: number) => {
    if (!svgRef.current) return

    const factor = direction === ZOOM_DIRECTION.IN ? 1 / zoomFactor : zoomFactor;
    const newRatio = ratio.scale(factor);
    const newBase = newRatio.originPointOf(midPoint);
    setBase(newBase);
    setRatio(newRatio);
  };

  const onDoubleClick = (event: React.MouseEvent<SVGSVGElement> ) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientPoint = new Point(event.clientX, event.clientY);
    const relative = clientPoint.minus(new Point(rect.left, rect.top));
    const realRatio = new Ratio(rect.width, rect.height);
    const inverted = realRatio.invertY(relative);
    const midPoint = inverted.convert(realRatio, ratio, base);
    zoom(midPoint, ZOOM_DIRECTION.IN, zoomFactor);
  };

  const onWheel = (event: React.WheelEvent<SVGSVGElement>) => {
  	if (!svgRef.current || !isWheelEnabled.current) return;

    isWheelEnabled.current = false;

    const zoomStrength = 0.005; 
    const delta = event.deltaY;
    const scaleAmount = Math.exp(-delta * zoomStrength);

    const direction = event.deltaY < 0 ? ZOOM_DIRECTION.IN : ZOOM_DIRECTION.OUT;
    const midPoint = base.midPointOf(ratio);
    zoom(midPoint, direction, Math.sqrt(zoomFactor* 0.9));

    wheelTimeout.current = setTimeout(() => {
    	isWheelEnabled.current = true;
  	}, 10 * scaleAmount);
  };

  return { onDoubleClick, onWheel };
}