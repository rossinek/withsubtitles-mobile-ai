import { pipeline, env } from "@huggingface/transformers";
import type { ProgressInfo } from "@huggingface/transformers";
import { config } from "./config";

env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = config.modelsPath;

export type PunctuateTokenResult = {
  word: string;
  score: number;
  entity: '0' | '.' | ',' | '?' | ':' | '-';
};

export class PunctuateService {
  private static instance: Promise<(text: string) => Promise<PunctuateTokenResult[]>> | null = null;

  private static async getInstance(
    progress_callback?: ((progress: ProgressInfo) => void),
  ) {
    if (!this.instance) {
      this.instance = pipeline('token-classification', 'punctuate', {
        progress_callback,
        dtype: 'q8',
        session_options: {
          interOpNumThreads: 1,
      },

      }) as unknown as Promise<(text: string) => Promise<PunctuateTokenResult[]>>;
    }

    return this.instance;
  }
  static async initialize(progress_callback?: ((progress: ProgressInfo) => void)) {
    return this.getInstance(progress_callback);
  }

  static async classify(text: string) {
    const instance = await this.getInstance();
    return instance(text);
  }
}
