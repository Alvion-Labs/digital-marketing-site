/**
 * Main block editor with drag-and-drop reordering
 */

"use client";

import React, { useState } from "react";
import { AnyBlock, BlockType, createEmptyBlock, generateBlockId } from "@/lib/blocks";
import { BlockEditor } from "./BlockEditors";

interface BlockEditorProps {
  value: AnyBlock[];
  onChange: (blocks: AnyBlock[]) => void;
}

export const BlockContentEditor: React.FC<BlockEditorProps> = ({
  value,
  onChange,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const addBlock = (type: BlockType, afterIndex: number = -1) => {
    const newBlock = createEmptyBlock(type);
    const newBlocks = [...value];
    if (afterIndex === -1) {
      newBlocks.push(newBlock);
    } else {
      newBlocks.splice(afterIndex + 1, 0, newBlock);
    }
    onChange(newBlocks);
  };

  const removeBlock = (id: string) => {
    onChange(value.filter((block) => block.id !== id));
  };

  const updateBlock = (id: string, updatedBlock: AnyBlock) => {
    onChange(
      value.map((block) => (block.id === id ? updatedBlock : block))
    );
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;
    const newBlocks = [...value];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onChange(newBlocks);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedId === null) return;

    const draggedIndex = value.findIndex((block) => block.id === draggedId);
    if (draggedIndex !== -1) {
      moveBlock(draggedIndex, dropIndex);
    }
    setDraggedId(null);
  };

  const blockTypeIcons: Record<BlockType, string> = {
    paragraph: "¶",
    heading: "H",
    image: "🖼",
    quote: '"',
    cta: "→",
    list: "≡",
    divider: "—",
  };

  const blockTypeLabels: Record<BlockType, string> = {
    paragraph: "Paragraph",
    heading: "Heading",
    image: "Image",
    quote: "Quote",
    cta: "Call-to-Action",
    list: "List",
    divider: "Divider",
  };

  const blockTypes: BlockType[] = [
    "paragraph",
    "heading",
    "image",
    "quote",
    "cta",
    "list",
    "divider",
  ];

  return (
    <div className="space-y-4">
      {/* Quick add buttons */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 sticky top-0 z-10">
        <p className="text-xs font-semibold text-gray-600 mb-2">ADD BLOCK</p>
        <div className="grid grid-cols-4 gap-2">
          {blockTypes.map((type) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
              title={`Add ${blockTypeLabels[type]}`}
            >
              <span className="text-sm">{blockTypeIcons[type]}</span>
              <span className="hidden sm:inline">{blockTypeLabels[type].split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Blocks list */}
      <div className="space-y-3">
        {value.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">
              No blocks yet. Add one using the buttons above to start creating!
            </p>
          </div>
        ) : (
          value.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`space-y-2 p-3 rounded-lg border-2 transition ${
                draggedId === block.id
                  ? "opacity-50 border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Block header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="cursor-move text-gray-400 text-lg">☰</span>
                  <span className="text-sm font-medium text-gray-600">
                    {blockTypeIcons[block.type]} {blockTypeLabels[block.type]}
                  </span>
                  {block.type === "paragraph" && block.data.text && (
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                      {block.data.text.substring(0, 40)}
                      {block.data.text.length > 40 ? "..." : ""}
                    </span>
                  )}
                  {block.type === "heading" && block.data.text && (
                    <span className="text-xs text-gray-500 truncate max-w-xs font-semibold">
                      {block.data.text}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => moveBlock(index, index - 1)}
                      className="p-1 text-gray-400 hover:text-gray-600 text-sm"
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  {index < value.length - 1 && (
                    <button
                      onClick={() => moveBlock(index, index + 1)}
                      className="p-1 text-gray-400 hover:text-gray-600 text-sm"
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-1 text-red-400 hover:text-red-600 text-sm"
                    title="Delete block"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Block editor */}
              <BlockEditor
                block={block}
                onChange={(updatedBlock) => updateBlock(block.id, updatedBlock)}
              />

              {/* Add block below */}
              <div className="flex gap-1 pt-2">
                <button
                  onClick={() => addBlock("paragraph", index)}
                  className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition"
                >
                  + Add Below
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
