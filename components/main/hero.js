"use client"
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
import { Skeleton } from "@/components/ui/skeleton" 
import { signOut } from "next-auth/react";

export default function Hero({ session }) {
  return (
    <div className="w-full h-[30vh] flex justify-center items-center">
      <h1 className="text-5xl font-bold">Tod</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="mx-2">
            <AvatarImage src={session?.user.image} />
            <AvatarFallback><Skeleton className="h-full w-full" /></AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <h1 className="text-5xl font-bold">ne</h1>
    </div>
  );
}
