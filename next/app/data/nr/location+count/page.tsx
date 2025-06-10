'use client'

import {useEffect, useState, useCallback} from 'react';
import {useRouter} from "next/navigation";
import BubbleMap from "./bubbleMap";
import {PageWithDescription} from "@/app/data/dataContext"

interface Tag {
  id: number
  name: string
}

export default function Page() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/tag')
      .then(res => res.json())
      .then(({tags}) => setTags(tags))

  }, []);

  const handleMarkerClick = useCallback((midX: number, midY: number, sellers: number[] )=> {
    return function () {
      const urlSearchparams = new URLSearchParams({
        sellers: sellers.slice(0, 200).toString(),  
        midX: midX.toString(),
        midY: midY.toString()
      });
      router.push(`/data/nr/location+count/detail?${urlSearchparams.toString()}`)
    }
  }, [selectedTags])

  const handleCheckboxChange = (tagId : number) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId])
  }

  return (
    <div className="flex flex-wrap content-between content justify-end"> 
      <div className="flex flex-wrap gap-2 h-150 w-75 overflow-scroll" >
        {
          tags.map((tag, i) => 
            (<label key={i} className={`text-sm inline-flex items-center cursor-pointer mb-0 px-2 py-1 border rounded-md  ${selectedTags.includes(tag.id) ? "bg-blue-500 text-white": "bg-[var(--gray-50)]/20 border-[var(--gray-50)]/50"}`}>
                <input type="checkbox" className={`sr-only peer `} key={i} value={tag.name} checked={selectedTags.includes(tag.id)} onChange={()=>handleCheckboxChange(tag.id)} />
                {`#${tag.name}`}
            </label>))
        }
      </div>
      <BubbleMap width={1000} height={600} tags={selectedTags} onMarkerClick={handleMarkerClick}/>
    </div>
  );
}
