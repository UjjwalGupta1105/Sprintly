import React from "react"
import { getIssueDetails } from "@/app/actions/issues"
import IssueHeader from "../../../components/IssueHeader"
import IssueMeta from "../../../components/IssueMeta"
import IssueComments from "../../../components/IssueComments"
import IssueHistory from "../../../components/IssueHistory"
import IssueOverview from "../../../components/IssueOverview"

const IssuesDetails = async ({ params }) => {
  const { issueId } =await params
  const issue = await getIssueDetails(issueId)

  if (!issue) {
    return <div className="min-h-screen m-6">Issue Not Found</div>
  }

  return (
    <div className="min-h-screen text-white px-6 py-2 space-y-8">
     
      <IssueHeader issue={issue} />

      
      <IssueMeta issue={issue} />

      
      <IssueOverview issue={issue} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <IssueComments issue={issue} />
        </div>

        <IssueHistory activities={issue.activities} />
      </div>
    </div>
  )
}

export default IssuesDetails
