"use client";

import { Stage } from "@/lib/stages";
import { useState } from "react";

type Props = {
  stage: Stage;
  stageIndex: number;
  totalStages: number;
  selectedChoiceId: string | undefined;
  onSelect: (choiceId: string) => void;
  onBack: () => void;
  onNext: () => void;
  isLastStage: boolean;
};

export default function StageScreen({
  stage,
  stageIndex,
  totalStages,
  selectedChoiceId,
  onSelect,
  onBack,
  onNext,
  isLastStage,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const previewId =
    hoveredId ?? selectedChoiceId ?? stage.choices[0]?.id ?? "";
  const previewChoice =
    stage.choices.find((c) => c.id === previewId) ?? stage.choices[0];

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 sm:py-10 max-w-6xl w-full mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs uppercase tracking-[0.2em] text-amber-700">
            Stage {stageIndex + 1} of {totalStages}
          </span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>
        <div className="flex gap-1.5 mb-5 sm:mb-6">
          {Array.from({ length: totalStages }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= stageIndex ? "bg-amber-700" : "bg-stone-300"
              }`}
            />
          ))}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-stone-900 mb-2">
          {stage.name}
        </h2>
        <p className="text-amber-800 italic mb-2 sm:mb-3 text-sm sm:text-base">
          {stage.subtitle}
        </p>
        <p className="text-stone-600 max-w-2xl text-sm sm:text-base">
          {stage.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8 mb-8">
        <div className="lg:col-span-3 lg:order-2">
          <div className="sticky top-6">
            <PreviewPane
              key={previewChoice?.id}
              src={previewChoice?.imageSrc}
              name={previewChoice?.name}
              caption={previewChoice?.description}
            />
          </div>
        </div>

        <div
          className="lg:col-span-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4"
          onMouseLeave={() => setHoveredId(null)}
        >
          {stage.choices.map((choice) => {
            const selected = choice.id === selectedChoiceId;
            return (
              <button
                key={choice.id}
                onClick={() => onSelect(choice.id)}
                onMouseEnter={() => setHoveredId(choice.id)}
                onFocus={() => setHoveredId(choice.id)}
                className={`group text-left p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                  selected
                    ? "border-amber-700 bg-amber-50 shadow-lg shadow-amber-900/10"
                    : "border-stone-200 bg-white/60 hover:border-stone-400 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-lg sm:text-xl font-medium text-stone-900">
                    {choice.name}
                  </h3>
                  <div
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                      selected
                        ? "border-amber-700 bg-amber-700"
                        : "border-stone-300"
                    }`}
                  >
                    {selected && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="white"
                        className="w-full h-full p-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-sm text-stone-600">{choice.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-5 sm:pt-6 border-t border-stone-200">
        <button
          onClick={onBack}
          className="px-4 sm:px-5 py-2.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedChoiceId}
          className="px-5 sm:px-7 py-2.5 rounded-full bg-stone-900 text-stone-50 font-medium hover:bg-amber-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
        >
          {isLastStage ? "Build the nest" : "Next"} →
        </button>
      </div>
    </div>
  );
}

function PreviewPane({
  src,
  name,
  caption,
}: {
  src?: string;
  name?: string;
  caption?: string;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <figure className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-lg shadow-stone-900/5">
      <div className="aspect-square sm:aspect-[4/3] lg:aspect-square w-full bg-stone-100 flex items-center justify-center relative">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name ?? ""}
            className="w-full h-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="text-center p-8 text-stone-400">
            <div className="text-5xl mb-3" aria-hidden>
              ◯
            </div>
            <p className="text-sm">Image placeholder</p>
            <p className="text-xs mt-1 font-mono text-stone-400 break-all">
              {src}
            </p>
          </div>
        )}
      </div>
      <figcaption className="px-4 sm:px-5 py-3 bg-white/70 border-t border-stone-200">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700 mb-0.5">
          Preview
        </p>
        <p className="text-stone-800 font-medium">{name}</p>
        <p className="text-xs text-stone-500 mt-0.5">{caption}</p>
      </figcaption>
    </figure>
  );
}
