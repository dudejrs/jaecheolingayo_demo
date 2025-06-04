"use client"

import ReactMarkdown from 'react-markdown';
import {BubbleMap, Map} from "@/components/map"



export default function MapPage() {

	return (
		<div>
			<div>
				<BubbleMap width={600} height={600} className="bodred-1" />
			</div>
			<ReactMarkdown>
				sss
			</ReactMarkdown>
		</div>
		);
}