"use client"
import {useState, useCallback, useEffect} from "react"
import proj4 from 'proj4';
import {Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import {Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

import StepperInput from "@/components/stepperInput"
import Markdown from '@/components/markdown';
import BubbleMap from "./bubbleMap"
import ScatterMap from "./scatterMap"

const content =`
#### K-Means 버블맵 

##### K-Means 알고리즘 
K-Means 알고리즘의 흐름은 다음과 같습니다. 
	1. 처음에 랜덤한 K개의 점을 군집의 초기 중심점으로 지정합니다. 
	2. 각 점들은 자신과 가장 가까운 군집의 중심점을 자신의 군집으로 정합니다.
	3. 위에서 정한 군집을 바탕으로 군집의 중심점의 좌표를 다시 계산합니다. 
	4. 2~3번을 N회 반복합니다. 

##### K-Means 버블맵의 주요 파라미터
K-Means 버블맵의 주요 조절 가능한 파라미터는 다음과 같습니다.
	1. 초기 중심점 : 초기 중심점을 지정하여, 결과의 랜덤성을 줄일 수 있습니다. 
	2. K : 최대로 맵을 줌 아웃 했을 떄 보이는 군집화의 갯수입니다. 맵을 줌인하면 비례하여 증가합니다. 
	3. N : 군집화 과정을 반복하는 회수. 값이 높을수록 결과의 랜덤성을 줄일 수 있습니다. 
	4. 군집화 결과 : 군집화의 결과로 표시되는 값이며 최댓값 / 평균 / 최저값 / 갯수 를 표시합니다.

##### K-Means 버블맵 예제 설명 
옆의 지도는 서울 서울 주위에 랜덤지점을 M개 생성한 예제입니다. 
각 랜덤 지점 M개는 고유한 랜덤값을 0~1000 사이의 값을 가지며, 선택한 군집화 결과에 따라 군집화의 최댓값/평균/최저값/갯수를 확인할 수 있습니다.
또한 지도의 파라미터 중 K, N, M을 변화 시켜 변화를 확인할 수 있습니다. 
지도를 이동하면 생성된 데이터의 분포 및 SVG컴포넌트와 네이버 MAP API 컴포넌트에 K-Means 버블맵을 적용한 결과를 볼 수 있습니다. 
(네이버 MAP API 컴포넌트는 빠른 시일내 작업해서 비교해볼 예정)
`

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
	return Math.floor(values.reduce((acc, v) => acc+v, 0) / values.length);
}

function calculateCount(values: number[]) {
	if (!values || values.length == 0) {
		return 0;
	}
	return values.reduce((acc, v) => acc+1, 0);
}

function calculateRatioFromLatLng(p1: LatLng, p2: LatLng) {
	const {x: x1, y: y1} = latLngToUTMK(seoulBBox.min);
	const {x: x2, y: y2} = latLngToUTMK(seoulBBox.max)

	return {
		width : Math.abs(x2 - x1),
		height : Math.abs(y2 - y1)
	}
}

const calculationFunctions = [
	{name : "최대값", f : calculateMax},
	{name : "최소값", f : calculateMin},
	{name : "평균", f : calculateAverage},
	{name : "갯수", f : calculateCount},
]

export default function MapPage() {
	const [type, setType] = useState<CoordType>("UTM-K");
	const [calculateFunc, setCalculateFunc] = useState(calculationFunctions[0])
	const [K, setK] = useState(5);
	const [N, setN] = useState(20);
	const [M, setM] = useState(100);
	const [data, setData] = useState<Data<Coord> []>([]);

	const handleChange= useCallback((i : number)=> {
		if (i === 0) {
			setType("UTM-K")
		} else {
			setType("LatLng")
		}
	}, [])

	useEffect(() => {
		setData(generateRandomData(M))
	},[M])

	return (
		<TabGroup className="w-full flex flex-wrap justify-center gap-8" onChange={handleChange}>
			<div className="w-150 flex flex-col gap-4">
				<TabPanels className="relative">
					<TabPanel>
						<ScatterMap base={latLngToUTMK(seoulBBox.min)} ratio={calculateRatioFromLatLng(seoulBBox.min, seoulBBox.max)} 
							data={data as Data<UTMKPoint>[]}
						/>
					</TabPanel>
					<TabPanel>
						<BubbleMap 
							base={latLngToUTMK(seoulBBox.min)} ratio={calculateRatioFromLatLng(seoulBBox.min, seoulBBox.max)} 
							data={data as Data<UTMKPoint>[] } calculateFunc={calculateFunc.f} 
							generateRandomDatum={generateRandomDatum()}
							k={K}
							n={N}
						/>
					</TabPanel>
					<TabPanel>
						<div className="w-150 h-150"/>
					</TabPanel>

					<div className="absolute bottom-4 right-4 p-4 rounded-lg bg-[var(--color-background)]/50">
						<div className="flex w-45 justify-between items-center">
							<div className="font-bold">K</div>
							<StepperInput className="w-30" value={K} min={1} max={10} onChange={setK}/>
						</div>
						<div className="flex w-45 justify-between items-center">
							<div className="font-bold">N</div>
							<StepperInput className="w-30" value={N} min={1} max={100} step={5} onChange={setN}/>
						</div>
						<div className="flex w-45 justify-between items-center">
							<div className="font-bold">M</div>
							<StepperInput className="w-30" value={M} min={50} max={500} step={50} onChange={setM}/>
						</div>
						<div className="flex w-45 justify-between items-center">
							<div className="font-bold">결과값</div>
							<Listbox value={calculateFunc} onChange={setCalculateFunc}>
								<ListboxButton className="w-30 cursor-pointer">{calculateFunc.name}</ListboxButton>
								<ListboxOptions anchor="bottom" className="w-30 text-center cursor-pointer">
										{calculationFunctions.map((func, i)=> (
												<ListboxOption key={i} value={func}>
														{func.name}
												</ListboxOption>
												))}
								</ListboxOptions>
							</Listbox>
						</div>
					</div>
				</TabPanels>
				<TabList className="w-50 flex w-full justify-center gap-4">
					<Tab className="p-1 border-1 rounded-full bg-white border-white/50 transition duration-300 data-selected:bg-blue-500 cursor-pointer"> </Tab>
					<Tab className="p-1 border-1 rounded-full bg-white border-white/50 transition duration-300 data-selected:bg-blue-500 cursor-pointer"> </Tab>
					<Tab className="p-1 border-1 rounded-full bg-white border-white/50 transition duration-300 data-selected:bg-blue-500 cursor-pointer"> </Tab>
				</TabList>
				
			</div>
			<Markdown content={content} className="w-150">

			</Markdown>
		</TabGroup>
		);
}