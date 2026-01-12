"use client"
import React, { useEffect, useState } from 'react'
import SprintManager from './SprintManagar'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import IssueCreationDrawer from './CreateIssue'
import {  getIsssuesForSprint, updateIssueOrder } from '@/app/actions/issues'
import useFetch from '@/app/hooks/use-fetch'
import BoardFilters from './BoardFilters'
import { toast } from 'sonner'
import { BarLoader } from 'react-spinners'
import IssueCard from './IssueCard'
import { Button } from '@/components/ui/button'
import statuses from "@/app/data/status"
import { useRouter } from 'next/navigation'

const reOrder=(list,startIndex,endIndex)=>{
    const result=Array.from(list)
    const [removed]=result.splice(startIndex,1)
    result.splice(endIndex,0,removed)

    return result
}

const SpringBoard = ({sprints,projectId,orgId}) => {
//   console.log("here",orgId)

    const [currentSprint,setCurrentSprint]=useState(
        sprints.find((spr)=> spr.status==="ACTIVE") || sprints[0]
    )

    const [isDrawerOpen, setIsDrawerOpen]=useState(false)
    const [selectedStatus,setSelectedStatus]=useState(null)

    const handelAddIssue=(status)=>{
        setSelectedStatus(status)
        setIsDrawerOpen(true)
    }

     const {
        loading:issueLoading,
        error:issuesError,
        fn:fetchIssues,
        data:issues,
        setData:setIssues
    }=useFetch(getIsssuesForSprint)

    useEffect(()=>{
        if(currentSprint.id){
            fetchIssues(currentSprint.id)
        }
    },[currentSprint.id])

    const [filteredIssues,setFilteredIssues]=useState(issues)

    useEffect(() => {
        setFilteredIssues(issues)
    }, [issues])


    const handelFilteredChange=(newFilteredIssues)=>{
        setFilteredIssues(newFilteredIssues)
    }

    const handelIssueCreated=()=>{
        fetchIssues(currentSprint.id)
    }

    const{
        fn:updateIssueOrderFn,
        loading:updateIssuesLoading,
        error:updateIssuesError,
    }=useFetch(updateIssueOrder)

    const router = useRouter()

    const onDragEnd=async(result)=>{
         if(currentSprint.status==="PLANNED"){
            toast.warning("Start the sprint to update board")
            return
         }
         if(currentSprint.status ==="COMPLETED"){
            toast.warning("Cannot update board after sprint end")
         }
          
         const {destination,source} =result
         if(!destination){
            return
         }

         if(destination.droppableId===source.droppableId &&
            destination.index === source.index
         ){
            return
         }

        const newOrderedData=[...issues]
        //  Then we have to update both the source & destination List-:
        const sourceList=newOrderedData.filter(
            (list)=>list.status===source.droppableId
        )
        const destinationList=newOrderedData.filter(
            (list)=>list.status === destination.droppableId
        )

        // If sources & dest same
        if(source.droppableId===destination.droppableId){
            const reorderedCards=reOrder(sourceList,source.index,destination.index)
            reorderedCards.forEach((card,i)=>{
                card.order=i;
            })
        }
        else{
            const [movedCard]=sourceList.splice(source.index,1)
            movedCard.status=destination.droppableId
            destinationList.splice(destination.index,0,movedCard)
            sourceList.forEach((card,i)=>{
                card.order=i
            })

            destinationList.forEach((card,i)=>{
                card.order=i
            })


        }

        const sortIssues=newOrderedData.sort((a,b)=>a.order-b.order)
        // setIssues(newOrderData,sortIssues)
        setIssues(sortIssues)


        // APi call
        updateIssueOrderFn(sortIssues)

         router.refresh() 
    }

    if(issuesError)return <div>Error loading issues</div>
  return (

    <div>
        {/* {SprintManager} */}
         <SprintManager
         sprint={currentSprint}
         setSprint={setCurrentSprint}
         sprints={sprints}
         projectId={projectId} 
         />

         {issues && !issueLoading && (
            <BoardFilters issues={issues} onFilterChange={handelFilteredChange}/>
         )}
        {updateIssuesError && (
            <p className='text-red-500 mt-2'>{updateIssuesError.message}</p>
        )}
         {(updateIssuesLoading || issueLoading )&& (
            <BarLoader className="mt-4" width={"100%"} color="#36d7b7"/>
         ) }

        {/* {Kanban Board} */}
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-[#0a0a0a] p-4 rounded-lg">
            {statuses.map((column)=>{
                return <Droppable key={column.key} droppableId={column.key}>
                  {(provided)=>{
                    return(
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='space-y-2'
                    >  
                        <h3 className='font-semibold mb-2 text-center'>{column.name}</h3>

                        {/* Issues*/}
                      {
                        filteredIssues
                            ?.filter((issue) => issue.status === column.key)
                            .map((issue, index) => (
                            <Draggable
                                key={issue.id}
                                draggableId={issue.id}
                                index={index}
                                isDragDisabled={updateIssuesLoading}
                            >
                               {(provided)=>{
                                return(
                                    <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    >
                                        <IssueCard issue={issue}
                                         onDelete={()=>fetchIssues(currentSprint.id)}
                                         onUpdate={(updated)=>
                                            setIssues((issues)=>
                                            issues.map((issue)=>{
                                                if(issue.id=== updated.id)
                                                    return updated
                                                return issue
                                            })
                                            )
                                            
                                          

                                         }
                                        />
                                    </div>
                                )
                               }}
                            </Draggable>
                            ))
                        }



                        {provided.placeholder}
                        {column.key ==="TODO" &&
                        currentSprint.status !== "COMPLETED" && (
                            <Button variant="ghost" className="w-full cursor-pointer" onClick={()=>handelAddIssue(column.key)}>
                                <Plus className='mr-2 h-4 w-4'/>
                                Create Issue
                            </Button>
                        )
                        }

                    </div>
                    )
                  }}

                </Droppable>
            })}
            
            </div> 
        </DragDropContext>

        <IssueCreationDrawer
         isOpen={isDrawerOpen}
         onClose={()=>setIsDrawerOpen(false)}
         sprintId={currentSprint.id}
         status={selectedStatus}
         projectId={projectId}
         onIssueCreated={handelIssueCreated}
         orgId={orgId}  
        />
    </div>
  )
}

export default SpringBoard