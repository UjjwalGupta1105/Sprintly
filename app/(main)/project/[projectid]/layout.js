import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ProjectLayout = ({children}) => {
  return (
    <div className='min-h-screen mx-auto w-[95%] '>
        <Suspense fallback={<span>Loading Projects....</span>}/>
        {children} 
    </div>
  )
}

export default ProjectLayout