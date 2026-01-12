"use client"

import {useEffect, useState} from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  isAfter,
  isBefore,
  format,
  formatDistance,
  formatDistanceToNow,
} from "date-fns";
import { BarLoader } from 'react-spinners'
import useFetch from '@/app/hooks/use-fetch'
import { updateSprintStatus } from '@/app/actions/sprints'
import { useRouter, useSearchParams } from 'next/navigation'


const SprintManagar = ({sprint,setSprint,sprints,projectId}) => {
    const [status,setStatus]=useState(sprint.status)

    const startDate=new Date(sprint.startDate)
    const endDate=new Date(sprint.endDate)
    const now=new Date()
    const searchParams=useSearchParams()
    const router=useRouter()

    const canStart=
    isBefore(now,endDate) && isAfter(now,startDate) && status==="PLANNED"

    const canEnd=status==="ACTIVE"

    const {
        fn:updateStatus,
        loading,
        error,
        data:updatedStatus,
    }=useFetch(updateSprintStatus)
    

    const handelStatusChange=async(newStatus)=>{
        // updateStatus(sprint,id,newStatus)
        updateStatus(sprint.id, newStatus);

    }

    useEffect(()=>{
        if(updatedStatus && updatedStatus.success){
            setStatus(updatedStatus.sprint.status)
            setSprint({
                ...sprint,
                status:updatedStatus.sprint.status
            })
        }
    },[updatedStatus,loading])

    useEffect(() => {
    const sprintId = searchParams.get("sprint");

    if (sprintId && sprintId !== sprint.id) {
        const selectedSprint = sprints.find((s) => s.id === sprintId);

        if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
        }
    }
    }, [searchParams, sprints]);


    const handelSprintChange=(value)=>{
        const selectedSprint=sprints.find((s)=>s.id ===value)
        setSprint(selectedSprint)
        setStatus(selectedSprint.status)
        router.replace(`/project/${projectId}`,undefined,{shallow:true})
    } 

    const getStatusText=()=>{
        if(status==="COMPLETED"){
            return 'Sprint Ended'
        }
        if(status==="ACTIVE" && isAfter(now,endDate)){
            return `OverDue by ${formatDistanceToNow(endDate)}`
        }
        if(status==="PLANNED" && isBefore(now, startDate)){
            return `Starts in ${formatDistanceToNow(startDate)}`
        }
        return null
    }

  return (
    <>
    <div className='flex justify-between items-center gap-4'>
        <div className='w-[100%]'>
        <Select value={sprint.id} onValueChange={handelSprintChange}>
            <SelectTrigger className="w-full bg-slate-950">
                <SelectValue placeholder="Select Sprint" />
            </SelectTrigger>
            <SelectContent>
                {sprints.map((sprint)=>{
                    return(
                        <SelectItem key={sprint.id} value={sprint.id}>
                            {sprint.name} ({format(sprint.startDate,"MMM d, yyyy")}) to {" "}
                            {format(sprint.endDate, "MMM d, yyyy")}
                        </SelectItem>
                    )
                })}
                
                
            </SelectContent>
        </Select>

        </div>
        

        {canStart && (
            <Button className={'bg-green-900 text-white hover:text-black w-[12%]'}
            onClick={()=> handelStatusChange("ACTIVE")} disabled={loading}
            >Start Sprint</Button>
        )}
        {canEnd && (
            <Button variant='destructive' disabled={loading} onClick={()=> handelStatusChange("COMPLETED")}>End Sprint</Button>
        )}
    </div>

        {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7"/>}

    {getStatusText() &&
     <Badge className='mt-3 ml-1 self-start py-3 px-6 rounded-md'>{getStatusText()}</Badge>}
    </>
  )
}

export default SprintManagar