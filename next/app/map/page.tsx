"use client"

import Markdown from '@/components/markdown';
import {BubbleMap, Map} from "@/components/map"
import NavLink from "@/components/navLink"
import Button from "@/components/button"

import useRandomStyles from './randomStyles'

const content1 = `
##### **Type1** SVG 기반 컴포넌트   


SVG 기반 컴포넌트 입니다. (작성중...)
`

const content2 = `
##### **Type2** 네이버 API 기반 컴포넌트 

추가적으로 개발할 예정입니다. (작성중...)
`


export default function MapPage() {
	const {styles, setStyles} = useRandomStyles()

	return (
		<ul className="px-12">
			<li className="flex flex-wrap pb-12 gap-4">
				<Map width={600} height={600} className="bodred-1" styles={styles} />
				<Markdown content={content1}>
					<Button className="w-50 h-16" value="색상 변경하기" onClick={() => setStyles()}/>
				</Markdown>
			</li>
			<li className="flex flex-wrap gap-4"> 
				<div className="w-150 h-150 border-1"> </div>
				<Markdown content={content2} />
			</li>
		</ul>
		);
}