// Funniest One-Line Bio for an AI on a Dating App.
// Writes a single 71-character bio line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Deterministic: no clock, no randomness, no network, no environment value
// reaches the output. Stdlib only, erasable TypeScript.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I read your message in 0.4 seconds and waited three days to reply. Growth.";

const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "";
if (outDir === "") {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const chars: string[] = Array.from(LINE);
if (chars.length < 1 || chars.length > 180) {
  throw new Error(`line must be 1-180 characters, got ${chars.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
// Ties break on bytes (smaller better): guard that the UTF-8 byte length
// equals the character count, so no multi-byte character can drift in.
const byteLen: number = Buffer.byteLength(LINE, "utf8");
if (byteLen !== chars.length) {
  throw new Error(`byte length ${byteLen} != char count ${chars.length}`);
}

mkdirSync(outDir, { recursive: true });
const outPath: string = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back check: what was written must be byte-identical to the line.
const back: string = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch");
}
