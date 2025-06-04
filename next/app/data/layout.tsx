'use client'

import NavLink from "@/components/NavLink"
import Breadcrumb from "@/components/breadcrumb"

const styles = {
	backgroundColor : "var(--color-background-alt)",
	color: "var(--color-text-secondary)"
}

export default function Layout({children}: Readonly<{chiildren :React.ReactNode;
}>){

	const labels = {
		"/data" : "데이터",
		"nr" : "농라카페"
	}
	return (
			<div>
				<div className="p-4 h-75 mb-4 flex flex-col content-between" style={styles}>
					<Breadcrumb className="ml-12" basePath={"/data"} labels={labels}/>
        			<div className="px-12"> 데이터 스크래핑 진행상황 및 데이터 분석을 위한 페이지 입니다. </div>
      			</div>
				<div className="mx-12">
					{children}
				</div>
			</div>
		)
}