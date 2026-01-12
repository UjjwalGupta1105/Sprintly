"use client"

import React from 'react'
import { useEffect } from "react";

 const layout = ({children}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className='min-h-[95vh] flex justify-center items-center px-20 w-full mb-12 pb-27'> 
        {children}
    </div>
  )
}

export default layout

