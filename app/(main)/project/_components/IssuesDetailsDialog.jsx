import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useOrganization, useUser } from "@clerk/nextjs"
import { ExternalLink } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import statuses from "@/app/data/status"
import MarkdownEditor from "@uiw/react-markdown-editor"
import { useEffect,useState } from "react"
import useFetch from "@/app/hooks/use-fetch"
import { deleteIssue, updateIssue } from "@/app/actions/issues"
import { BarLoader } from "react-spinners"
import UserAvatar from "./UserAvatar"

const priorityOptions=["LOW","MEDIUM","HIGH","URGENT"]

const IssuesDetailsDialog = ({
    isOpen,
    onClose,
    issue,
    onDelete=()=>{},
    onUpdate=()=>{},
    borderCol=""
}) => {
    console.log(issue)

    const [status,setStatus]=useState(issue.status)
    const [priority,setPriority]=useState(issue.priority)

    const {user}=useUser()
    const {membership}=useOrganization()

    const router=useRouter()
    const pathname=usePathname()

    const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
    } = useFetch(deleteIssue);

    const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
    } = useFetch(updateIssue);

     const handelStatusChange=async(newStatus)=>{
        setStatus(newStatus)
        updateIssueFn(issue.id,{status:newStatus,priority})
    } 
    const handelPriorityChange=async(newPriority)=>{
        setPriority(newPriority)
        updateIssueFn(issue.id,{status,priority:newPriority})
    }
    const handelDelete=()=>{
        if(window.confirm("Are you sure you want to delete this Issue?")){
            deleteIssueFn(issue.id)
        }
    }

    useEffect(()=>{
        if(deleted){
            onClose()
            onDelete()
             router.refresh()
        }
        if(updated){
            onUpdate(updated)
             router.refresh()
        }
    },[deleted, updated])



    const canChange=
    user.id===issue.reporter.clerkUserId || membership.role === "org:admin"

    const isProjectPage=pathname.startsWith("/project/")

    const handelGoToProject=()=>{
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`)
    }
  return (
    <div>
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <div className="flex justify-between items-center">
                    <DialogTitle className={'text-3xl'}>{issue.title}</DialogTitle>
                </div>
                {!isProjectPage &&( 
                <Button variant="ghost" size="icon" onClick={handelGoToProject} title="Go to Project" className={'cursor-pointer'}>
                    <ExternalLink className="h-4 w-4"/>
                </Button>
                )}
            </DialogHeader>
            {(updateLoading || deleteLoading) && (
                <BarLoader width={"100%"} color="#36d7b7"/>
            )}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                <Select value={status} onValueChange={handelStatusChange}>
                <SelectTrigger className={`border ${borderCol} rounded`}>
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((option)=>{
                        return<SelectItem key={option.key} value={option.key}>{option.name}</SelectItem>
                    })}
                    
                </SelectContent>
                </Select>
            </div>
            <div>
                <Select value={priority} onValueChange={handelPriorityChange} disabled={!canChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    {priorityOptions.map((option)=>{
                        return<SelectItem key={option} value={option}>{option}</SelectItem>
                    })}
                    
                </SelectContent>
                </Select>
            </div>
            <div>
                <h4 className="font-semibold">Description</h4>
                <MarkdownEditor.Markdown
                className="rounded px-2 py-1"
                source={issue.description ? issue.description : "--"}
                />
            </div>
            <div className="flex justify-between">
            <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Assignee</h4>
                {console.log("assignee",issue.assignee.clerkUserId)}
                <UserAvatar user={issue.assignee} />
            </div>
 
            <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Reporter</h4>
                {console.log("reporter",issue.reporter.clerkUserId)}
                <UserAvatar user={issue.reporter} />
            </div>
            </div>
            
            {canChange && (
                <Button
                onClick={handelDelete}
                disabled={deleteLoading}
                variant="destructive"
                className={`cursor-pointer`}
                >
                {deleteLoading?"Deleting...":"Delete Issue"}
                </Button>
            )}
            {(deleteError || updateError)&& (
                <p className="text-red-500">
                    {deleteError?.message || updateError?.message}
                </p>
            )}
            </div>
            
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default IssuesDetailsDialog