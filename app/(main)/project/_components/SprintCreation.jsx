"use client"

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {addDays, format} from "date-fns"
import { Card } from '@/components/ui/card'
import { CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod";
import { createSprint } from '@/app/actions/sprints'
import {sprintSchema} from "@/app/lib/validation"
import { DayPicker } from 'react-day-picker'
import "react-day-picker/dist/style.css";
import { toast } from "sonner";

// import { formatDistance } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import useFetch from '@/app/hooks/use-fetch'
import { useRouter } from 'next/navigation'

const SprintCreation = ({
    projectId,
    projectTitle,
    projectKey,
    sprintKey
}) => {
    const [showForm,setShowForm]=useState(false)
    const [dateRange,setDateRange]=useState({
        from:new Date(),
        to:addDays(new Date(),14),
    })
// useState({
//     from:new Date(),
//     to: addDays(new Date(),14),
// })
     const router=useRouter()

     

    const {register,handleSubmit,formState:{errors},control}=useForm({
        resolver:zodResolver(sprintSchema),
        // resolver:zodResolver(createSprint),
        defaultValues:{
            name:`${projectKey}-${sprintKey}`,
            startDate:dateRange.from,
            endDate:dateRange.to,

        }
    })

    const {loading: createSprintLoading, fn: createSprintFn}=
     useFetch(createSprint)

     const onSubmit=async(data)=>{
        await createSprintFn(projectId,{
            ...data,
            startDate:dateRange.from,
            endDate:dateRange.to,
        })

        setShowForm(false)
        toast.success("Sprint created successfully")
        router.refresh()
     }

  return (
    <div>
        <div className='flex justify-between'>
                <h1 className='text-5xl font-bold mb-8 gradient-title'>
                    {projectTitle}
                </h1>
                <Button className="mt-2 cursor-pointer" 
                    onClick={()=>setShowForm(!showForm)}
                    variant={showForm ? "destructive":"default" }>

                    {showForm ? "Cancel": "Create New Sprint"}  

                </Button>

        </div>
       
    

    {showForm && (
        <Card className={'pt-4 mb-4'}>
            <CardContent className="flex gap-4 items-end">
                <form className='flex gap-4 items-end' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <label htmlFor="name" className='block text-sm font-medium mb-1'>
                        Sprint Name

                      </label>
                      <Input
                      id="name"
                      readOnly
                      className={"bg-slate-950"}
                      {...register("name")}
                      />

                      {errors.name && (
                        <p className='text-red-500 text-sm mt-1'>
                            {errors.name.message}
                        </p>
                      )}
                      
                    </div>

                    <div className='flex-1'>
                      <label className='block text-sm font-medium mb-1'>
                        Sprint Duration
                      </label>

                      {/* It is used for third party components */}
                      <Controller control={control} name="dateRange"
                        render={({field})=>{
                            return(
                             <Popover>
                                <PopoverTrigger asChild>
                                 <Button variant='outline'
                                 className={`w-full justify-start text-left font-normal bg-slate-900
                                    ${!dateRange && "text-muted-foreground"}`}
                                 >
                                    <CalendarIcon className='mr-2 h-4 w-4'/>
                                    {dateRange.from && dateRange.to ? (
                                        format(dateRange.from, "LLL dd, y")+" - "+ format(dateRange.to,"LLL dd, y")
                                    ):(
                                        <span> Pick a date</span>
                                    )}
                                 </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                className={`w-auto bg-slate-900`}
                                align='start'
                                >
                                  <DayPicker mode='range' selected={dateRange}
                                  onSelect={(range)=>{
                                    if(range?.from && range?.to){
                                        setDateRange(range)
                                        field.onChange(range)
                                    }
                                  }}
                                  classNames={{
                                    chevron: "fill-blue-500",
                                    range_start: "bg-blue-700",
                                    range_end: "bg-blue-700",
                                    range_middle: "bg-blue-400",
                                    day_button: "border-none",
                                    today: "border-2 border-blue-700",
                                }}
                                  />
                                </PopoverContent>
                             </Popover>
                            )
                            
                        }}
                      />
                    </div>
                    <Button type="submit" disabled={createSprintLoading}>
                        {createSprintLoading?"Creating..." :"Create Sprint"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )}
    </div>
  )
}

export default SprintCreation