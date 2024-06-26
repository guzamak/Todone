"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
      <Button
        variant="outline"
        onClick={async() => {
          await signIn("google");
        }}
      >
        Google
      </Button>
  );
}
