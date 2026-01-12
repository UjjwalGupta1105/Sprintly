import { getOrganization } from "@/app/actions/organization";
import React from "react";
import OrgSwitcher from "@/app/components/OrgSwitcher";
import ProjectList from "./_components/ProjectList"
import UserIssues from "./_components/UserIssues";
import { auth } from "@clerk/nextjs/server";

const OrganizationPage = async({ params }) => {
  //  console.log("oii",params)
  // const { orgId } = await params;
   const { userId,orgId } = await auth();
  const organization=await getOrganization(orgId)

  if(!organization){
    return <div>Organization not found</div>
  }
 
  return (
    <div className="mx-auto min-h-screen relative py-4 px-7">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
         <h1 className="text-5xl font-bold gradient-title pb-2">{organization.name}'s Projects</h1>
      <OrgSwitcher className=""/>
      </div>
     
      <div className="mb-4">
        <ProjectList orgId={organization.id}/>
      </div>

      <div className="mt-8">
        <UserIssues userId={userId}/>
      </div>
     
    </div>
  );
};

export default OrganizationPage;
