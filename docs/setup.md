# Setup

## Install

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and paste your OpenAI API key into `OPENAI_API_KEY`. Never commit this file.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Var | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | Your OpenAI key. Server-side only, never shipped to the browser. |
| `OPENAI_TEXT_MODEL` | no | Model that writes the description and image prompt. |
| `OPENAI_IMAGE_MODEL` | no | Image generation model. |
| `OPENAI_IMAGE_SIZE` | no | One of `1024x1024`, `1024x1536`, `1536x1024`, `auto`. |

Defaults for the optional vars live in [src/app/api/generate-nest/route.ts](../src/app/api/generate-nest/route.ts).
