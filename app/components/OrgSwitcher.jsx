"use client"
import { OrganizationSwitcher, SignedIn } from '@clerk/clerk-react'
import { useOrganization,useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React from 'react'

const OrgSwitcher = () => {
    const {isLoaded}=useOrganization()
    const {isLoaded: isUserLoaded}=useUser();
    const pathname=usePathname()

    if(!isLoaded && !isUserLoaded){
        return null
    }

  return (
    <div>
        <SignedIn>
            <OrganizationSwitcher
             hidePersonal
             afterCreateOrganizationUrl="/organization/:slug"
             afterSelectOrganizationUrl="/organization/:slug"
             createOrganizationMode={
                pathname=== "/onboarding" ? "navigation" : "modal"
             }
             createOrganizationUrl="/onboarding"
             appearence={{
                elements:{
                    organizationSwitcherTrigger:
                    "border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md px-5 py-2 transition",
                    organizationSwitcherTriggerIcon:"text-white"
                }
             }}
             />
        
        </SignedIn>
    </div>
  )
}

export default OrgSwitcher