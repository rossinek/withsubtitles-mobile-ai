import { PunctuateService } from "../services/punctuate.service"
import { validateConfig } from "../services/config";
import type { NitroAppPlugin } from 'nitropack'


const plugin: NitroAppPlugin = (nitroApp) => {
  validateConfig();
  PunctuateService.initialize();
}

export default plugin;
