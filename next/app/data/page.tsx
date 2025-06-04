'use client'

import { useEffect, useState } from 'react';

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
    <div>
    	<h3> 농라 카페 스크래핑 진행상황  </h3>
		<div>
			{
			sellerCount && `총 판매자 수 : ${sellerCount} 개`
			}
		</div>
		<div>
			{
			itemCount && `총 아이템 수 : ${itemCount} `
			}
		</div>
    </div>
  );
}
