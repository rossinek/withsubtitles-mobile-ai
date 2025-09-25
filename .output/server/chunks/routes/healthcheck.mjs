import { d as defineEventHandler } from '../nitro/nitro.mjs';
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

const healthcheck = defineEventHandler(async () => {
  return "ok";
});

export { healthcheck as default };
//# sourceMappingURL=healthcheck.mjs.map
