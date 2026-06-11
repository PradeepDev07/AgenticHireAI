"use client";

import "@xyflow/react/dist/style.css";
import { Background, Controls, ReactFlow } from "@xyflow/react";

const stateColors = {
  running: "#2563eb",
  success: "#16a34a",
  failed: "#dc2626",
  waiting_approval: "#ca8a04",
  pending: "#94a3b8"
};

export function WorkflowGraph({ workflow }) {
  const graph = workflow?.graph || [];
  const nodes = graph.map((step, index) => ({
    id: step.name,
    position: { x: index * 230, y: index % 2 ? 120 : 20 },
    data: { label: `${step.name.replaceAll("_", " ")}\n${step.status}` },
    style: {
      border: `2px solid ${stateColors[step.status] || "#94a3b8"}`,
      borderRadius: 8,
      padding: 10,
      width: 180,
      background: "#fff"
    }
  }));
  const edges = graph.slice(1).map((step, index) => ({
    id: `${graph[index].name}-${step.name}`,
    source: graph[index].name,
    target: step.name,
    animated: step.status === "running"
  }));

  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-border bg-white">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
