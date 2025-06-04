"use client"

import Markdown from '@/components/markdown';
import {BubbleMap, Map} from "@/components/map"
import NavLink from "@/components/navLink"
import Image from "next/image";


const content1 = `
##### **Type1** SVG 기반 컴포넌트   


SVG 기반 컴포넌트 입니다. (작성중...)
`

const content2 = `
##### **Type2** 네이버 API 기반 컴포넌트 

추가적으로 개발할 예정입니다. (작성중...)
`


export default function MapPage() {

	return (
		<ul className="px-12">
			<li className="flex flex-wrap pb-12 gap-4">
				<Map width={600} height={600} className="bodred-1" />
				<Markdown content={content1} />
			</li>
			<li className="flex flex-wrap gap-4"> 
				<Image src="" alt="" width={600} height={600} />
				<Markdown content={content2} />
			</li>
		</ul>
		);
}