'use client'

import {useEffect, useRef} from "react"
import {CardLink} from "@/components/card"
import {PageWithDescription} from "../dataContext"

export default function Page() {

  return (
    <PageWithDescription className="flex gap-4" description="농라 카페의 스크래핑 상황과 데이터 분석을 위한 페이지입니다.">
      <CardLink href="/data/nr/location+count">위치별 판매자수</CardLink>
      <CardLink href="/data/nr/seller">판매자</CardLink>
    </PageWithDescription>   
  );
}
