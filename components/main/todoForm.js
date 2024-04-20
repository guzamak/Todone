import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide  } from "react-toastify";

export default function TodoForm({ todos, setTodos }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createTodo = async () => {
    if (title == "" || description == "") {
      toast.error("Please fill title & description");
      console.log("df");
      return;
    }
    const response = await fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, description: description }),
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setTodos([...todos, data]);
  };
  return (
    <Popover className="mb-7">
      <PopoverTrigger asChild>
        <Button variant="outline">+</Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="space-y-5 w-screen max-w-80 p-3">
        <div>
          <h1 className="mb-3 text-sm md:text-base">Title</h1>
          <Input
            type="email"
            placeholder="Title"
            className="focus-visible:ring-0 text-xs md:text-sm" 
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <h1 className="mb-3 text-sm md:text-base">Desc</h1>
          <Textarea
            placeholder="Type your description here."
            className="focus-visible:ring-0 text-xs md:text-sm"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <Button variant="ghost" onClick={createTodo}>
          create
        </Button>
      </PopoverContent>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </Popover>
  );
}
