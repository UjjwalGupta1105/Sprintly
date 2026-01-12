"use client"

import { OrganizationList, useOrganization } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const OnboardingPage = () => {
  const  {organization}=useOrganization()
  const router=useRouter()

  // useEffect(()=>{
  //   if(organization){
  //     router.push(`/organization/${organization.slug}`)
  //   }
  // },[organization])

  return (
    <div className=' min-h-screen flex justify-center pt-14'>
      <OrganizationList
       hidePersonal 
       afterSelectOrganizationUrl={`/organization/${organization.slug}`}
      //  afterSelectOrganizationUrl="/organization/:slug"
       afterCreateOrganizationUrl="/organization/:slug"
      />
    </div>
  )
}

export default OnboardingPage