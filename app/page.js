// app/page.js
// import { checkUser } from "@/lib/checkUser";
import HomeClient from "./components/HomeClient";

export const runtime = "nodejs";


export default async function Page() {
  // const user = await checkUser(); 

  return <HomeClient />;
  // return <HomeClient user={user} />;

}
