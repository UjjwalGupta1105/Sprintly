"use client"
import { getOrganizationUsers } from "@/app/actions/organization"
import { issueSchema } from "@/app/lib/validation"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { BarLoader } from "react-spinners"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MarkdownEditor from "@uiw/react-markdown-editor"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { createIsuue } from "@/app/actions/issues"
import useFetch from "@/app/hooks/use-fetch"

const IssueCreationDrawer = ({
        isOpen,
        onClose,
        sprintId,
        status,
        projectId,
        onIssueCreated,
        orgId
    }) => {
// console.log("here",orgId)
    const {
        control,
        register,
        handleSubmit,
        formState:{errors},
        reset
    }=useForm({
        resolver:zodResolver(issueSchema),
        defaultValues:{
            priority:"MEDIUM",
            description:"",
            assigneeId:""
        }
    })

    const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
    } = useFetch(createIsuue);

    useEffect(()=>{
        if(newIssue){
            reset()
            onClose()
            onIssueCreated()
            toast.success("Issue Created Successfully")
        }
    },[newIssue,createIssueLoading])

    const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
    } = useFetch(getOrganizationUsers);

    const onSubmit=async(data)=>{
        await createIssueFn(projectId,{
            ...data,
            status,
            sprintId
        })
    }

    useEffect(()=>{
        if(isOpen && orgId){
            fetchUsers(orgId)
        }
    },[orgId,isOpen])

  return (
    <Drawer open={isOpen} onClose={onClose} modal={false}>
        <DrawerContent>
            <DrawerHeader>
               <DrawerTitle>Create New Issue</DrawerTitle>
            </DrawerHeader>
            {usersLoading && <BarLoader width={"100%"} color="#36d7b7"/>}
            <form className="p-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        TiTle
                    </label>
                    <Input id="title" {...register("title")}/>
                    {errors.title && (<p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                    </p>)}
                </div>
                <div>
                    {/* <label htmlFor="assigneeId" control={control}> */}
                    <label htmlFor="assigneeId">
                        Assignee
                    </label>
                    <Controller name="assigneeId" control={control} 
                     render={({field})=>(
                        <Select
                         onValueChange={field.onChange}
                         defaultValue={field.value}                        
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            
                          {users?.map((user)=>{
                            return <SelectItem key={user.id} value={user.id}>
                                {user?.name}
                            </SelectItem>
                          })}
                        </SelectContent>
                        </Select>
                     )}
                    />

                    {errors.assigneeId && (<p className="text-red-500 text-sm mt-1">
                        {errors.assigneeId.message}
                    </p>)}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <Controller
                    name="description"
                    control={control}
                    render={({field})=>(
                        <MarkdownEditor value={field.value} onChange={field.onChange}/>
                    )}
                    
                    />
                    {errors.description && (<p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                    </p>)}
                </div>
                
                <div>
                    <label htmlFor="priority" control={control}>
                        Priority
                    </label>
                    <Controller name="priority" control={control} 
                     render={({field})=>(
                        <Select
                         onValueChange={field.onChange}
                         defaultValue={field.value}                        
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          
                        </SelectContent>
                        </Select>
                     )}
                    />
                </div>
            {error && <p className="text-red-500 mt-2">{error.message}</p>}
            <Button type="submit" disabled={createIssueLoading} className={'w-full cursor-pointer'}>
                {createIssueLoading ? "Creating...":"Create Issue"}{" "}
            </Button>
            </form>
        </DrawerContent>
    </Drawer>
  )
}

export default IssueCreationDrawer