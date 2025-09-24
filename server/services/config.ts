import assert from "node:assert"

export const config = {
  apiKey: process.env.API_KEY!,
  modelsPath: process.env.MODELS_PATH!,
}

export function validateConfig() {
  assert(config.apiKey, 'API_KEY is not set');
  assert(config.modelsPath, 'MODELS_PATH is not set');
}
