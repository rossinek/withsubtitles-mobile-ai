import { d as defineEventHandler, g as getHeader, c as config, a as createError, r as readBody, P as PunctuateService } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@huggingface/transformers';
import 'node:assert';
import 'node:url';

const punctuate = defineEventHandler(async (event) => {
  const authorization = getHeader(event, "Authorization");
  if (authorization !== `Bearer ${config.apiKey}`) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Invalid API key"
    });
  }
  const body = await readBody(event);
  const text = body.text;
  if (!text || typeof text !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Text is required"
    });
  }
  const start = performance.now();
  const result = await PunctuateService.classify(text);
  const end = performance.now();
  const duration = end - start;
  return {
    result,
    duration
  };
});

export { punctuate as default };
//# sourceMappingURL=punctuate.mjs.map
