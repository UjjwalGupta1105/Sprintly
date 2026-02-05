"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { changeIssueAssignee, changeIssueReporter } from "@/app/actions/issues"
import { motion } from "framer-motion"
import { useOrganization } from "@clerk/nextjs"
import UserAvatar from "@/app/(main)/project/_components/UserAvatar"
import {
  getOrganizationUsers,
  getOrganizationAdmins,
} from "@/app/actions/organization"
import { useState, useEffect } from "react"
import { BarLoader } from "react-spinners"
import { toast } from "sonner"

const IssueMeta = ({ issue }) => {
  const { membership, organization } = useOrganization()

  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])

  // 🔹 UI STATE (ADDED)
  const [assignee, setAssignee] = useState(issue.assignee)
  const [reporter, setReporter] = useState(issue.reporter)
  const [loadingAssignee, setLoadingAssignee] = useState(false)
  const [loadingReporter, setLoadingReporter] = useState(false)

  useEffect(() => {
    if (!organization?.id) return
    getOrganizationUsers(organization.id).then(setUsers)
  }, [organization?.id])

  useEffect(() => {
    if (!organization?.id) return
    getOrganizationAdmins(organization.id).then(setAdmins)
  }, [organization?.id])

  
  const handleAssigneeChange = async (val) => {
    const nextUser = users.find((u) => u.id === val)
    if (!nextUser) return

    setAssignee(nextUser) 
    setLoadingAssignee(true)

    try {
      await changeIssueAssignee(issue.id, val)
      toast.success("Assignee updated")
    } catch (err) {
      toast.error(err.message || "Failed to update assignee")
      setAssignee(issue.assignee) 
    } finally {
      setLoadingAssignee(false)
    }
  }


  const handleReporterChange = async (val) => {
    const nextUser = admins.find((u) => u.id === val)
    if (!nextUser) return

    setReporter(nextUser)
    setLoadingReporter(true)

    try {
      await changeIssueReporter(issue.id, val)
      toast.success("Reporter updated")
    } catch (err) {
      toast.error(err.message || "Failed to update reporter")
      setReporter(issue.reporter)
    } finally {
      setLoadingReporter(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* ASSIGNEE */}
      <div className="space-y-3">
        <p className="text-sm text-gray-400">Assignee</p>

        <div className="flex items-center gap-3">
          <UserAvatar user={assignee} size="md" />
        </div>

        {loadingAssignee && <BarLoader width="100%" color="#36d7b7" />}

        {membership?.role === "org:admin" && (
          <Select
            defaultvalue={assignee?.id ?? ""}
            onValueChange={handleAssigneeChange}
            disabled={loadingAssignee}
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700 text-sm">
              <SelectValue placeholder="Change assignee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* REPORTER */}
      <div className="space-y-3">
        <p className="text-sm text-gray-400">Reporter</p>

        <div className="flex items-center gap-3">
          <UserAvatar user={reporter} size="md" />
        </div>

        {loadingReporter && <BarLoader width="100%" color="#36d7b7" />}

        {membership?.role === "org:admin" && (
          <Select
            defaultvalue={reporter?.id ?? ""}
            onValueChange={handleReporterChange}
            disabled={loadingReporter}
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700 text-sm">
              <SelectValue placeholder="Change reporter" />
            </SelectTrigger>
            <SelectContent>
              {admins.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </motion.div>
  )
}

export default IssueMeta
