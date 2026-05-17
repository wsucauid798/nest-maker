export type Selections = Record<string, string>;

export type NestProfile = {
  coziness: number;
  durability: number;
  camouflage: number;
  craftsmanship: number;
  charm: number;
};

export type AiStats = {
  textModel: string;
  textInputTokens: number;
  textOutputTokens: number;
  textTotalTokens: number;
  textLatencyMs: number;
  imageModel: string;
  imageInputTokens: number;
  imageOutputTokens: number;
  imageLatencyMs: number;
  imageSize: string;
  imageMode: "generate" | "edit";
  referenceImagesUsed: number;
  totalLatencyMs: number;
  estimatedCostUsd: number;
};

export type GenerateResponse = {
  name: string;
  description: string;
  imagePrompt: string;
  profile: NestProfile;
  imageBase64: string;
  stats: AiStats;
};
