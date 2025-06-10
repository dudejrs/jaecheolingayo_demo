"use client"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import ReactMarkdown from 'react-markdown';
import {BubbleMap, Map} from "@/components/map"

export default function MapPage() {

	return (
		<TabGroup className="w-full flex flex-col justify-center">
			<TabPanels>
				<TabPanel>
					<BubbleMap width={600} height={600} className="bodred-1 w-full flex flex-col justify-center" />
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