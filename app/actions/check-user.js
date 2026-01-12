"use server";
// export const runtime = "nodejs";

import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";


export async function checkUserAction() {
   const dbUser=await checkUser();

   if (!dbUser) {
    // redirect("/sign-in");
    return null;
  }

  if (dbUser.onboarded) {
    redirect("/");
  }
}


// import { db } from "@/lib/prisma";

// export async function checkUserAction() {
//   return await db.user.findFirst();
// }
