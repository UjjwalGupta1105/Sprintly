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


export async function getOrganizationAdmins() {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

 
  const { data: memberships } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    })

  
  const adminClerkUserIds = memberships
    .filter((m) => m.role === "org:admin")
    .map((m) => m.publicUserData.userId)
    .filter(Boolean)

 
  const admins = await db.user.findMany({
    where: {
      clerkUserId: {
        in: adminClerkUserIds,
      },
    },
  })

  return admins
}




export async function getOrganizationData(){
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

     const data= await clerk.organizations.getOrganizationMembershipList({
        organizationId:orgId
    })
    console.log("orgData",data)
    return data


}


