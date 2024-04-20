"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TodoForm from "./todoForm";
import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import Link from 'next/link'
 

export default function Todo() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/todo");
      if (!response.ok) {
        setTodos([]);
        return;
      }
      const todo = await response.json();
      setTodos(todo);
    };
    fetchData();
  }, []);

  const deleteTodo = async (id) => {
    const response = await fetch(`/api/todo/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return;
    }
    const index = todos.findIndex((obj) => obj.id === id);
    if (index !== -1) {
      const newtodos = [...todos];
      newtodos.splice(index, 1);
      setTodos(newtodos);
    }
  };

  const updateStatus = async (status, id) => {
    const response = await fetch(`/api/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    });
    if (!response.ok) {
      return;
    }
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, status: status };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };


  return (
    <div className="w-full  md:w-3/4 md:text-base p-3">
      <TodoForm todos={todos} setTodos={setTodos} />
      <Table className="rounded-md border-border h-10 overflow-clip relative w-full" >
        <TableHeader>
          <TableRow>
            <TableHead><p className="text-xs md:text-base font-semibold">Status</p></TableHead>
            <TableHead className="w-1/3"><p className="text-xs md:text-base font-semibold">Title</p></TableHead>
            <TableHead className="w-1/3"><p className="text-xs md:text-base font-semibold">Description</p></TableHead>
            <TableHead className="text-right"><p className="text-xs md:text-base font-semibold">Delete</p></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo, index) => (
            <TableRow key={index} className="w-56">
              <TableCell>
                <Checkbox
                  className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:border-green-500 data-[state=checked]:text-green-500"
                  onCheckedChange={(e) => {
                    updateStatus(e, todo.id);
                  }}
                  checked={todo.status}
                />
              </TableCell>
              <TableCell
                className="cursor-pointer truncate max-w-0"
              >
                <Link href={`/todo/${todo.id}`}><p className="text-xs md:text-sm">{todo.title}</p></Link>

              </TableCell>
              <TableCell
                className="cursor-pointer w-6 truncate max-w-0"
              >
                <Link href={`/todo/${todo.id}`}><p className="text-xs md:text-sm">{todo.desc}</p></Link>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  className=" border-red-300 text-red-300 hover:text-red-500"
                  variant="ghost"
                  onClick={() => {
                    deleteTodo(todo.id);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
