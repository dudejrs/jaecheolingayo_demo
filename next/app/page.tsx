'use client';

import { useEffect, useState } from 'react';

type Seller = {
  id: string;
};

export default function Page() {
  const [msg, setMsg] = useState('');
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message));

    fetch('/api/seller')
      .then(res => res.json())
      .then(({ sellers }) => {
        console.log(sellers);
        setSellers(sellers);
      });
  }, []);

  return (
    <div>
      <h1>{msg}</h1>
      {sellers.map(seller => (
        <div key={seller.id}>{seller.id}</div>
      ))}
    </div>
  );
}
