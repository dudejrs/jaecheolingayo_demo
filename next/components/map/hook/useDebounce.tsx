import {useCallback, useEffect, useRef} from "react"

export default function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, delay: number=100) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const savedCallback = useRef(callback)

	useEffect(()=> {
		savedCallback.current = callback
	},[callback])

	const debounceFn = useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			timeoutRef.current = setTimeout(()=>{
				savedCallback.current(...args)
			}, delay)
		}, [delay]);

	useEffect(()=>{
		return ()=> {
			if(timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	},[])

	return debounceFn;
}