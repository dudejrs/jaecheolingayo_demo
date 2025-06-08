
import {useState, useEffect, useRef} from "react"
import {Input, Button, Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/react'

const defaultClassName="p-2 rounded-lg border-[var(--color-background-alt)] font-[var(--color-text-primary)] bg-[var(--color-background-alt)]/30 inset-shadow-lg"

interface FormProps {
	className?: string
	updateSearchParams: (nextKeyword?: string, nextTagId?: number | null) => void
}

interface Tag {
	id: number,
	name: string
}

export default function Form({
	className = "",
	updateSearchParams
} : FormProps) {

	const [tags, setTags] = useState<Tag[]>([])
	const [selectedTag, selectTag] = useState<Tag | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
    fetch('/api/tag')
      .then(res => res.json())
      .then(r => {
        return  r
      })
      .then(({tags}) => setTags(tags))
  }, []);


  const onSubmit = (e : React.FormEvent) => {
  	e.preventDefault();
  	
  	const keyword = inputRef.current?.value || undefined
  	const tagId = selectedTag?.id || null

  	updateSearchParams(keyword, tagId)
  }

	return (
		<form onSubmit={onSubmit} className={`flex w-full justify-center gap-4 ${className}`}>
	        <Listbox value={selectedTag} onChange={selectTag} >
	          <ListboxButton className={`w-40 ${defaultClassName}`}> {selectedTag ? selectedTag.name : '전체'} </ListboxButton>
	          <ListboxOptions anchor="bottom start" className={`w-40 h-40 my-2 ${defaultClassName} bg-[var(--color-background-alt)]/100`}>
	            {
	              tags.map((t, i) => (
	                  <ListboxOption key={i} value={t}>{t.name}</ListboxOption>
	                ))
	            }
	          </ListboxOptions>
	        </Listbox>
	        <div>
	          <label htmlFor="name" hidden>판매자 이름</label>
	          <Input ref={inputRef} className={`w-80 ${defaultClassName}`} name="name" type="text" placeholder="검색할 판매자 이름을 입력하세요" data-hover />
	        </div>
	        <Button type="submit" className="p-2 rounded-lg font-bold cursor-pointer">
	          검색
	        </Button>
      </form> 
      )
}