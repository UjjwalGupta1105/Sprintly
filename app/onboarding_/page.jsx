import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await currentUser();

  // if (!user) {
  //   redirect("/sign-in");
  // }

  // if(user)redirect("/")
  return (
    <div>
      <h1>Welcome to Sprintly</h1>
      <p>Finish onboarding</p>
      {/* form / button goes here */}
    </div>
  );
}
