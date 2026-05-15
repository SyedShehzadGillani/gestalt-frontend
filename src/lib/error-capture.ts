type CapturedError = { error: unknown; at: number };
let lastError: CapturedError | undefined;

if (typeof process !== "undefined" && process.on) {
  try {
    process.on("unhandledRejection", (reason) => {
      lastError = { error: reason, at: Date.now() };
    });
    process.on("uncaughtException", (err) => {
      lastError = { error: err, at: Date.now() };
    });
  } catch {
    // no-op in non-Node runtimes
  }
}

export function consumeLastCapturedError(): unknown {
  const captured = lastError;
  lastError = undefined;
  return captured?.error;
}
