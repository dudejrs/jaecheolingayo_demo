"use client"

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import Markdown from '@/components/markdown';
import {BubbleMap, Map} from "@/components/map"
import {WaterTextureMap, WaterColorMap} from "@/components/map/style"
import NaverMap from "@/components/naverMap"
import NavLink from "@/components/navLink"
import Button from "@/components/button"
import Toggle from "@/components/toggle"

import useRandomStyles from './randomStyles'

const content1 = `
##### **Type1** SVG 기반 컴포넌트   

벡터 기반 그래픽을 표현하는 XML 포맷인 SVG를 기반으로 구현한 지도 컴포넌트 입니다.

###### 이런게 장점이예요! 👍 
	1. 브라우저에서 렌더링하기 때문에 확대 축소시에 자연스러워요.
	2. 필요한 데이터만 지도에 표시할 수 있어요.
	3. 스타일을 다양하게 적용 할 수 있어요.

###### 이런게 부족할 수 있어요! 👎
	1. 브라우저나 클라이언트 환경에 따라 렌더링 성능이 차이가 날 수 있어요.
	2. 지도에 표현할 요소가 많을시 부하가 발생할 수 있어요.
	3. 지리 정보가 바뀌면 최신화가 필요해요.
	4. 지도 컴포넌트를 직접 구현함에 따라서 부족한 점이 발생할 수 있어요. 
`
const content2 = `
##### **Type2** 네이버 MAP API 기반 컴포넌트 
추후 작성예정입니다.
###### 이런게 장점이예요! 👍 
	1. 여러 브라우저나 클라이언트 환경에 최적화되어 있고 검증되어 있어요.
	2. 지리 정보가 최신화 되어 있어서, 업데이트 할 필요가 없어요.
###### 이런게 부족할 수 있어요! 👎
	1. 도로나 지하철등 등산로 등 불필요한 정보가 포함되어 지도가 복잡해 보일 수 있어요.
`

export default function MapPage() {
	const {styles, setStyles} = useRandomStyles()

	return (
		<ul className="px-12">
			<li className="flex flex-wrap pb-12 gap-4 relative">
				<TabGroup className="flex flex-wrap">
					<TabPanels>
						<TabPanel>
							<Map width={600} height={600} className="bodred-1" styles={styles}> </Map>
							<Button disabled={false} className="absolute top-20 left-60 w-30 h-10 drop-shadow-md" value="색상 변경하기" onClick={() => setStyles()}/> 
						</TabPanel>
						<TabPanel>
							<WaterTextureMap width={600} height={600} />
						</TabPanel>
						<TabPanel>
							<WaterColorMap width={600} height={600}/>
						</TabPanel>
					</TabPanels>
				<Markdown content={content1} className="pl-4 flex flex-col justify-between">
					<div className="font-bold" >밑에 버튼으로 SVG 컴포넌트 스타일을 변경해 보세요! </div>
					<div className="w-full flex flex-col justify-center items-center">
						<div className="flex w-full gap-4 items-center">
							<h6>지도 스타일 변경하기: </h6>
							<TabList className="inline-flex gap-2">
								<Tab className="cursor-pointer px-2 py-1 rounded-full transition duration-300 data-selected:bg-blue-500 data-selected:text-white">기본</Tab>
								<Tab className="cursor-pointer px-2 py-1 rounded-full transition duration-300 data-selected:bg-blue-500 data-selected:text-white">바다</Tab>
								<Tab className="cursor-pointer px-2 py-1 rounded-full transition duration-300 data-selected:bg-blue-500 data-selected:text-white">수채화</Tab>
							</TabList>
						</div>
					</div>
				</Markdown>
				</TabGroup>
			</li>
			<li className="flex flex-wrap gap-4"> 
				<div className="w-150 h-150 border-1"> 
					<NaverMap width={600} height={600} />
				</div>
				<Markdown content={content2} />
			</li>
		</ul>
		);
}