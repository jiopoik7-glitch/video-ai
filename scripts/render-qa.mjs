#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const QA_FRAMES = [
  180, 390, 630, 930, 1110, 1380, 1780, 2100, 2310,
  2600, 3300, 3780, 4200, 4500, 4980, 5400, 5980, 6180,
];

const entryPoint = process.argv[2] || "src/index.ts";
fs.mkdirSync(path.resolve(process.cwd(), "out", "qa"), { recursive: true });

for (const frame of QA_FRAMES) {
  const outPath = `out/qa/frame-${frame}.png`;
  console.log(`Rendering QA still frame ${frame} -> ${outPath}`);
  execSync(
    `npx remotion still ${entryPoint} PergerakanNasional ${outPath} --frame=${frame}`,
    { stdio: "inherit" }
  );
}
console.log(`Done! Rendered ${QA_FRAMES.length} QA still frames into out/qa/.`);
