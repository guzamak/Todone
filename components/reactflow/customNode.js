import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";

function CustomNode({ data }) {
  return (
    <div
      className={cn(
        "px-5 py-3 shadow-md rounded-md bg-white border-[1px] border-stone-400",
        data.isFinished && "bg-green-100 border-emerald-400"
      )}
    >
      <div className="flex">
        <div className="ml-2">
          <div className="text-gray-500 text-xs">{data.label}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gray-300 !border-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gray-300 !border-none"
      />
    </div>
  );
}

export default memo(CustomNode);
