"use server";

import { db } from "@/lib/prisma";

export async function getOrgStats(organizationId) {
  const [
    totalProjects,
    activeProjects,
    completedIssues,
    pendingIssues,
    usersFromIssues,
  ] = await Promise.all([
    // Total projects
    db.project.count({
      where: { organizationId },
    }),

    // Active projects
    db.project.count({
      where: {
        organizationId,
        sprints: {
          some: { status: "ACTIVE" },
        },
      },
    }),

    // Completed issues
    db.issue.count({
      where: {
        status: "DONE",
        project: { organizationId },
      },
    }),

    // Pending issues
    db.issue.count({
      where: {
        status: { not: "DONE" },
        project: { organizationId },
      },
    }),

    // 🚀 FAST user count via issues
    db.issue.findMany({
      where: {
        project: { organizationId },
      },
      select: {
        reporterId: true,
        assigneeId: true,
      },
      distinct: ["reporterId", "assigneeId"],
    }),
  ]);

  const uniqueUsers = new Set(
    usersFromIssues.flatMap(i => [i.reporterId, i.assigneeId]).filter(Boolean)
  ).size;

  return {
    totalProjects,
    activeProjects,
    completedIssues,
    pendingIssues,
    totalUsers: uniqueUsers,
  };
}
