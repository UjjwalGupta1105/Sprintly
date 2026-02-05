"use server"

import { db } from "@/lib/prisma";
import { auth, clerkClient  } from "@clerk/nextjs/server";


export async function createIsuue(projectId,data){
     const {userId,orgId}=await auth()

    if(!userId || !orgId){
        throw new Error("Unauthorized")
    }

    let user=await db.user.findUnique({where:{clerkUserId:userId}})

    const lastIsssue=await db.issue.findFirst({
        where:{projectId,status:data.status},
        orderBy:{order:"desc"}
    })
    const newOrder=lastIsssue? lastIsssue.order+1:0;

    const issue = await db.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority, 
            projectId: projectId,
            sprintId: data.sprintId,
            reporterId: user.id,
            assigneeId: data.assigneeId || null,
            order: newOrder,
        },
        include:{
            assignee:true,
            reporter:true
        }
    });
    return issue
}

export async function getIsssuesForSprint(sprintId){
    const {userId,orgId}=await auth()

    if(!userId || !orgId){
        throw new Error("Unauthorized")
    }

    const issues=await db.issue.findMany({
        where:{sprintId},
        orderBy:[{status:"asc"},{order:"asc"}],
        include:{
            assignee:true,
            reporter:true
        }
    })

    if(!issues){
        return null
    }

    return issues
}
// We had used here transaction bec of a lot of dynamic it is
// a lot of issues order & position is changing here dynamically
export async function updateIssueOrder(updatedIssues) {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }
   const user=await db.user.findUnique({
        where:{clerkUserId:userId}
    })

    if(!user){
            throw new Error("User Not Found");
    }

  await db.$transaction(async (prisma) => {
    for (const issue of updatedIssues) {

      
      const existingIssue = await db.issue.findUnique({
        where: { id: issue.id },
        select: { status: true }
      })

      if (!existingIssue) continue

      
      await db.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order
        }
      })

      
      if (existingIssue.status !== issue.status) {
        await db.issueActivity.create({
          data: {
            issueId: issue.id,
            actorId: user.id,
            type: "CHANGED_STATUS",
            oldValue: existingIssue.status,
            newValue: issue.status
          }
        })
      }
    }
  })

  return { success: true }
}


export async function deleteIssue(issueId){
    const {userId,orgId}=await auth()
    
        if(!userId || !orgId){
            throw new Error("Unauthorized")
        }


        const user=await db.user.findUnique({
            where:{clerkUserId:userId}
        })

        if(!user){
            throw new Error("User Not Found");
        }

        const issue=await db.issue.findUnique({
            where:{id: issueId},
            include:{project:true}
        })

        if(!issue)throw new Error("Issue not found")
            
        if(issue.reporterId !== user.id &&
         !issue.project.adminIds.includes(user.id)) {
            throw new Error("You don't have permission to delete this issue")
        }   

        await db.issue.delete({where:{id:issueId}})

        return {success:true}
}

export async function updateIssue(issueId, data) {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  const user=await db.user.findUnique({
        where:{clerkUserId:userId}
    })

    if(!user){
            throw new Error("User Not Found");
    }

  return await db.$transaction(async (prisma) => {

    
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true }
    })

    if (!issue) {
      throw new Error("Issue not found")
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized")
    }

  
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority
      },
      include: {
        assignee: true,
        reporter: true
      }
    })

    //  Log STATUS change (only if changed)
    if (data.status && data.status !== issue.status) {
      await prisma.issueActivity.create({
        data: {
          issueId,
          actorId: user.id,
          type: "CHANGED_STATUS",
          oldValue: issue.status,
          newValue: data.status
        }
      })
    }

    //  Log PRIORITY change (only if changed)
    if (data.priority && data.priority !== issue.priority) {
      await prisma.issueActivity.create({
        data: {
          issueId,
          actorId: user.id,
          type: "CHANGED_PRIORITY",
          oldValue: issue.priority,
          newValue: data.priority
        }
      })
    }

    return updatedIssue
  })
}

export async function getUserIssues(userid){
    console.log("here",userid)
    const {userId,orgId}=await auth()
    
        if(!userId || !orgId){
            throw new Error("Unauthorized")
        }
        if(!userid){
            throw new Error("Not Found")
        }


        const user=await db.user.findUnique({
            where:{clerkUserId:userid}
        })

        if(!user){
            throw new Error("User Not Found");
        }

        const issues = await db.issue.findMany({
        where: {
            OR: [
            { assigneeId: user.id },
            { reporterId: user.id },
            ],
            project: {
            organizationId: orgId,
            },
        },
        include: {
            project: true,
            assignee: true,
            reporter: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
        });

        return issues;
}

export async function getIssueDetails(issueId){
     const {userId,orgId}=await auth()
    
        if(!userId || !orgId){
            throw new Error("Unauthorized")
        }


        const user=await db.user.findUnique({
            where:{clerkUserId:userId}
        })

        if(!user){
            throw new Error("User Not Found");
        }

        const issue = await db.issue.findUnique({
            where: { id: issueId },
            include: {
                assignee: true,
                reporter: true,
                comments: {
                include: { author: true },
                orderBy: { createdAt: "asc" },
                },
                activities: {
                include: { actor: true },
                orderBy: { createdAt: "desc" },
                },
            },
        })

        if(!issue){
            return null;
        }

        // if(issue.project.organizationId !==orgId){
        //     return null
        // }

        return issue
}

export async function createIsuueComment(issueId, content) {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if (!user) {
    throw new Error("User Not Found")
  }

  const issueComment = await db.issueComment.create({
    data: {
      content,          
      issueId,
      authorId: user.id, 
    },
    include: {
      author: true,
    },
  })

  return issueComment
}


export async function changeIssueAssignee(issueId, newAssigneeId) {
  const { userId,orgId, has} = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

   if (!has({ role: "org:admin" })) {
    throw new Error("Only admins can change assignee")
  }


   const user=await db.user.findUnique({
            where:{clerkUserId:userId}
    })

    if(!user){
            throw new Error("User Not Found");
    }

  return await db.$transaction(async (prisma) => {

    
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: {
        assignee: true,
        project: true
      }
    })

    if (!issue) {
      throw new Error("Issue not found")
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized")
    }

    
    if (issue.assigneeId === newAssigneeId) {
      return issue
    }

    
    const newAssignee = await db.user.findUnique({
      where: { id: newAssigneeId }
    })
    console.log("Incoming assigneeId:", newAssigneeId)
    if (!newAssignee) {
      throw new Error("Assignee not found")
    }

   
    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: { assigneeId: newAssigneeId },
      include: {
        assignee: true,
        reporter: true
      }
    })

    
    await db.issueActivity.create({
      data: {
        issueId,
        actorId: user.id,
        type: "CHANGED_ASSIGNEE",
        oldValue: issue.assignee?.name ?? "Unassigned",
        newValue: newAssignee.name
      }
    })

    return updatedIssue
  })
}

export async function changeIssueReporter(issueId, newReporterId) {
  const { userId, orgId,has } = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  if (!has({ role: "org:admin" })) {
    throw new Error("Only admins can change reporter")
  }

//   const membership = await clerkClient.organizations.getOrganizationMembership({
//       organizationId: orgId,
//       userId,
//     })

//   if (membership.role !== "org:admin") {
//     throw new Error("Only admins can change assignee")
//   }

   const user=await db.user.findUnique({
            where:{clerkUserId:userId}
    })

    if(!user){
            throw new Error("User Not Found");
    }

  return await db.$transaction(async (prisma) => {

   
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        reporter: true,
        project: true
      }
    })

    if (!issue) {
      throw new Error("Issue not found")
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized")
    }

   
    if (issue.reporterId === newReporterId) {
      return issue
    }

 
    const newReporter = await prisma.user.findUnique({
        where: { id: newReporterId }
    })

    if (!newReporter) {
      throw new Error("Reporter not found")
    }

   
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: { reporterId: newReporterId },
      include: {
        assignee: true,
        reporter: true
      }
    })

    
    await prisma.issueActivity.create({
      data: {
        issueId,
        actorId: user.id,
        type: "CHANGED_REPORTER",
        oldValue: issue.reporter.name,
        newValue: newReporter.name
      }
    })

    return updatedIssue
  })
}

// export async function changeIssueReporter(issueId, newReporterId) {
//   const { userId, orgId, role } = await auth()

//   if (!userId || !orgId) {
//     throw new Error("Unauthorized")
//   }

//   if (role !== "ADMIN") {
//     throw new Error("Only admins can change reporter")
//   }

//  const user=await db.user.findUnique({
//             where:{clerkUserId:userId}
//         })

//         if(!user){
//             throw new Error("User Not Found");
//         }

//   return await db.$transaction(async (prisma) => {

    
//     const issue = await db.issue.findUnique({
//       where: { id: issueId },
//       include: {
//         reporter: true,
//         project: true
//       }
//     })

//     if (!issue) {
//       throw new Error("Issue not found")
//     }

//     if (issue.project.organizationId !== orgId) {
//       throw new Error("Unauthorized")
//     }

    
//     if (issue.reporterId === newReporterId) {
//       return issue
//     }

    
//     const newReporter = await db.user.findUnique({
//       where: { id: newReporterId }
//     })

//     if (!newReporter) {
//       throw new Error("Reporter not found")
//     }

    
//     const updatedIssue = await db.issue.update({
//       where: { id: issueId },
//       data: { reporterId: newReporterId },
//       include: {
//         assignee: true,
//         reporter: true
//       }
//     })

    
//     await db.issueActivity.create({
//       data: {
//         issueId,
//         actorId: user.id,
//         type: "REPORTER_CHANGED",
//         oldValue: issue.reporter.name,
//         newValue: newReporter.name
//       }
//     })

//     return updatedIssue
//   })
// }

