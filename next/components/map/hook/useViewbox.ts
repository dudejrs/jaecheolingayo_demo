import {useState} from 'react'
import {Ratio, Point} from '../types'

export default function useViewBox(bound: Ratio, origin: Point, mid: Point, width: number, height: number) {
	const [ratio, setRatio] = useState<Ratio>(Ratio.create(bound, width, height))
	const [base, setBase] = useState<Point>(ratio.originPointOf(mid)) 

  	function clampBaseToBounds(base: Point, ratio: Ratio): Point {
  		const min = origin.minusRatio(bound).plusRatio(ratio.half)
  		const max = origin.plusRatio(bound).minusRatio(ratio.half)

  		return base.clamped(min, max)
	}

	function safeSetBase(nextBase: Point) {
	  setBase(clampBaseToBounds(nextBase, ratio));
	}

	return {ratio, setRatio, base, "setBase" : safeSetBase}
}