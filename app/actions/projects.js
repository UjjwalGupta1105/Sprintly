"use server"

import { clerk } from "@/lib/clerk";
// import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function createProject(data){
    const {userId,orgId}=await auth()
    
        if(!userId){
            throw new Error("Unauthorized")
        }

         if(!orgId){
            throw new Error("No Organization Selected")
        }

    
        const {data:membership}=
        await clerk.organizations.getOrganizationMembershipList({
            organizationId:orgId
        })
        
    
        const usermembership=membership.find(
            (member)=> member.publicUserData.userId === userId
        )
    
        if(!usermembership || usermembership.role!=="org:admin"){
            throw new Error("Only organization admins can create projects")
        }

        try {
          const project=await db.project.create({
            data:{
                name:data.name,
                key:data.key,
                description:data.description,
                organizationId:orgId
            }
          })  
          return project;
        } catch (error) {
            throw new Error("Error creating project:" + error.message)
        }
    
       
}

export async function getProjects(orgId){
        const {userId}=await auth()
    
        if(!userId){
            throw new Error("Unauthorized")
        }

        const user=await db.user.findUnique({
            where:{clerkUserId:userId}
        })

        if(!user){
            throw new Error("User not found")
        }

        const projects=await db.project.findMany({
            where:{organizationId:orgId},
            orderBy:{createdAt:"desc"}
        })

        return projects
}

export async function deleteProject(projectId){
    const {userId,orgId,orgRole}=await auth()
    console.log("here", userId,",",orgId)
   
    if(!userId || !orgId){
        throw new Error("Unauthorized")
    }

    if(orgRole!=="org:admin"){
        throw new Error("Only organization admins can delete projects")
    }

    const project=await db.project.findUnique({
            where:{id:projectId}
    })

    if(!project || project.organizationId !==orgId){
        throw new Error("Project not found or you don't have permission to delete it")
    }

    await db.project.delete({
        where:{id:projectId}
    })

    return {success:true}
}

export async function getProject(projectId){
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

        const project=await db.project.findUnique({
            where:{id:projectId},
            include:{
                sprints:{
                    orderBy:{createdAt:"desc"}
                }
            }
        })

        if(!project){
            return null;
        }

        if(project.organizationId !==orgId){
            return null
        }

        return project

}