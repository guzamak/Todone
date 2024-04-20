import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import serverAuth from "@/lib/serverAuth";

export async function GET(req, context) {
  try {
    const { currentUser } = await serverAuth();
    const { todoId } = context.params;
    const todo = await prisma.todo.findUnique({
      where: {
        id: todoId,
        userId: currentUser.id,
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { currentUser } = await serverAuth();
    const { todoId } = context.params;
    const data = await req.json();
    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId,
        userId: currentUser.id,
      },
      data: {
       ...data
      },
    });
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { currentUser } = await serverAuth();
    const { todoId } = context.params;
    console.log(todoId);
    await prisma.todo.delete({
      where: {
        id: todoId,
        userId: currentUser.id,
      },
    });
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
