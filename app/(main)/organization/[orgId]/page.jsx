import { auth } from "@clerk/nextjs/server";
import { getOrganization } from "@/app/actions/organization";
import OrgSwitcher from "@/app/components/OrgSwitcher";
import ProjectGrid from "./_components/ProjectGrid";
import OrgStats from "./_components/OrgStats";
import UserIssues from "./_components/UserIssues";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import { Suspense } from "react";
// import OrgStatsSkeleton from "./_components/OrgStatsSkeleton"

const OrganizationPage = async () => {
  const { userId, orgId } = await auth();
  const organization = await getOrganization(orgId);

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Organization not found
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-5xl font-bold gradient-title">
            {organization.name}
          </h1>
          <p className="text-gray-400 mt-1">
            Organization overview & project management
          </p>
        </div>

        <div className="flex flex-col items-left gap-5 md:gap-4 bg-gray-550">
          <OrgSwitcher />

          <div className=' md:hidden'>
              <Link href="/project/create" >
                <Button variant='destructive' className=" cursor-pointer w-[148] flex items-center gap-2 relative h-[35px]">
                  <PenBox size={1} width={9} className='m-0 p-0 absolute right-7 svg'/>
                  <span className='ml-5'>Create Project</span>
                </Button>
              </Link>
        </div>
        </div>
      </div>
       
       

      {/* STATS */}
    <Suspense >
      <OrgStats orgId={organization.id} />
    </Suspense>
      {/* <OrgStats orgId={organization.id} /> */}

      {/* PROJECTS */}
      <div className="mt-14">
        <ProjectGrid orgId={organization.id} />
      </div>

      {/* USER ISSUES */}
      <div className="mt-16 mb-5">
        <UserIssues userId={userId} />
      </div>
    </div>
  );
};

export default OrganizationPage;

