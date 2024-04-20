import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import serverAuth from "@/lib/serverAuth";

export async function GET(req) {
  try {
    const { currentUser } = await serverAuth();
    const todos = await prisma.todo.findMany({
        where:{
          userId:currentUser.id
        }
      })
      return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function POST(req) {
    try {
      const { currentUser } = await serverAuth();
      const { title, description } = await req.json();

      const newTodo = await prisma.todo.create({
        data: {
            title:title,
            desc:description,
            userId: currentUser.id,
          }
        })
      return NextResponse.json(newTodo)
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
  