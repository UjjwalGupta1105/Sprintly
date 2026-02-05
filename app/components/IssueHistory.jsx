"use client"

import { motion } from "framer-motion"
import UserAvatar from "./userAvatar"

const IssueHistory = ({ activities }) => {
  return (
    <div className="bg-neutral-900 rounded-xl p-5 space-y-5">
      <h2 className="text-xl font-semibold gradient-title">History</h2>

      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex gap-4 items-start"
        >
          
          
         <UserAvatar user={activity.actor} size="md" />
         

          {/* Content column */}
          <div className="flex-1">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-white">
                {activity.actor.name}
              </span>{" "}
              <span className="text-gray-400">
                {activity.type.replace("_", " ").toLowerCase()}
              </span>{" "}
              <span className="text-gray-300">
                {activity.oldValue} → {activity.newValue}
              </span>
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {new Date(activity.createdAt).toLocaleString()}
            </p>

            
            <div className="mt-4 h-px bg-neutral-800" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default IssueHistory
