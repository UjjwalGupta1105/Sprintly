"use client"

import OrgSwitcher from "@/app/components/OrgSwitcher"
import { useOrganization,useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema } from "@/app/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useFetch from "@/app/hooks/use-fetch"
import { createProject } from "@/app/actions/projects"
import {toast} from "sonner"
import { useRouter } from "next/navigation"

// resolver is used to connect react-form with the ZOD
// ZOD do the typeSafety & strictnes for the data entered in form
const CreateProjectPage = () => {
    const {isLoaded:isOrgLoaded,membership}=useOrganization()
    const {isLoaded:isUserLoaded}=useUser()
    const [isAdmin,setIsAdmin]=useState(false)

    const router=useRouter()

    const {
        data:project,
        loading,
        error,
        fn:createProjectFn
    }=useFetch(createProject)

    const {register, handleSubmit, formState:{errors,}}=useForm({
        resolver:zodResolver(projectSchema),
    })

    useEffect(()=>{
        if(isOrgLoaded && isUserLoaded && membership){
            setIsAdmin(membership.role==="org:admin")
        }
    },[isOrgLoaded , isUserLoaded , membership])

     useEffect(()=>{
        if(project){
            toast.success("Project Created Successfully")
            router.push(`/project/${project.id}`)
        }
    },[loading])

      const onSubmit = async(data) => {
        await createProjectFn(data)
    }

    if(!isOrgLoaded || !isUserLoaded){
        return null
    }

    if(!isAdmin){
        return(
            <div className="min-h-screen flex flex-col gap-2 items-center">
                <span className="text-2xl gradient-title">
                    Oops ! Only Admins can create projects.
                </span>
            </div>
        )
    }

    // const {
    //     data:project,
    //     loading,
    //     error,
    //     fn:createProjectFn
    // }=useFetch(createProject)

    // useEffect(()=>{
    //     if(project){
    //         toast.success("Project Created Successfully")
    //         router.push(`/projects/${project.id}`)
    //     }
    // },[loading])




  return (
    <div className="min-h-screen mx-auto py-7 w-[92%]">
        <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
            Create new Project
        </h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Input
                id="name"
                className="bg-slate-950"
                placeholder="Project Name"
                {...register("name")}            
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>
             <div>
                <Input
                id="key"
                className="bg-slate-950"
                placeholder="Project Key (Ex: RCYT)"
                {...register("key")}            
                />
                {errors.key && (
                    <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
                )}
            </div>
             <div>
                <Textarea
                id="description"
                className="bg-slate-950"
                placeholder="Project Descriptione"
                {...register("description")}            
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
            </div>

            <Button disabled={loading} type="submit" size="lg" className={`bg-blue-500 text-white`}>
                {loading ? "Creating...":"Create Project"}
            </Button>
            {errors && (
                    <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                )}
        </form>

    </div>
  )
}

export default CreateProjectPage