'use client'

import NavLink from "@/components/navLink"


export default function Page() {

  return (
    <div className="flex flex-wrap">
      <NavLink href="/data/nr" className="w-75 h-50 p-2 bg-blue-500 hover:bg-blue-700 font-bold rounded-xl shadow-20 place-content-center text-center" >농라카페</NavLink>
    </div>
  );
}
