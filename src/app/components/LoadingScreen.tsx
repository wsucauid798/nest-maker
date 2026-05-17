"use client";

export default function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center max-w-md">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
          <div className="absolute inset-0 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-3">
          Building your nest
        </h2>
        <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
          Hold on while your materials are arranged into a finished nest. Almost there.
        </p>
      </div>
    </div>
  );
}
