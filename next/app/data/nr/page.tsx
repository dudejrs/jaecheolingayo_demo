'use client'

import { useEffect, useState } from 'react';
import {BubbleMap} from '@/components/map';


export default function Page() {
  const [sellerCount, setSellerCount] = useState<number|null>(null);
  const [itemCount, setItemCount] = useState<number|null>(null);

  useEffect(() => {
    fetch('/api/seller/count')
      .then(res => res.json())
      .then(({count}) => setSellerCount(count))

    fetch('/api/item/count')
      .then(res => res.json())
      .then(({count}) => setItemCount(count))

  }, []);

  return (
    <div className="flex content-between relative content justify-end">
      <div className="flex flex-col absolute top-10 left-12 background ">
      	<h3> 농라 카페 스크래핑 진행상황  </h3>
    		<div>
    			{
    			sellerCount && `현재 총 판매자 수 : ${sellerCount} 개`
    			}
    		</div>
    		<div>
    			{
    			itemCount && `현재 총 아이템 수 : ${itemCount} 개`
    			}
    		</div>
      </div>
      <BubbleMap width={1000} height={600} />
    </div>
  );
}
