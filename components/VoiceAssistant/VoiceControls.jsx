"use client";
import React from "react";
import {
  FastForward,
  Rewind,
  Play,
  Pause,
  VolumeX,
  Volume1,
  Volume2,
  Mic
} from "lucide-react";

const VoiceControls = ({
  isPaused,
  onPause,
  onResume,
  onPrevious,
  onNext,
  onStop,
  speechRate,
  onSpeedChange,
  currentStep,
  totalSteps,
  isListening,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Speed: {speechRate}x</span>
          <button
            onClick={() => onSpeedChange(false)}
            disabled={speechRate <= 0.5}
            className="flex items-center gap-1 text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Volume1 className="w-4 h-4" /> Slower
          </button>
          <button
            onClick={() => onSpeedChange(true)}
            disabled={speechRate >= 2}
            className="flex items-center gap-1 text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Volume2 className="w-4 h-4" /> Faster
          </button>
        </div>
        <div className={`flex items-center gap-2 ${isListening ? 'text-green-500' : 'text-gray-500'}`}>
          <Mic className="w-4 h-4" />
          <span className="text-sm">{isListening ? 'Listening...' : 'Voice Commands'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous step"
          >
            <Rewind className="w-5 h-5" />
          </button>

          {isPaused ? (
            <button
              onClick={onResume}
              className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              aria-label="Resume"
            >
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onPause}
              className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              aria-label="Pause"
            >
              <Pause className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next step"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onStop}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          aria-label="Stop reading"
        >
          <VolumeX className="w-5 h-5" />
          Stop
        </button>
      </div>
    </div>
  );
};

export default VoiceControls;