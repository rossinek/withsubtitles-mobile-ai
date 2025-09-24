import { createError, defineEventHandler, getHeader, readBody } from "h3";
import { PunctuateService } from "../services/punctuate.service";
import { config } from "../services/config";

export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'Authorization');
  if (authorization !== `Bearer ${config.apiKey}`) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid API key',
    });
  }
  const body = await readBody(event);
  const text = body.text;
  if (!text || typeof text !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Text is required',
    });
  }

  const start = performance.now();
  const result = await PunctuateService.classify(text);
  const end = performance.now();
  const duration = end - start;
  return {
    result,
    duration,
  };
});
