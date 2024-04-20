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
import CustomNode from "./customNode";
import { Menu } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide  } from "react-toastify";


export default function Flow()  {
  const nodeTypes = useRef({custom: CustomNode})
  const edgeUpdateSuccessful = useRef(true);
  const menubarRef = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isMenu, setIsMenu] = useState(false)

  const toggleMenu = () => {
    setIsMenu(!isMenu)
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, [edgeUpdateSuccessful,setEdges]);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, [edgeUpdateSuccessful,setEdges]);

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
  }, [setNodes, setEdges, reactFlowInstance]);

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
      data: { label: "Added node" },
      type: "custom",
      position: {
        x: x,
        y: y,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes,nodes]);

  return (
    <>
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
              <ControlButton
                onClick={toggleMenu}
              >
                <Menu />
              </ControlButton>
            </Controls>
          </ReactFlow>
        </ReactFlowProvider>
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
    </>
  );
};
