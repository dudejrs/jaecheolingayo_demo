"use client"

import {useState, useEffect} from "react"
import {useSearchParams, useRouter} from "next/navigation"
import {PageWithDescription} from "@/app/data/dataContext"
import Form from "./form"
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
}

const PER_PAGE = 15;

export default function SellerPage() {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const keyword = searchParams.get('keyword') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const tagId = searchParams.has('tagId') ? parseInt(searchParams.get('tagId')!, 10) : null;

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentKeyword, setKeyword] = useState(keyword);
  const [currentTagId, setTagId] = useState(tagId)

  useEffect(()=> {
    const urlSearchParams = new URLSearchParams({
      keyword,
      skip : ((page - 1) * PER_PAGE).toString(),
      take : PER_PAGE.toString(),
    });

    if (tagId) {
      urlSearchParams.set("tagId", tagId.toString())
    }

    fetch(`/api/seller?${urlSearchParams.toString()}`)
      .then(res => res.json())
      .then(({sellers, totalCount})=> {
        setSellers(sellers)
        setTotalPages(Math.ceil(totalCount / PER_PAGE))
        setLoading(false)
      })

  }, [keyword, page, tagId])

  const updateSearchParams = (nextPage: number, nextKeyword: string = currentKeyword, nextTagId: number | null = currentTagId) => {
    const urlSearchParams = new URLSearchParams({
      page: nextPage.toString()
    });    
    
    if (nextKeyword) {
      urlSearchParams.set('keyword', nextKeyword)
    }

    if (nextTagId) {
      urlSearchParams.set('tagId', nextTagId.toString())
    }

    router.push(`?${urlSearchParams.toString()}`)
  }

  return (
      <PageWithDescription description="농라카페의 판매자를 검색하고 볼 수 있는 페이지입니다.">
       <Form className="mt-8" updateSearchParams={(nextKeyword?: string, nextTagId?: number | null) => updateSearchParams(1, nextKeyword, nextTagId)} />
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
                          <th> 사업자/대표자 </th>
                          <th> 주소 </th>
                          <th className="w-1/11"> 연락처 </th>
                          <th className="w-1/11"> 등록일 </th>
                          <th className="w-1/11"> 마지막 판매 마감 일시 </th>
                          <th className="w-1/8"> 태그 </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          sellers.map((seller, i) => (
                            <tr className="rounded-sm hover:font-[var(--color-text-primary)] hover:bg-[var(--color-background-alt)]/20 text-[var(--color-text-secondary)]" key={i}>
                              <td className="font-semibold text-center"> {seller.id}</td>
                              <td className="px-2 py-2 text-center">{seller.business_name}</td>
                              <td className="px-2 py-2 text-center text-pretty">{seller.representative_name}</td>
                              <td className="px-2 py-2">{seller.address}</td>
                              <td className="text-center">{seller.contact_number}</td>
                              <td className="text-center">{seller.registration_date}</td>
                              <td className="text-center">{seller.last_sale_deadline_date}</td>
                              <td className="px-2 py-2">{seller.tags.join()} </td>
                            </tr>
                            ))
                        }
                      </tbody>
                  </table>
                  <Pagination totalPages={totalPages} currentPage={page} onClick={updateSearchParams}/>
                </>
              )
          }
       </div>
      </PageWithDescription>
  );
}
