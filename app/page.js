"use server";
import Todo from "@/components/main/todo";
import Hero from "@/components/main/hero";
import Login from "@/components/main/login";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className="w-screen min-h-screen">
      <div>
      <div className="w-full h-[30vh] flex justify-center items-center">
      <h1 className="text-5xl font-bold">Tod</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="mx-2">
            <AvatarImage src={session?.user.image} />
            <AvatarFallback>
              <Skeleton className="h-full w-full" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {session?.user && (
          <DropdownMenuContent className="w-52">
            <Hero />
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      <h1 className="text-5xl font-bold">ne</h1>
    </div>
      </div>
      <div className="w-full flex items-center justify-center">
        {session?.user ? <Todo /> : <Login />}
       </div>
    </div>
  );
}
