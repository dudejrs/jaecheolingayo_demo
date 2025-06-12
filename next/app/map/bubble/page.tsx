"use client"
import {useState, useCallback, useEffect} from "react"
import proj4 from 'proj4';
import {Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import ReactMarkdown from 'react-markdown';
import BubbleMap from "./bubbleMap"

const WGS84 = 'EPSG:4326';
const UTMK = 'EPSG:5179';

proj4.defs(UTMK, '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');

const seoulBBox = {
  min : {
  	lon: 126.769815,
  	lat: 37.42764
  },
  max : {
  	lon: 127.186828,
  	lat: 37.703621
  }
};

interface LatLng {
	lon: number
	lat: number
}

interface UTMKPoint {
	x: number 
	y: number
}
type CoordType = "UTM-K" | "LatLng"

type Coord = LatLng | UTMKPoint

type Data<T> = {
	coord : T
	data : number
}


type CalculateFunc = (v: number[]) => number

function randomInRange(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

function generateRandomLatLng(count: number): LatLng[] {
	const arr: LatLng[] = [];

	for (let i = 0; i < count; i++) {
		arr.push({
			lon: randomInRange(seoulBBox.min.lon, seoulBBox.max.lon),
			lat: randomInRange(seoulBBox.min.lat, seoulBBox.max.lat)
		});
	}

	return arr;
}

function generateRandomUTMK(count: number) : UTMKPoint[] {
	const latlngPoints = generateRandomLatLng(count);
	return latlngPoints.map(latLngToUTMK)
}

function utmkToLatLng({x, y}: UTMKPoint): LatLng {
	const [lon, lat] = proj4(UTMK, WGS84, [x, y]);
	return {lon, lat};
}

function latLngToUTMK({lon, lat}: LatLng): UTMKPoint {
	const [x, y] = proj4(WGS84, UTMK, [lon, lat]);
	return {x, y};
}

function generateRandomData(count: number) {
	const coords = generateRandomUTMK(count);

	return coords.map(coord => { return{
		coord : coord,
		data : Math.floor(randomInRange(1, 1000))
	}})
}

function* generateRandomDatum() {
	while (true) {
		const [coord] = generateRandomUTMK(1);

		yield {
			coord : coord,
			data : Math.floor(randomInRange(1, 1000))
		}
	}
}

function calculateMax(values: number[]) {
	if (!values || values.length == 0) {
		return 0;
	}
	return Math.max(...values);
}

function calculateMin(values: number[]) {
	if (!values || values.length == 0) {
		return 0;
	}
	return Math.min(...values);
}

function calculateAverage(values: number[]) {
	if (!values || values.length == 0) {
		return 0;
	}
	return values.reduce((acc, v) => acc+v, 0);
}

function calculateRatioFromLatLng(p1: LatLng, p2: LatLng) {
	const {x: x1, y: y1} = latLngToUTMK(seoulBBox.min);
	const {x: x2, y: y2} = latLngToUTMK(seoulBBox.max)

	return {
		width : Math.abs(x2 - x1),
		height : Math.abs(y2 - y1)
	}
}

export default function MapPage() {
	const [type, setType] = useState<CoordType>("UTM-K");
	const [calculateFunc, setCalculateFunc] = useState<CalculateFunc>(() =>calculateMax)
	const [data, setData] = useState<Data<Coord> []>(generateRandomData(101));

	const handleChange= useCallback((i : number)=> {
		if (i === 0) {
			setType("UTM-K")
		} else {
			setType("LatLng")
		}
	}, [])


	return (
		<TabGroup className="w-full flex flex-col justify-center" onChange={handleChange}>
			<div>
				{type}
			</div>
			<TabPanels>
				<TabPanel>
					<BubbleMap 
						base={latLngToUTMK(seoulBBox.min)} ratio={calculateRatioFromLatLng(seoulBBox.min, seoulBBox.max)} 
						data={data as Data<UTMKPoint>[] } calculateFunc={calculateFunc} 
						generateRandomDatum={generateRandomDatum()}
					/>
					<ReactMarkdown>
					</ReactMarkdown>
				</TabPanel>
				<TabPanel>
				</TabPanel>
			</TabPanels>
			<TabList className="w-full flex  justify-center gap-4">
				<Tab className="p-1 border-1 rounded-full bg-white border-white/50 transition duration-300 data-selected:bg-blue-500 cursor-pointer"> </Tab>
				<Tab className="p-1 border-1 rounded-full bg-white border-white/50 transition duration-300 data-selected:bg-blue-500 cursor-pointer"> </Tab>
			</TabList>
		</TabGroup>
		);
}