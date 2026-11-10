/**
 * Minimal structured logger (Module 03 §11). Callers must pass identifiers, not personal data;
 * known sensitive keys are redacted defensively.
 */
const SENSITIVE = new Set(["name", "email", "phone", "message", "password", "token", "organization"]);

type Fields = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", event: string, fields: Fields = {}) {
  const safe = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, SENSITIVE.has(k) ? "[redacted]" : v]));
  const line = JSON.stringify({ level, event, time: new Date().toISOString(), ...safe });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, fields?: Fields) => emit("info", event, fields),
  warn: (event: string, fields?: Fields) => emit("warn", event, fields),
  error: (event: string, fields?: Fields) => emit("error", event, fields),
};
