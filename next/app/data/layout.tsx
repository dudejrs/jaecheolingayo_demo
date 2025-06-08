'use client'
import {Suspense} from "react"
import {useEffect, useState} from "react"
import Breadcrumb from "@/components/breadcrumb"
import {DescriptionContext, DashboardContext} from "./dataContext"

const style = {
	backgroundColor : "var(--color-background-alt)",
	color: "var(--color-text-secondary)"
}

export default function Layout({children}: Readonly<{children :React.ReactNode;
}>){
	const [description, setDescription] = useState<string>('데이터 스크래핑 진행상황 및 데이터 분석을 위한 페이지 입니다.');
	const [dashboard, setDashboard] = useState<React.ReactNode>(<div></div>)

	const labels = {
		"/data" : "데이터",
		"nr" : "농라카페",
		"location+count" : "위치별 판매자 수",
		"seller" : "판매자"
	}


	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<DescriptionContext.Provider value={{description, setDescription}}>
				<DashboardContext.Provider value={{dashboard, setDashboard}}>
					<div>
						<div className="px-4 py-8 mb-4 h-75   flex flex-col content-between" style={style}>
							<Breadcrumb className="ml-12" basePath={"/data"} labels={labels}/>
		        			<div className="px-12 flex  h-full flex-wrap justify-between"> 
		        				<div> {description} </div>
		        				<div className="self-end"> {dashboard} </div>
		        			</div>
		      			</div>
						<div className="mx-12">
							{children}
						</div>
					</div>
				</DashboardContext.Provider>
			</DescriptionContext.Provider>
		</Suspense >
		)
}