'use client'

import {useRef, useState, useEffect} from 'react'
import Script from 'next/script'

declare global {
  interface Window { naver: typeof naver }
}

interface NaverMapProps {
	width: number 
	height: number
	className? : string
}

export default function NaverMap({width, height} : NaverMapProps){
	const mapRef = useRef(null)
	const [mapLoaded, setMapLoaded] = useState(false);
	const lat = 37.3595704
	const lng = 127.105399

	function checkZoom(proj : naver.maps.MapSystemProjection) {
		const p1 = new naver.maps.Point(0, 0);
		const p2 = new naver.maps.Point(1, 0);
		const c1 = proj.fromOffsetToCoord(p1);
		const c2 = proj.fromOffsetToCoord(p2);

		return proj.getDistance(c1, c2) * Math.max(width, height)
	}
	
	useEffect(()=> {
		const {naver} = window;
		
		if (!mapRef?.current || !mapLoaded || !naver) {
			console.log(mapRef, mapLoaded, naver)
			return 
		}
		const location = new naver.maps.LatLng(lat,lng);
		const map = new naver.maps.Map(mapRef.current, {
			center : location,
			zoom: 0,
		});

		const marker = new naver.maps.Marker({
			position: location,
			map,
		})

		map.addListener('zoom_changed', function(zoom : number) {
			const proj = map.getProjection() 
			const distance = checkZoom(proj)
		});

	}, [mapLoaded])



	return (
		<>
		<Script
	        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NOVEMBER}`}
	        strategy="afterInteractive" 
	        onReady={()=>setMapLoaded(true)}
	      />
		{
			mapLoaded && <div ref={mapRef} style={{width, height}}>
			</div>
		}
		</>
		)
}