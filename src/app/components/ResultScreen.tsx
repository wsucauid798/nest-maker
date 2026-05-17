"use client";

import { GenerateResponse, NestProfile } from "@/lib/types";
import { STAGES } from "@/lib/stages";
import { useState } from "react";

type Props = {
  result: GenerateResponse;
  selections: Record<string, string>;
  onReset: () => void;
};

const PROFILE_LABELS: Record<keyof NestProfile, string> = {
  coziness: "Coziness",
  durability: "Durability",
  camouflage: "Camouflage",
  craftsmanship: "Craftsmanship",
  charm: "Charm",
};

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(10, value)) * 10;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-stone-700">{label}</span>
        <span className="text-stone-500 font-mono">{value}/10</span>
      </div>
      <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-800 rounded-full transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultScreen({ result, selections, onReset }: Props) {
  const [showStats, setShowStats] = useState(true);

  return (
    <div className="flex-1 px-4 sm:px-6 py-8 sm:py-10 max-w-6xl w-full mx-auto">
      <div className="mb-6 sm:mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-3">
          Your finished nest
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-900 mb-3">
          {result.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-10">
        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden bg-stone-100 shadow-xl shadow-stone-900/10 border border-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${result.imageBase64}`}
              alt={result.name}
              className="w-full h-auto block"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-stone-200">
            <h3 className="text-xs uppercase tracking-[0.2em] text-amber-700 mb-3">
              Description
            </h3>
            <p className="text-stone-800 leading-relaxed text-sm sm:text-base">
              {result.description}
            </p>
          </div>

          <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-stone-200">
            <h3 className="text-xs uppercase tracking-[0.2em] text-amber-700 mb-4">
              Nest profile
            </h3>
            <div className="space-y-3">
              {(Object.keys(PROFILE_LABELS) as (keyof NestProfile)[]).map(
                (key) => (
                  <Bar
                    key={key}
                    label={PROFILE_LABELS[key]}
                    value={result.profile[key]}
                  />
                ),
              )}
            </div>
          </div>

          <div className="bg-white/70 rounded-2xl p-5 sm:p-6 border border-stone-200">
            <h3 className="text-xs uppercase tracking-[0.2em] text-amber-700 mb-3">
              Your choices
            </h3>
            <ul className="space-y-1.5">
              {STAGES.map((stage) => {
                const choice = stage.choices.find(
                  (c) => c.id === selections[stage.id],
                );
                return (
                  <li
                    key={stage.id}
                    className="flex justify-between gap-3 text-sm border-b border-stone-100 pb-1.5 last:border-0"
                  >
                    <span className="text-stone-500">{stage.name}</span>
                    <span className="text-stone-800 font-medium text-right">
                      {choice?.name ?? "?"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10">
        <button
          onClick={() => setShowStats((v) => !v)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-amber-400">
            AI stats {showStats ? "" : "(click to expand)"}
          </h3>
          <span className="text-stone-400 text-xl">
            {showStats ? "−" : "+"}
          </span>
        </button>
        {showStats && (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 font-mono text-xs sm:text-sm">
            <Stat label="Text model" value={result.stats.textModel} accent />
            <Stat label="Image model" value={result.stats.imageModel} accent />
            <Stat
              label="Text input tokens"
              value={result.stats.textInputTokens.toLocaleString()}
            />
            <Stat
              label="Text output tokens"
              value={result.stats.textOutputTokens.toLocaleString()}
            />
            <Stat
              label="Text total tokens"
              value={result.stats.textTotalTokens.toLocaleString()}
            />
            <Stat
              label="Text latency"
              value={`${result.stats.textLatencyMs} ms`}
            />
            <Stat
              label="Image input tokens"
              value={result.stats.imageInputTokens.toLocaleString()}
            />
            <Stat
              label="Image output tokens"
              value={result.stats.imageOutputTokens.toLocaleString()}
            />
            <Stat
              label="Image latency"
              value={`${result.stats.imageLatencyMs} ms`}
            />
            <Stat label="Image size" value={result.stats.imageSize} />
            <Stat
              label="Image mode"
              value={result.stats.imageMode}
              accent={result.stats.imageMode === "edit"}
            />
            <Stat
              label="Reference images"
              value={`${result.stats.referenceImagesUsed}`}
              accent={result.stats.referenceImagesUsed > 0}
            />
            <Stat
              label="Total latency"
              value={`${result.stats.totalLatencyMs} ms`}
            />
            <Stat
              label="Est. cost"
              value={`$${result.stats.estimatedCostUsd.toFixed(4)}`}
              accent
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onReset}
          className="px-6 sm:px-7 py-3 rounded-full bg-stone-900 text-stone-50 font-medium hover:bg-amber-800 transition-colors"
        >
          Build another nest →
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-400 mb-1">
        {label}
      </div>
      <div className={accent ? "text-amber-300" : "text-stone-50"}>{value}</div>
    </div>
  );
}
