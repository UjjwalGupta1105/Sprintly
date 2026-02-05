"use client"

import { motion } from "framer-motion"

const IssueHeader = ({ issue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="space-y-2"
    >
      <h1 className="text-5xl font-bold gradient-title">
        {issue.title}
      </h1>
      <p className="text-md text-gray-400">
        Issue ID • {issue.id}
      </p>
    </motion.div>
  )
}

export default IssueHeader
