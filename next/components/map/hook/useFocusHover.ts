import { useRef, useEffect, useState } from 'react';
import {Point, Ratio} from "../types"


interface State {
	base: Point
	ratio: Ratio 
}


export default function useFocusHover(ratio: Ratio, setRatio: (r: Ratio) => void, base: Point, setBase: (p: Point) => void, duration: number = 1000) {
	const isAnimating = useRef(true);
	const isMouseLeaved = useRef(false);
	const ratioRef = useRef<Ratio>(ratio);
	const baseRef = useRef<Point>(base);
	
	const [state, setState_] = useState<State>({
		base : baseRef.current,
		ratio : ratioRef.current
	})

	useEffect(()=>{
		ratioRef.current = ratio
	},[ratio])

	useEffect(()=>{
		baseRef.current = base
	},[base])

	const onFocus = (newRatio: Ratio, newMid: Point) => {
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

	const onMouseEnter = (newRatio: Ratio, newMid: Point) => {
		
		return function(){
			if (isMouseLeaved.current) {
				return
			}

			isAnimating.current = true

			const startTime = performance.now()
			const newBase = newRatio.originPointOf(newMid);
			const currentBase = baseRef.current
			const currentRatio = ratioRef.current
			
			setState_({base:currentBase, ratio:currentRatio});

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
					isAnimating.current = false
				}
			}
			requestAnimationFrame(step);
		}
	}

	const onMouseLeave = () => {
		return function(){
			const startAnimation = () => {				
				const startTime = performance.now()
				isMouseLeaved.current = true
				
				const {base : newBase, ratio : newRatio} = state 

				const currentBase = baseRef.current
				const currentRatio = ratioRef.current

				function step(currentTime: number) {
					const elapsed = currentTime - startTime;
					const t = Math.min(elapsed / duration, 1);

					const interPolatePoint = currentBase.lerp(t, newBase);
					const interPolateRatio = currentRatio.lerp(t, newRatio);
					
					setBase(interPolatePoint)
					setRatio(interPolateRatio)


					if (t < 1 ) {
						requestAnimationFrame(step);
					} else {
						isMouseLeaved.current = false
					}
				}
				requestAnimationFrame(step);	
			}

			const waitAnimating = () => {
				if (isAnimating.current) {
					setTimeout(waitAnimating, 100)
					return
				}
				startAnimation()
			}


			waitAnimating()
		}
	}


	return { onFocus, onMouseEnter, onMouseLeave };
}