"use server"
import { clerk } from "@/lib/clerk";
// import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
// import { OrganizationMembership } from "@clerk/nextjs/server";

export async function getOrganization(slug){
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

    const organization=await clerk.organizations.getOrganization({
        slug
    })

    if(!organization){
        return null
    }

    const {data:membership}=
    await clerk.organizations.getOrganizationMembershipList({
        organizationId:organization.id
    })
    

    const usermembership=membership.find(
        (member)=> member.publicUserData.userId === userId
    )

    if(!usermembership){return null;}

    return organization

}

export async function getOrganizationUsers(orderId){
      const {userId,orgId}=await auth()

    if(!userId){
        throw new Error("Unauthorized")
    }
    
    const user=await db.user.findUnique({
        where:{clerkUserId:userId}
    })

    if(!user){
        throw new Error("User not found")
    } 

    const {data:membership}=
    await clerk.organizations.getOrganizationMembershipList({
        organizationId:orgId
    })

    // const userIds=OrganizationMembership.data.map(
    const userIds=membership.map(

        (membership_)=> membership_.publicUserData.userId
    )

    const users=await db.user.findMany({
        where:{
            clerkUserId:{
                in:userIds
            }
        }
    })
console.log("userList",users)
    return users


}