'use client'

import {useEffect, useState } from 'react';
import {BubbleMap} from '@/components/map';
import {PageWithDescription} from "@/app/data/dataContext"

interface Tag {
  id: number
  name: string
}

export default function Page() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/tag')
      .then(res => res.json())
      .then(r => {
        return  r
      })
      .then(({tags}) => setTags(tags))

  }, []);

  const handleCheckboxChange = (tagId : number) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId])
  }

  return (
    <div className="flex content-between relative content justify-end"> 
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
