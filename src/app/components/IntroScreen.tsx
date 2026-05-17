"use client";

type Props = { onStart: () => void };

export default function IntroScreen({ onStart }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        <div className="w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-stone-900/10 border border-stone-200 mb-8 sm:mb-12 bg-stone-100">
          <video
            src="/videos/hero-bird-nest.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight text-stone-900 mb-4 sm:mb-6">
          Nest Maker
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-8 sm:mb-12 max-w-xl">
          Build a bird&apos;s nest one decision at a time. Pick a frame, choose
          your binding, line it with something soft. At the end, AI weaves your
          choices into a finished nest.
        </p>
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-stone-900 text-stone-50 text-base font-medium hover:bg-amber-800 transition-colors shadow-lg shadow-stone-900/10"
        >
          Start making your nest
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
