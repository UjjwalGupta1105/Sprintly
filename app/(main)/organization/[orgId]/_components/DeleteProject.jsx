"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useOrganization } from '@clerk/nextjs'
import { Trash2 } from 'lucide-react'
import { deleteProject } from '@/app/actions/projects'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import useFetch from '@/app/hooks/use-fetch'

const DeleteProject = ({projectId}) => {
  const {membership}=useOrganization()
  const router=useRouter()

  const {
        data:deleted,
        loading:isDeleting,
        error,
        fn:deleteProjectFn
    }=useFetch(deleteProject)

    const handelDelete=()=>{
      if(window.confirm("Are you sure you want to delete this project")){
        deleteProjectFn(projectId)
      }
    }

    useEffect(()=>{
        if(deleted?.success){
          toast.error("Project Deleted Successfully")
          router.refresh()
        }
    },[deleted])

  const isAdmin=membership?.role === "org:admin"

  if(!isAdmin)return null
  

  return (
    <div>
      <Button
       variant='ghost'
      onClick={handelDelete} disabled={isDeleting}
      size="sm"
        className={`${isDeleting ? 'animate-pulse':" "}`}
        >
        <Trash2 className='h-4 w-4/>'/>
      </Button>
      {error && <p className='text-red-500 text-sm'>{error.message}</p>}
    </div>
  )
}

export default DeleteProject