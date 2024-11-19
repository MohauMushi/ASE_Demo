"use client";
import React from "react";
import { Volume2 } from "lucide-react";

const VoiceAssistantButton = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Volume2 className="w-5 h-5" />
      {isLoading ? "Initializing..." : "Read Instructions"}
    </button>
  );
};

export default VoiceAssistantButton;
