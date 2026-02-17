// ═══════════════════════════════════════════════════════════════
// COCONUTJS
// Video transcoding service type definitions
// ═══════════════════════════════════════════════════════════════

declare module 'coconutjs' {
  export interface CoconutConfig {
    api_key: string;
  }

  export interface CoconutJob {
    source: string;
    webhook?: string;
    outputs?: Record<string, string>;
  }

  export class Coconut {
    constructor(config: CoconutConfig);
    createJob(job: CoconutJob): Promise<any>;
  }

  export function createClient(config: CoconutConfig): Coconut;
}

