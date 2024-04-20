"use server";
import Todo from "@/components/main/todo";
import Hero from "@/components/main/hero";
import Login from "@/components/main/login";
import Dashboard from "@/components/main/dashboard";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className="w-screen min-h-screen">
      <div>
        <Hero session={session} />
      </div>
      <div className="w-full flex items-center justify-center">
        <Dashboard session={session}/>
       </div>
    </div>
  );
}
