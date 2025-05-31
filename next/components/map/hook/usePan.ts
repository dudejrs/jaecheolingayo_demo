import {RefObject, useRef} from 'react'
import {Point, Ratio} from "../types";

export default function usePan(svgRef: RefObject<SVGSVGElement | null>, ratio: Ratio, base: Point, setBase: (p: Point) => void) {
  const dragging = useRef(false);
  const lastPoint = useRef<Point | null>(null);

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    dragging.current = true;
    lastPoint.current = new Point(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current || !lastPoint.current || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const newPoint = new Point(e.clientX, e.clientY);
    const delta = newPoint.minus(lastPoint.current);

    const realRatio = new Ratio(rect.width, rect.height);
    const reflected = delta.xAxisReflected;
    const newBase = reflected.convert(realRatio, ratio, base);

    setBase(newBase);
    lastPoint.current = newPoint;
  };

  const onMouseUp = () => {
    if (!svgRef.current) return
    dragging.current = false;
  };

  return { onMouseDown, onMouseMove, onMouseUp };
}
