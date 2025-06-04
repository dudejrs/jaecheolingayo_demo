"use client"

import NavLink from "@/components/navLink"


export default function MapPage({children}: 
	Readonly<{
		children: React.ReactNode;
	}>
) {

	return (
		<div>
			<div className="flex justify-center gap-6 pb-6"> 
				<NavLink href="/map"> 기본 </NavLink>
				<NavLink href="/map/bubble"> 버블맵 </NavLink>
			</div>
			{children}
		</div>
		);
}