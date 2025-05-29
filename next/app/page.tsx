'use client';

import { useEffect, useState } from 'react';


type Seller = {
  id: string;
};

export default function Page() {
  const [sellerCount, setSellerCount] = useState<Number|null>(null);
  const [itemCount, setItemCount] = useState<Number|null>(null);

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
      <div>
        {
          sellerCount && `총 판매자 수 : ${sellerCount}`
        }
      </div>
      <div>
        {
          itemCount && `총 아이템 수 : ${itemCount}`
        }
      </div>
    </div>
  );
}
