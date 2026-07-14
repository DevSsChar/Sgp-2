const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const srcDir = path.join(root, "browser-extension");
const outDir = path.join(root, "public", "extensions", "session-import");
const zipPath = path.join(root, "public", "extensions", "accessibilityguard-session-import.zip");

const files = ["manifest.json", "background.js", "content-bridge.js"];

fs.mkdirSync(outDir, { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
}

fs.mkdirSync(path.dirname(zipPath), { recursive: true });
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const isWin = process.platform === "win32";
if (isWin) {
  execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path '${outDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
    ],
    { stdio: "inherit" }
  );
} else {
  execFileSync("zip", ["-j", zipPath, ...files.map((f) => path.join(outDir, f))], {
    stdio: "inherit",
  });
}

console.log(`Packed extension → ${zipPath}`);
