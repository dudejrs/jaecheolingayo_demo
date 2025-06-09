'use client'

import {useEffect, useState, useCallback} from 'react'
import {useSearchParams} from 'next/navigation'
import {Point, Ratio} from '@/components/map/types';
import {useFocusHover} from '@/components/map/hook';
import {StaticMap} from "@/components/map"
import {calculateSize} from "@/components/map/util";
import Pagination from "@/components/pagination"

interface Seller {
  id: number
  address: string
  business_name : string
  contact_number : string
  ecommerce_license_no : string 
  last_sale_deadline_date: string 
  representative_name: string
  registration_date : string 
  taxpayer_id: string
  tags: string[]
  coord: {x: number, y: number}
  distance? : number
}

function None(){
	return <div>잘못된 접근입니다.</div>
}

const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const PER_PAGE = 5

export default function Page() {
	const searchParams = useSearchParams();

	const midX = parseFloat(searchParams?.get('midX')|| '0') 
	const midY = parseFloat(searchParams?.get('midY')|| '0')
	const sellerIds = searchParams?.get("sellers") || []

	const [sellers, setSellers] = useState<Seller[]>([]);
	const [base, setBase] = useState<Point>(new Point(0,0)); 
	const [ratio, setRatio] = useState<Ratio>(new Ratio(1,1));
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);

	const mid = new Point(midX, midY)
	const { onMouseEnter, onMouseLeave } = useFocusHover(ratio, setRatio, base, setBase);

	useEffect(()=> {
		const urlSearchParams = new URLSearchParams({
			ids : sellerIds.toString(),
			x: midX.toString(),
			y: midY.toString(),
		});

		fetch(`/api/seller/by-ids?${urlSearchParams.toString()}`)
			.then(res => res.json())
			.then(({sellers} : {sellers : Seller[]}) => {
				setSellers(sellers)
				const maxDistance = sellers.map(seller => seller.distance ?? 0).reduce((acc, distance) => Math.max(acc, distance), 0)
				const newRatio = new Ratio(maxDistance * 2, maxDistance * 2)
				setRatio(newRatio);
				const newBase = newRatio.originPointOf(mid)
				setBase(newBase)
				setLoading(false)
			})
	},[])

	const mapCoords = useCallback(({x, y}: {x: number, y: number})=>{
		return {
			x : x - DEFAULT_ORIGIN_POINT.x,
			y : DEFAULT_RATIO.height -  y + DEFAULT_ORIGIN_POINT.y
		}
	},[])


	if (!searchParams || !midX || !midY || !sellers) {
		return None()
	}

	return (
		<div className="flex gap-4 justify-center">
			<div>
				{ ratio && base &&
				<StaticMap width={600} height={600} base={base} ratio={ratio} onMouseLeave={onMouseLeave()}>
					<g>
						{
							sellers.map(({coord}, i) => {
								const newCoord = mapCoords(coord)
								const newRatio = ratio.scale(0.5)
								const handleMouseEnter = onMouseEnter(newRatio, new Point(coord.x, coord.y))

								return (<circle key={i} cx={newCoord.x} cy={newCoord.y} r={calculateSize(8, new Ratio(600, 600), ratio)} stroke="var(--color-border)" strokeWidth={calculateSize(0.8, new Ratio(600, 600), ratio)} fill="var(--pccs-blue-bright)" opacity="0.8" onClick={handleMouseEnter} cursor="pointer"/>)
							})
						}
					</g>
				</StaticMap>
				}
			</div>
			<div className="mt-4 flex flex-col justify-center items-center">
          {
            loading ? <p> 데이터를 불러오는 중.. </p>
            : (
                <>
                  <table className="table-auto border-separate border-spacing-x-2 border-spacing-y-2 text-wrap">
                      <thead>
                        <tr>
                          <th className="px-2"> id </th>
                          <th> 판매자 이름 </th>
                          <th> 주소 </th>
                          <th className="w-1/11"> 연락처 </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          sellers.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((seller, i) => {
                          	const {coord} = seller
                          	const newRatio = ratio.scale(0.5)
                          	const handleMouseEnter = onMouseEnter(newRatio, new Point(coord.x, coord.y))
                          	return (
                            <tr className="rounded-sm hover:font-[var(--color-text-primary)] hover:bg-[var(--color-background-alt)]/20 text-[var(--color-text-secondary)]" key={i} onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave()}>
                              <td className="font-semibold text-center"> {seller.id}</td>
                              <td className="px-2 py-2 text-center">{seller.business_name}</td>
                              <td className="px-2 py-2">{seller.address}</td>
                            </tr>
                            )
                          })
                        }
                      </tbody>
                  </table>
                  <Pagination totalPages={sellers.length / PER_PAGE} currentPage={page} onClick={setPage}/>
                </>
              )
          }
       </div>
		</div>
		);
}