'use client'

import {createContext, useContext, useEffect, useRef, useState} from 'react';

interface DescriptionContextType {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

interface DashboardContextType {
  dashboard: React.ReactNode;
  setDashboard: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

interface PageProps {
  children : React.ReactNode,
  className?: string,
  dashboard? : React.ReactNode
  description : string
}

export const DescriptionContext = createContext<DescriptionContextType>({
  description: "",
  setDescription: () => {}
})

export const DashboardContext = createContext<DashboardContextType>({
  dashboard : <div></div>,
  setDashboard: () => {}
})

export const useDescription = () => useContext(DescriptionContext)
export const useDashboard = () => useContext(DashboardContext)

export function PageWithDescription({
  description,
  className,
  children
} : PageProps) {
  const originalDescription = useRef<string>("");
  const {description : description_, setDescription} = useDescription();
  
  useEffect(()=>{
    originalDescription.current = description_
    setDescription(description);
    return () => {
      setDescription(originalDescription.current)
    }
  },[]);

  return (
    <div className={className}>
      {
        children
      }
    </div>   
  );
}

export function PageWithDashboard({
  children,
  className,
  dashboard
} : PageProps){

  const originalDashboard = useRef<React.ReactNode>(<div></div>);
  const {dashboard : dashboard_, setDashboard} = useDashboard();

  useEffect(()=>{
    originalDashboard.current = dashboard_
    setDashboard(dashboard)
    
    return () => {
      setDashboard(dashboard_)
    }
  },[])

  return (
  <div>
    {
      children
    }
  </div>
  )
}