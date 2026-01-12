// app/HomeClient.jsx
"use client";
import { useEffect } from "react";
import  {checkUserAction}  from "@/app/actions/check-user";
import Home_ from "./Home";

export default function HomeClient({ user }) {
  useEffect(()=>{
    checkUserAction();
  })
  return <Home_ user={user} />;
}
