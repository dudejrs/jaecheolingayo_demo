'use client'

import {useEffect, useState, useRef} from "react"
import {useDashboard} from "../dataContext"


interface DashboardProps {
	sellerCount : number | null
	itemCount : number | null
}

function Dashboard({sellerCount, itemCount} : DashboardProps) {
	return (
		<div className="flex flex-col items-end">
      	<h3 className="font-bold mb-4"> 농라 카페 스크래핑 진행상황 </h3>
    		<div>
    			{
    			sellerCount && `현재 총 판매자 수 : ${sellerCount} 개`
    			}
    		</div>
    		<div>
    			{
    			itemCount && `현재 총 판매물품 수 : ${itemCount} 개`
    			}
    		</div>
      </div>
     )
}


export default function Layout({children}:{
	children: React.ReactNode
}){
	const [sellerCount, setSellerCount] = useState<number|null>(null);
  	const [itemCount, setItemCount] = useState<number|null>(null);
  	const {setDashboard} = useDashboard()

	useEffect(() => {
	    fetch('/api/seller/count')
	      .then(res => res.json())
	      .then(({count}) => setSellerCount(count))

	    fetch('/api/item/count')
	      .then(res => res.json())
	      .then(({count}) => setItemCount(count))

	     return () => {
	     	setDashboard(<div> </div>)
	     }
	  }, []);

	useEffect(()=> {
		setDashboard(<Dashboard sellerCount={sellerCount} itemCount={itemCount} />)

	}, [sellerCount, itemCount])

	return (
	<div>
		{
			children
		}
	</div>
	)
}