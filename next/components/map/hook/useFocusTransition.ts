import { useRef, useEffect } from 'react';
import {Point, Ratio} from "../types"


export default function useFocusTransition(ratio: Ratio, setRatio: (r: Ratio) => void, base: Point, setBase: (p: Point) => void, duration: number = 1000) {
	const isAnimating = useRef(true);
	const ratioRef = useRef<Ratio>(ratio);
	const baseRef = useRef<Point>(base);
	
	useEffect(()=>{
		ratioRef.current = ratio
	},[ratio])

	useEffect(()=>{
		baseRef.current = base
	},[base])

	const onClick = (newRatio: Ratio, newMid: Point) => {
		return function() {
			if (!isAnimating.current) {
				return
			}

			const startTime = performance.now()
			isAnimating.current = false;
			
			const newBase = newRatio.originPointOf(newMid);
			const currentRatio = ratioRef.current
			const currentBase = baseRef.current

			function step(currentTime: number) {
				const elapsed = currentTime - startTime;
				const t = Math.min(elapsed / duration, 1);

				const interPolatePoint = currentBase.lerp(t, newBase);
				const interPolateRatio = currentRatio.lerp(t, newRatio);
				
				setBase(interPolatePoint)
				setRatio(interPolateRatio)


				if (t < 1) {
					requestAnimationFrame(step);
				} else {
					isAnimating.current = true
				}
			}

			requestAnimationFrame(step);
		}
	}

	return { onClick };
}