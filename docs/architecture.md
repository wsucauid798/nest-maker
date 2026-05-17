# Architecture

## Project layout

```
src/
  app/
    page.tsx                    single-page shell, drives intro through result
    layout.tsx                  root layout and fonts
    globals.css                 Tailwind import, font tokens, body gradient
    components/
      IntroScreen.tsx
      StageScreen.tsx
      LoadingScreen.tsx
      ResultScreen.tsx
    api/generate-nest/route.ts  OpenAI text + image, returns description, image, stats
  lib/
    stages.ts                   the 5 stages and their material choices
    types.ts                    shared API types
public/
  videos/hero-bird-nest.mp4     intro video, played on loop
  images/choices/<id>.png       reference photo for each choice, used by the AI
```

## Client flow

`src/app/page.tsx` is a single client component that drives four phases through internal state: `intro`, `stage`, `loading`, `result`. State held across phases:

- `phase`, the current screen
- `stageIndex`, 0 to 4
- `selections`, a map from stage id to chosen choice id
- `result`, the response from the API

There is no router. Browser navigation is not used. Refresh resets the app.

## AI flow

1. The user picks one choice per stage. Selections live in client state.
2. On "Build the nest", the client POSTs `{ selections }` to `/api/generate-nest`.
3. The server reads the selected choices' PNGs from `public/images/choices/`.
4. It calls the text model with a multimodal message: a system prompt plus a user message containing the materials list and each reference image attached with a label. The model returns JSON with `name`, `description`, `imagePrompt`, and a `profile` of 5 integer stats.
5. If any reference images were loaded, the server calls `images.edit` with those images plus the imagePrompt. Otherwise it calls `images.generate` with just the prompt. The result screen surfaces which path ran (`edit` or `generate`) and how many references were used.
6. Both calls' token counts, latencies, and a rough cost estimate are bundled into a stats block returned to the client.

## Static assets

Next.js 16 serves runtime static assets from `public/`. The intro video and choice reference images live there. `src/` is only for module imports.

## Cost notes

Each generation runs roughly one image plus a few hundred text tokens. Reference images add a small amount of image-input cost on the image step. The estimate shown on the result screen is computed from token counts and per-million rates hardcoded in the route. Real billing comes from your OpenAI dashboard.
