'use client'

import {useEffect, useState } from 'react';
import {BubbleMap} from '@/components/map';

interface Tag {
  id: number
  name: string
}

export default function Page() {
  const [sellerCount, setSellerCount] = useState<number|null>(null);
  const [itemCount, setItemCount] = useState<number|null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/seller/count')
      .then(res => res.json())
      .then(({count}) => setSellerCount(count))

    fetch('/api/item/count')
      .then(res => res.json())
      .then(({count}) => setItemCount(count))

    fetch('/api/tag')
      .then(res => res.json())
      .then(r => {
        console.log(r)
        return  r
      })
      .then(({tags}) => setTags(tags))

  }, []);

  const handleCheckboxChange = (tagId : number) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId])
  }

  useEffect(()=> {
    console.log(selectedTags)
  },[selectedTags])

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
      <div className="flex flex-wrap gap-2 absolute bottom-10 left-12 h-75 w-75" >
        {
          tags.map((tag, i) => 
            (<label key={i} className={`inline-flex items-center cursor-pointer mb-0 ${selectedTags.includes(tag.id) ? "text-blue-500": ""}`}>
                <input type="checkbox" className={`sr-only peer `} key={i} value={tag.name} checked={selectedTags.includes(tag.id)} onChange={()=>handleCheckboxChange(tag.id)} />
                {`#${tag.name}`}
            </label>))
        }
      </div>
      <BubbleMap width={1000} height={600} tags={selectedTags}/>
    </div>
  );
}
