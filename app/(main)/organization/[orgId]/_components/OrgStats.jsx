"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  Activity,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getOrgStats } from "@/app/actions/org-stats";

export default function OrgStats({ orgId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getOrgStats(orgId);
      setStats(data);
    };
    fetchStats();
  }, [orgId]);

  if (!stats) {
    return <StatsSkeleton />;
  }

  const items = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-blue-400",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: Activity,
      color: "text-emerald-400",
    },
    {
      label: "Team Members",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-400",
    },
    {
      label: "Completed Issues",
      value: stats.completedIssues,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      label: "Pending Issues",
      value: stats.pendingIssues,
      icon: AlertCircle,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="group bg-white/5 border border-white/10 backdrop-blur hover:border-white/20 transition-all cursor-pointer hover:-translate-y-1">
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-white/5 ${item.color}`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse"
        />
      ))}
    </div>
  );
}
