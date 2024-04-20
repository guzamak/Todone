"use client";
import Login from "./login";
import Todo from "./todo";
export default function dashboard({ session }) {
  return <div>{session ? <Todo /> : <Login />}</div>;
}
