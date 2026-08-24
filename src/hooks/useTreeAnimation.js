import { useState, useEffect, useCallback, useRef } from 'react';

export function useTreeAnimation(steps = []) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // milliseconds per step
  const timerRef = useRef(null);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || null;
  const isAtEnd = totalSteps > 0 && currentStepIndex === totalSteps - 1;
  const isAtStart = currentStepIndex === 0;

  // Reset to first step when steps array changes
  useEffect(() => {
    setCurrentStepIndex(steps.length > 0 ? steps.length - 1 : 0); // default to final completed tree
    setIsPlaying(false);
  }, [steps]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const jumpToEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, totalSteps - 1));
  }, [totalSteps]);

  const jumpToStep = useCallback((index) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
    }
  }, [totalSteps]);

  const togglePlay = useCallback(() => {
    if (isAtEnd) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [isAtEnd]);

  // Autoplay ticker
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, totalSteps]);

  return {
    currentStepIndex,
    totalSteps,
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    isAtStart,
    isAtEnd,
    nextStep,
    prevStep,
    reset,
    jumpToEnd,
    jumpToStep,
    togglePlay
  };
}
