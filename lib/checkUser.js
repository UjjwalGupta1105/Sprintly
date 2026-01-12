import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function checkUser() {
  const user = await currentUser();
  console.log("DATABASE_URL in checkUser:", process.env.DATABASE_URL);

  if (!user) return null;

  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (loggedInUser) return loggedInUser;

  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`;

  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  // redirect("/");
  return newUser;
}
