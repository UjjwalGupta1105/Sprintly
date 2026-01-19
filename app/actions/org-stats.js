"use server";

import { db } from "@/lib/prisma";

export async function getOrgStats(organizationId) {
  const [
    totalProjects,
    activeProjects,
    completedIssues,
    pendingIssues,
    totalUsers,
  ] = await Promise.all([
    // Total projects in organization
    db.project.count({
      where: { organizationId },
    }),

    // Active projects = projects having at least one ACTIVE sprint
    db.project.count({
      where: {
        organizationId,
        sprints: {
          some: {
            status: "ACTIVE",
          },
        },
      },
    }),

    // Completed issues (DONE)
    db.issue.count({
      where: {
        status: "DONE",
        project: {
          organizationId,
        },
      },
    }),

    // Pending issues (NOT DONE)
    db.issue.count({
      where: {
        status: { not: "DONE" },
        project: {
          organizationId,
        },
      },
    }),

    // Total unique users involved (reporters + assignees)
    db.user.count({
      where: {
        OR: [
          {
            createdIssues: {
              some: {
                project: { organizationId },
              },
            },
          },
          {
            assignedIssues: {
              some: {
                project: { organizationId },
              },
            },
          },
        ],
      },
    }),
  ]);

  return {
    totalProjects,
    activeProjects,
    totalUsers,
    completedIssues,
    pendingIssues,
  };
}
