import { getProjects } from '@/app/actions/projects'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DeleteProject from './DeleteProject'
import useFetch from '@/app/hooks/use-fetch'

const ProjectList =async({orgId}) => {
    const projects=await getProjects(orgId)

    if(projects.length===0){
        return(
            <>
                <h3>No Projects Found!!</h3>
                <Link
                 href={`/project/create`}
                 className='underline underline-offset-2 text-blue-200'
                >Create New</Link>
            </>
            
        )
    }


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-[94%] px-4 mx-auto'>
        {projects.map((project)=>{
            return <Card key={project.id}>
                        <CardHeader>
                            <CardTitle className={`flex justify-between items-center`}>
                                {project.name}
                                <DeleteProject projectId={project.id}/>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-gray-500 mb-4'>{project.description}</p>
                            <Link
                            href={`/project/${project.id}`}
                            className='text-blue-500 hover:underline'
                            >
                                View Project
                            </Link>
                        </CardContent>
                    </Card>
        })}
    </div>
  )
}

export default ProjectList