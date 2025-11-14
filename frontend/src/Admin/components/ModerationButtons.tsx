"use client";
import React from "react";

interface ModerationProps {
  itemId: string;
  contentType: string;
  onAction: (id: string, action: "approve" | "reject") => void;
}

const ModerationButtons: React.FC<ModerationProps> = ({ itemId, contentType, onAction }) => {
  const handleAction = (action: "approve" | "reject") => {
    console.log(`[ACTION] ${action.toUpperCase()} ${contentType} ID: ${itemId}`);
    onAction(itemId, action);
  };

  return (
    <div className="flex space-x-3 mt-3">
      <button
        onClick={() => handleAction("approve")}
        className="text-xs font-medium text-white bg-green-600 px-3 py-1 rounded-full"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("reject")}
        className="text-xs font-medium text-white bg-red-600 px-3 py-1 rounded-full"
      >
        Reject
      </button>
    </div>
  );
};

export default ModerationButtons;
