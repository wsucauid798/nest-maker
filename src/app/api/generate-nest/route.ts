import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { STAGES } from "@/lib/stages";
import {
  AiStats,
  GenerateResponse,
  NestProfile,
  Selections,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL ?? "gpt-5.4-mini";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2";
const IMAGE_SIZE = (process.env.OPENAI_IMAGE_SIZE ?? "1024x1024") as
  | "1024x1024"
  | "1024x1536"
  | "1536x1024"
  | "auto";

const TEXT_INPUT_PER_M = 0.15;
const TEXT_OUTPUT_PER_M = 0.6;
const IMAGE_INPUT_TEXT_PER_M = 5;
const IMAGE_INPUT_IMAGE_PER_M = 10;
const IMAGE_OUTPUT_PER_M = 40;

type TextResponse = {
  name: string;
  description: string;
  imagePrompt: string;
  profile: NestProfile;
};

type Reference = {
  stageName: string;
  choiceName: string;
  choiceId: string;
  prompt: string;
  buffer: Buffer | null;
};

async function loadReferences(selections: Selections): Promise<Reference[]> {
  const refs: Reference[] = [];
  for (const stage of STAGES) {
    const choiceId = selections[stage.id];
    const choice = stage.choices.find((c) => c.id === choiceId);
    if (!choice) continue;
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "choices",
      `${choice.id}.png`,
    );
    let buffer: Buffer | null = null;
    try {
      buffer = await fs.readFile(filePath);
    } catch {
      buffer = null;
    }
    refs.push({
      stageName: stage.name,
      choiceName: choice.name,
      choiceId: choice.id,
      prompt: choice.prompt,
      buffer,
    });
  }
  return refs;
}

function materialsList(refs: Reference[]): string {
  return refs.map((r) => `- ${r.stageName}: ${r.choiceName}. ${r.prompt}`).join("\n");
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set in .env.local" },
      { status: 500 },
    );
  }

  let selections: Selections;
  try {
    const body = await req.json();
    selections = body.selections;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const missing = STAGES.filter((s) => !selections?.[s.id]);
  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Missing selections for: ${missing.map((s) => s.name).join(", ")}`,
      },
      { status: 400 },
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const totalStart = Date.now();

  const refs = await loadReferences(selections);
  const withImages = refs.filter((r) => r.buffer);
  const referenceImagesUsed = withImages.length;

  const systemPrompt = [
    "You are a nature illustrator and ornithologist who composes finished bird's nests from a list of chosen materials.",
    "",
    referenceImagesUsed > 0
      ? "The user attached reference photographs of the actual materials they chose. Study each one carefully, then describe a finished nest that visibly incorporates those exact textures, colours, and forms. Do not substitute lookalikes."
      : "Compose the finished nest purely from the textual descriptions below.",
    "",
    "Return a single JSON object with this exact shape:",
    "{",
    '  "name": string,           // a short poetic 2-4 word name for this specific nest',
    '  "description": string,    // 3-4 vivid prose sentences describing how the materials combine into the finished nest',
    '  "imagePrompt": string,    // a detailed prompt for a text-to-image model. Describe a single empty bird\'s nest (no eggs, no bird) viewed from a low three-quarter angle in soft natural daylight, photoreal nature-documentary style on a neutral mossy or wooden background. Weave together every material, naming the colours, textures, layering, and how the outer dressing wraps the inner cradle. 80-120 words.',
    '  "profile": {              // integers 1-10, judged from the materials chosen',
    '     "coziness": number,    // softer linings score higher',
    '     "durability": number,  // tougher structure and binding score higher',
    '     "camouflage": number,  // denser or more natural outer dressing scores higher',
    '     "craftsmanship": number,// neater fibres and finer binding score higher',
    '     "charm": number        // overall aesthetic quirk',
    "  }",
    "}",
    "",
    "Do not invent materials the user did not choose. Do not add eggs, chicks, or adult birds.",
  ].join("\n");

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: `Materials chosen for this nest:\n${materialsList(refs)}`,
    },
  ];
  for (const r of refs) {
    if (!r.buffer) continue;
    const dataUrl = `data:image/png;base64,${r.buffer.toString("base64")}`;
    userContent.push({
      type: "text",
      text: `Reference for ${r.stageName} (${r.choiceName}):`,
    });
    userContent.push({
      type: "image_url",
      image_url: { url: dataUrl },
    });
  }

  let textPayload: TextResponse;
  let textInputTokens = 0;
  let textOutputTokens = 0;
  let textTotalTokens = 0;
  const textStart = Date.now();
  try {
    const completion = await openai.chat.completions.create({
      model: TEXT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty completion content");
    textPayload = JSON.parse(raw) as TextResponse;
    textInputTokens = completion.usage?.prompt_tokens ?? 0;
    textOutputTokens = completion.usage?.completion_tokens ?? 0;
    textTotalTokens = completion.usage?.total_tokens ?? 0;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Text step failed: ${msg}` },
      { status: 502 },
    );
  }
  const textLatencyMs = Date.now() - textStart;

  let imageBase64: string;
  let imageInputTokens = 0;
  let imageInputTextTokens = 0;
  let imageInputImageTokens = 0;
  let imageOutputTokens = 0;
  const imageMode: "generate" | "edit" =
    referenceImagesUsed > 0 ? "edit" : "generate";
  const imageStart = Date.now();
  try {
    let img: OpenAI.Images.ImagesResponse;
    if (imageMode === "edit") {
      const uploadables = await Promise.all(
        withImages.map((r) =>
          toFile(r.buffer as Buffer, `${r.choiceId}.png`, {
            type: "image/png",
          }),
        ),
      );
      img = await openai.images.edit({
        model: IMAGE_MODEL,
        image: uploadables,
        prompt: textPayload.imagePrompt,
        size: IMAGE_SIZE,
      });
    } else {
      img = await openai.images.generate({
        model: IMAGE_MODEL,
        prompt: textPayload.imagePrompt,
        size: IMAGE_SIZE,
        n: 1,
      });
    }
    const b64 = img.data?.[0]?.b64_json;
    if (!b64) throw new Error("Image API returned no b64_json");
    imageBase64 = b64;
    imageInputTokens = img.usage?.input_tokens ?? 0;
    imageInputTextTokens = img.usage?.input_tokens_details?.text_tokens ?? 0;
    imageInputImageTokens = img.usage?.input_tokens_details?.image_tokens ?? 0;
    imageOutputTokens = img.usage?.output_tokens ?? 0;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Image step failed: ${msg}` },
      { status: 502 },
    );
  }
  const imageLatencyMs = Date.now() - imageStart;
  const totalLatencyMs = Date.now() - totalStart;

  const estimatedCostUsd =
    (textInputTokens / 1_000_000) * TEXT_INPUT_PER_M +
    (textOutputTokens / 1_000_000) * TEXT_OUTPUT_PER_M +
    (imageInputTextTokens / 1_000_000) * IMAGE_INPUT_TEXT_PER_M +
    (imageInputImageTokens / 1_000_000) * IMAGE_INPUT_IMAGE_PER_M +
    (imageOutputTokens / 1_000_000) * IMAGE_OUTPUT_PER_M;

  const stats: AiStats = {
    textModel: TEXT_MODEL,
    textInputTokens,
    textOutputTokens,
    textTotalTokens,
    textLatencyMs,
    imageModel: IMAGE_MODEL,
    imageInputTokens,
    imageOutputTokens,
    imageLatencyMs,
    imageSize: IMAGE_SIZE,
    imageMode,
    referenceImagesUsed,
    totalLatencyMs,
    estimatedCostUsd,
  };

  const response: GenerateResponse = {
    name: textPayload.name,
    description: textPayload.description,
    imagePrompt: textPayload.imagePrompt,
    profile: textPayload.profile,
    imageBase64,
    stats,
  };

  return NextResponse.json(response);
}
