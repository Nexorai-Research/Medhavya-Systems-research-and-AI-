import "./_env.mts";
import { getPayload } from "payload";
import * as configModule from "../src/payload.config";

// payload.config.ts is compiled as CommonJS by tsx, so its default export can arrive double-wrapped.
const wrapped = configModule as unknown as { default: unknown & { default?: unknown } };
const config = (wrapped.default as { default?: unknown }).default ?? wrapped.default;

export const getCms = () => getPayload({ config: config as Parameters<typeof getPayload>[0]["config"] });
