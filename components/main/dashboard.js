"use client";
import Login from "./login";
import Todo from "./todo";
export default function Dashboard({ session }) {
  return <>{session?.user ? <Todo /> : <Login />}</>;
}
