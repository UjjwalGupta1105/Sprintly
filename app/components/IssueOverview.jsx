"use client"

import { motion } from "framer-motion"
import MarkdownEditor from "@uiw/react-markdown-editor"

const badgeStyles = {
  TODO: "bg-gray-700 text-gray-200",
  IN_PROGRESS: "bg-blue-600/20 text-blue-400",
  IN_REVIEW: "bg-yellow-600/20 text-yellow-400",
  DONE: "bg-green-600/20 text-green-400",
}

const priorityStyles = {
  LOW: "text-green-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-orange-400",
  URGENT: "text-red-500",
}

const IssueOverview = ({ issue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/80 backdrop-blur rounded-xl p-6 space-y-5"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
     
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            badgeStyles[issue.status]
          }`}
        >
          {issue.status.replace("_", " ")}
        </span>

        <span
          className={`text-sm font-semibold ${
            priorityStyles[issue.priority]
          }`}
        >
          Priority: {issue.priority}
        </span>

        <span className="text-xs text-gray-400">
          Created: {new Date(issue.createdAt).toLocaleString()}
        </span>

        <span className="text-xs text-gray-400">
          Updated: {new Date(issue.updatedAt).toLocaleString()}
        </span>
      </div>

      {/* Description */}
        <div>
        <h3 className="text-lg font-semibold gradient-title mb-2">
            Description
        </h3>

        {issue.description ? (
            <MarkdownEditor.Markdown
            source={issue.description}
            className="text-sm text-gray-300 leading-relaxed !bg-transparent !p-0 !shadow-none"
            />
        ) : (
            <p className="text-sm text-gray-500">No description provided.</p>
        )}
        </div>

    </motion.div>
  )
}

export default IssueOverview
