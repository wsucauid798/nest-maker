"use client";

import { useState } from "react";
import { STAGES } from "@/lib/stages";
import { GenerateResponse, Selections } from "@/lib/types";
import IntroScreen from "./components/IntroScreen";
import StageScreen from "./components/StageScreen";
import LoadingScreen from "./components/LoadingScreen";
import ResultScreen from "./components/ResultScreen";

type Phase = "intro" | "stage" | "loading" | "result" | "error";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stageIndex, setStageIndex] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const currentStage = STAGES[stageIndex];

  function handleStart() {
    setStageIndex(0);
    setSelections({});
    setResult(null);
    setPhase("stage");
  }

  function handleSelect(choiceId: string) {
    setSelections((prev) => ({ ...prev, [currentStage.id]: choiceId }));
  }

  function handleBack() {
    if (stageIndex === 0) {
      setPhase("intro");
    } else {
      setStageIndex((i) => i - 1);
    }
  }

  async function handleNext() {
    if (stageIndex < STAGES.length - 1) {
      setStageIndex((i) => i + 1);
      return;
    }
    setPhase("loading");
    try {
      const res = await fetch("/api/generate-nest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selections }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }
      const data: GenerateResponse = await res.json();
      setResult(data);
      setPhase("result");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setPhase("error");
    }
  }

  if (phase === "intro") {
    return <IntroScreen onStart={handleStart} />;
  }
  if (phase === "loading") {
    return <LoadingScreen />;
  }
  if (phase === "result" && result) {
    return (
      <ResultScreen
        result={result}
        selections={selections}
        onReset={handleStart}
      />
    );
  }
  if (phase === "error") {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-serif text-stone-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-stone-600 mb-2">
            The AI couldn&apos;t finish building your nest.
          </p>
          <pre className="text-xs text-left bg-stone-100 p-4 rounded-lg overflow-auto mb-6 max-h-48">
            {errorMessage}
          </pre>
          <button
            onClick={() => setPhase("stage")}
            className="px-6 py-2.5 rounded-full bg-stone-900 text-stone-50 hover:bg-amber-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <StageScreen
      stage={currentStage}
      stageIndex={stageIndex}
      totalStages={STAGES.length}
      selectedChoiceId={selections[currentStage.id]}
      onSelect={handleSelect}
      onBack={handleBack}
      onNext={handleNext}
      isLastStage={stageIndex === STAGES.length - 1}
    />
  );
}
