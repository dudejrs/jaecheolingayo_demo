"use client"

import {useState} from "react"

import Markdown from '@/components/markdown';
import {BubbleMap, Map, StyledMap} from "@/components/map"
import NavLink from "@/components/navLink"
import Button from "@/components/button"
import Toggle from "@/components/toggle"

import useRandomStyles from './randomStyles'

const content1 = `
##### **Type1** SVG 기반 컴포넌트   

벡터 기반 XML 포맷을 이용한 SVG 기반으로 구현한 컴포넌트 입니다.

###### 이런게 장점이예요! 👍 
	1. 브라우저에서 렌더링하기 때문에 확대 축소시에 자연스러워요.
	2. 필요한 데이터만 지도에 표시할 수 있어요.
	3. 스타일을 다양하게 적용 할 수 있어요.
	4. 마우스 이벤트와 터치 이벤트를 지정하여 사용자와 인터렉티브하게 구현할 수 있어요.

###### 이런게 부족할 수 있어요! 👎
	1. 브라우저나 클라우저 환경에 따라 렌더링 성능이 차이가 날 수 있어요.
	2. 지도에 표현할 요소가 많을시 부하가 발생할 수 있어요.
	3. 지도 컴포넌트를 직접 구현함에 따라서 부족한 점이 발생할 수 있어요. 
`
const content2 = `
##### **Type2** 네이버 API 기반 컴포넌트 
추후 작성예정입니다.
###### 이런게 장점이예요! 👍 
###### 이런게 부족할 수 있어요! 👎
`


export default function MapPage() {
	const {styles, setStyles} = useRandomStyles()
	const [isOn, setIsOn] = useState<boolean>(false)


	return (
		<ul className="px-12">
			<li className="flex flex-wrap pb-12 gap-4 relative">
					{
						isOn ? <StyledMap width={600} height={600} /> : <Map width={600} height={600} className="bodred-1" styles={styles}> </Map>
					}
				<Markdown content={content1} className="pl-4 flex flex-col justify-between">
					<div className="font-bold" >SVG 컴포넌트의 다양한 효과를 시험해 보세요.</div>
					<div className="w-full flex flex-col justify-center items-center">
						<div className="flex w-full gap-4 items-center">
							<h6>지도 스타일 변경하기: </h6>
							<Toggle className="text-xs drop-shadow-md" callback={() => setIsOn(!isOn)}/>
						</div>
						{ 
							!isOn  && <Button disabled={isOn ? true : false} className="absolute top-20 left-60 w-30 h-10 drop-shadow-md" value="색상 변경하기" onClick={() => setStyles()}/> 
						}
					</div>
				</Markdown>
			</li>
			<li className="flex flex-wrap gap-4"> 
				<div className="w-150 h-150 border-1"> </div>
				<Markdown content={content2} />
			</li>
		</ul>
		);
}