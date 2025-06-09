import { RefObject } from 'react';
import {Point, Ratio} from "../types"

export default function useFocusClick(svgRef: RefObject<SVGSVGElement | null>, ratio: Ratio, setRatio: (r: Ratio) => void, base: Point, setBase: (p: Point) => void, duration: number = 1000) {

	const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
		if (!svgRef.current) return

		const svg = svgRef.current;
		const rect = svg.getBoundingClientRect();
		const clientPoint = new Point(e.clientX, e.clientY)
		const basePoint = new Point(rect.left, rect.top);
		const relativePoint = clientPoint.minus(basePoint)
		const realRatio = new Ratio(rect.width, rect.height)
		const invertedPoint = realRatio.invertY(relativePoint)
		const midPoint =  invertedPoint.convert(realRatio,ratio,base)
		const newBasePoint = ratio.originPointOf(midPoint)

  	setBase(newBasePoint)
	}

	return { onClick};
}