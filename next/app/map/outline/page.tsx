'use client'

import {useState, useCallback, useEffect} from "react"
import type {LatLng, UTMKPoint} from '@/lib/geoutils'
import {utmkToLatLng,latLngToUTMK, generateRandomLatLng, generateRandomUTMK } from '@/lib/geoutils'

import {Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import {Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

import StepperInput from "@/components/stepperInput"
import Markdown from '@/components/markdown';

import ScatterMap from "./scatterMap"

const content =`
#### 군집의 외곽선 

`
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

type CoordType = "UTM-K" | "LatLng"

type Coord = LatLng | UTMKPoint

type Data<T> = {
	coord : T
	type : number
}

function generateRandomData(k: number, n: number) {
	const centroids = generateRandomLatLng(seoulBBox.min, seoulBBox.max, k);
	const r = (seoulBBox.min.lon - seoulBBox.max.lon) / (k + 5)

	const data = []
	
	for (let i = 0; i < k; i++) {
		const {lat, lon} = centroids[i];

		const n_ = Math.floor( Math.random() * (n - 3)) + 3
		const min = {
			lon : lon - r,
			lat : lat - r
		}

		const max = {
			lon : lon + r,
			lat : lat + r
		}

		const data_ = generateRandomUTMK(min, max, n_)
			.map(coord => {
				return {
					coord: coord,
					type: i
				}
			})

		data.push(...data_);
	}

	return data
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
		setData(generateRandomData(K, N))
	},[K, N])

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
					</TabPanel>
					<TabPanel>
						<div className="w-150 h-150"/>
					</TabPanel>
					<div className="absolute bottom-4 right-4 p-4 rounded-lg bg-[var(--color-background)]/50">
						<div className="flex w-45 justify-between items-center">
							<div className="font-bold">K</div>
							<StepperInput className="w-30" value={K} min={3} max={12} onChange={setK}/>
						</div>
						<div className="flex w-45 justify-between items-center">
							<div className="font-bold">N</div>
							<StepperInput className="w-30" value={N} min={3} max={100} step={5} onChange={setN}/>
						</div>
						<div className="flex w-45 justify-between items-center">
							<div className="font-bold">M</div>
							<StepperInput className="w-30" value={M} min={50} max={500} step={50} onChange={setM}/>
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