// VoiceAssistant.jsx
"use client";
import React, { useEffect } from "react";
import VoiceAssistantButton from "./VoiceAssistantButton";
import VoiceControls from "./VoiceControls";
import Alert from "../Alert";
import { useVoiceAssistant } from "./useVoiceAssistant";

const VoiceAssistant = ({ instructions }) => {
  const {
    isReading,
    isPaused,
    currentStep,
    speechRate,
    error,
    setError,
    isInitializing,
    isListening,
    startReading,
    handlePause,
    handleResume,
    handleNextStep,
    handlePreviousStep,
    adjustSpeed,
    cleanup,
  } = useVoiceAssistant(instructions);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handleDismissError = () => {
    if (setError) {
      setError(null);
    }
  };

  // Ensure instructions array exists and has content
  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-11/12 max-w-2xl">
      {!isReading ? (
        <div className="space-y-4">
          <VoiceAssistantButton onClick={startReading} isLoading={isInitializing} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available voice commands: "next/previous step", "pause/resume", 
            "repeat", "stop", "faster/slower", "go to step [number]"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / instructions.length) * 100}%`,
              }}
            />
          </div>

          {/* Current Step Display */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 dark:text-white">
              Step {currentStep + 1} of {instructions.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {instructions[currentStep]}
            </p>
          </div>

          {/* Controls */}
          <VoiceControls
            isPaused={isPaused}
            onPause={handlePause}
            onResume={handleResume}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onStop={cleanup}
            speechRate={speechRate}
            onSpeedChange={adjustSpeed}
            currentStep={currentStep}
            totalSteps={instructions.length}
            isListening={isListening}
          />

          {/* Mobile helper text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
            Tip: Tap buttons or use voice commands to control playback
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          message={error}
          type="error"
          isVisible={!!error}
          onClose={handleDismissError}
          className="absolute bottom-full left-0 right-0 mb-4"
        />
      )}
    </div>
  );
};

export default VoiceAssistant;