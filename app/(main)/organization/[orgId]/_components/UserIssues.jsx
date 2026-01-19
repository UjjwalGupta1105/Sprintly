"use client";

import IssueCard from "@/app/(main)/project/_components/IssueCard";
import { getUserIssues } from "@/app/actions/issues";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";

const UserIssues = ({ userId }) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const data = await getUserIssues(userId);
      setIssues(data || []);
    };
    fetchIssues();
  }, [userId]);

  if (!issues.length) return null;

  const assignedIssues = issues.filter(
    (issue) => issue.assignee?.clerkUserId === userId
  );

  const reportedIssues = issues.filter(
    (issue) => issue.reporter?.clerkUserId === userId
  );

  return (
    <div className="w-full mt-20">
      {/* SECTION HEADER */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold gradient-title">
          My Issues
        </h2>
        <p className="text-gray-400 mt-1">
          Track issues assigned to you and reported by you
        </p>
      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-6 bg-white/5 border border-white/10">
          <TabsTrigger value="assigned">
            Assigned to Me ({assignedIssues.length})
          </TabsTrigger>
          <TabsTrigger value="reported">
            Reported by Me ({reportedIssues.length})
          </TabsTrigger>
        </TabsList>

        {/* ASSIGNED */}
        <TabsContent value="assigned">
          <Suspense fallback={<IssuesSkeleton />}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>

        {/* REPORTED */}
        <TabsContent value="reported">
          <Suspense fallback={<IssuesSkeleton />}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserIssues;

function IssueGrid({ issues }) {
  if (!issues.length) {
    return (
      <div className="text-gray-400 bg-white/5 border border-white/10 rounded-xl p-6">
        No issues found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
    >
      {issues.map((issue, i) => (
        <motion.div
          key={issue.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <IssueCard issue={issue} showStatus />
        </motion.div>
      ))}
    </motion.div>
  );
}

function IssuesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-xl bg-white/5 border border-white/10 animate-pulse"
        />
      ))}
    </div>
  );
}
