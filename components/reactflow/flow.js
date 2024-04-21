"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  ControlButton,
} from "reactflow";
import "reactflow/dist/style.css";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import CustomNode from "./customNode";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";

export default function Flow() {
  const nodeTypes = useRef({ custom: CustomNode });
  const edgeUpdateSuccessful = useRef(true);
  const menubarRef = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [editValue, setEditValue] = useState(nodes.data);
  const [nodeId, setNodeId] = useState();
  const [edgeId, setEdgeId] = useState();
  const { todoId } = useParams();
  const [todo, setTodo] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMenu, setIsMenu] = useState(false);

  const onNodeClick = (e, vol) => {
    setEditValue({label:vol.data.label, isFinished: vol.data.isFinished});
    setNodeId(vol.id);
    setEdgeId();
  };

  const onEdgeClick = (e, vol) => {
    setEdgeId(vol.id);
    setNodeId();
  };

  const handleLabelChange = (e) => {
    e.preventDefault();
    const newvalue = {
      ...editValue,
      label: e.target.value,
    }
    setEditValue(newvalue);
  };

  
  const handleIsFinChange = (e) => {
    const newvalue = {
      ...editValue,
      isFinished: e,
    }
    setEditValue(newvalue);
  };


  useEffect(()=>{
    if (!nodeId) {
      return;
    }
    const res = nodes.map((item) => {
      if (item.id == nodeId) {
        item.data = {
          ...item.data,
          label: editValue.label,
          isFinished:editValue.isFinished,
        };
      }
      return item;
    });
    setNodes(res);
  },[editValue])

  const handleDel = () => {
    if (!nodeId && !edgeId) {
      return;
    }
    if (nodeId) {
      const res = nodes.filter((item) => item.id != nodeId);
      setNodes(res);
    }
    if (edgeId) {
      const res = edges.filter((item) => item.id != edgeId);
      console.log(res);
      setEdges(res);
    }
  };

  const toggleMenu = () => {
    setIsMenu(!isMenu);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/todo/${todoId}`);
      if (!response.ok) {
        return;
      }
      const todo = await response.json();
      setTodo(todo);
    };
    fetchData();
  }, []);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      setTitle(todo.title);
      setDescription(todo.desc);
      const flow = todo.howtoObj;
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        reactFlowInstance.setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setEdges, todo, reactFlowInstance]);

  useEffect(() => {
    onRestore();
  }, [todo, onRestore]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [edgeUpdateSuccessful, setEdges]
  );

  const onEdgeUpdateEnd = useCallback(
    (_, edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    },
    [edgeUpdateSuccessful, setEdges]
  );

  const onSave = useCallback(async () => {
    if (title == "" || description == "") {
      toast.error("Please fill title & description");
      return;
    }
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const response = await fetch(`/api/todo/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          desc: description,
          howtoObj: flow,
        }),
      });
      if (!response.ok) {
        return;
      }
      toast.success("Save completed!");
    }
  }, [reactFlowInstance, todoId, title, description]);

  const onAdd = useCallback(() => {
    const newId = `${nodes.length + 1}`;
    let x = 250;
    let y = 5;

    if (nodes.length != 0) {
      x = nodes[nodes.length - 1].position.x;
      y = nodes[nodes.length - 1].position.y + 100;
    }
    const newNode = {
      id: newId,
      data: { label: "Added node", isFinished: false },
      type: "custom",
      position: {
        x: x,
        y: y,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, nodes]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div
        className={cn(
          "flex flex-col p-10 space-y-6 border-2 w-3/4 transition-all duration-200 overflow-auto",
          !isMenu && "w-0 scale-0 p-0"
        )}
        ref={menubarRef}
      >
        <div>
          <h1 className="mb-3 text-sm md:text-base font-semibold">Title</h1>
          <Input
            type="email"
            placeholder="Title"
            className="focus-visible:ring-0 text-xs md:text-sm"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            defaultValue={todo.title}
          />
        </div>
        <div>
          <h1 className="mb-3 text-sm md:text-base font-semibold">Desc</h1>
          <Textarea
            placeholder="Type your description here."
            className="focus-visible:ring-0 text-xs md:text-sm"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            defaultValue={todo.desc}
          />
        </div>
        <Button
          onClick={onSave}
          variant="outline"
          className="text-sm md:text-base font-extralight max-w-48"
        >
          Save
        </Button>
        <Button
          onClick={onAdd}
          variant="outline"
          className="text-sm md:text-base font-extralight max-w-48"
        >
          Add new node
        </Button>
        <h1 className="text-sm md:text-base font-semibold">Node label</h1>
        <Input
          placeholder="Your nodes label"
          onChange={handleLabelChange}
          defaultValue={editValue?.label}
          className="focus-visible:ring-0 text-xs md:text-sm"
        />
        <div className="flex items-center space-x-2">
          <Checkbox checked={editValue?.isFinished} onCheckedChange={handleIsFinChange}/>
          <label className="text-xs md:text-sm">
          Is finished
          </label>
        </div>
        <Button
          onClick={handleDel}
          variant="outline"
          className="border-red-300 text-red-300 hover:text-red-500 font-extralight max-w-48"
        >
          Delete node and edge
        </Button>
      </div>
      <div className="h-full flex-grow">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            minZoom={0.5}
            maxZoom={4}
            onNodeClick={(e, val) => onNodeClick(e, val)}
            onEdgeClick={(e, val) => onEdgeClick(e, val)}
            nodeTypes={nodeTypes.current}
          >
            <MiniMap />
            <Background />
            <Controls>
              <ControlButton onClick={toggleMenu}>
                <Menu />
              </ControlButton>
            </Controls>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
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
    </div>
  );
}
