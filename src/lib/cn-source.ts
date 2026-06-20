import fs from "fs";
import path from "path";

export function getComponentSource(filePath: string): string {
  try {
    const abs = path.join(process.cwd(), filePath);
    return fs.readFileSync(abs, "utf8");
  } catch {
    return "";
  }
}
