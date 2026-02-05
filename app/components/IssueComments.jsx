"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import MarkdownEditor from "@uiw/react-markdown-editor"
import UserAvatar from "./userAvatar"

const CommentItem = ({ comment }) => {
  const [expanded, setExpanded] = useState(false)

  const shouldTruncate = comment.content.length > 200

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
     
      <UserAvatar user={comment.author} size="sm" />

  
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">
          {comment.author.name}
        </p>
        <p className="text-xs text-gray-400 mb-2">
          {new Date(comment.createdAt).toLocaleString()}
        </p>

        <div
          className={`text-sm text-gray-300 ${
            !expanded && shouldTruncate ? "line-clamp-4" : ""
          }`}
        >
        
          <MarkdownEditor.Markdown
            source={comment.content}
            className="prose prose-invert max-w-none py-1 px-2 rounded"
          />
        </div>

        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs text-purple-400 hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    </motion.div>
  )
}

const IssueComments = ({ issue }) => {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 space-y-6">
      <h2 className="text-xl font-semibold gradient-title">Comments</h2>

      {issue.comments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet</p>
      )}

      {issue.comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default IssueComments
