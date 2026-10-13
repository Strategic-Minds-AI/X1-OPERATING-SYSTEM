export declare function createEdenCommandHandler(
  options?: { mode?: string; secret?: string }
): (request: Request) => Promise<Response>;
