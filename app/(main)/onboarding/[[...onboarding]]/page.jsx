"use client"

import { OrganizationList, useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const OnboardingPage = () => {
  const { organization } = useOrganization()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading && organization) {
      router.replace(`/organization/${organization.slug}`)
    }
  }, [loading, organization, router])

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 text-white">
          Loading organization…
        </div>
      )}

      <div
        className="mt-10 lg:mt-0 min-h-screen flex justify-center pt-14"
        // onClickCapture={(e) => {
        //   console.log("descrip",e.target)
        //   if (e.target.closest("button")) {
        //     setLoading(true)
        //   }
        // }}
      >
        <OrganizationList
          hidePersonal
          afterSelectOrganizationUrl={()=> setLoading(true)}
          afterCreateOrganizationUrl="/organization/:slug"
          // onOrganizationSelect={() => {
          //   setLoading(true)
          // }}
        />
      </div>
    </>
  )
}

export default OnboardingPage
