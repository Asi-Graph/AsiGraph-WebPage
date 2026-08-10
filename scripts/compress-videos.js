import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const FFMPEG = `C:\\Users\\BVL\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe`;
const VIDEOS_DIR = path.join(process.cwd(), "public", "videos");

const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith(".mp4"));

console.log(`Found ${files.length} videos to process...`);

for (const file of files) {
  const filePath = path.join(VIDEOS_DIR, file);
  const tempPath = path.join(VIDEOS_DIR, `compressed_${file}`);
  const statBefore = fs.statSync(filePath);
  const sizeMBBefore = (statBefore.size / 1024 / 1024).toFixed(2);

  // Skip if already small (under 4MB) unless hero.mp4
  if (statBefore.size < 4 * 1024 * 1024 && file !== "hero.mp4") {
    console.log(`Skipping ${file} - already small (${sizeMBBefore} MB)`);
    continue;
  }

  console.log(`Compressing ${file} (${sizeMBBefore} MB)...`);

  try {
    // scale to 720p height maintaining aspect ratio, remove audio (-an), crf 30 for high compression web previews
    const targetScale = file === "hero.mp4" ? "scale=-2:720" : "scale=-2:480";
    const crf = file === "hero.mp4" ? "28" : "30";
    const cmd = `"${FFMPEG}" -i "${filePath}" -vf "${targetScale}" -vcodec libx264 -crf ${crf} -preset fast -an "${tempPath}" -y`;
    
    execSync(cmd, { stdio: "inherit" });

    const statAfter = fs.statSync(tempPath);
    const sizeMBAfter = (statAfter.size / 1024 / 1024).toFixed(2);

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);

    console.log(`Finished ${file}: ${sizeMBBefore} MB -> ${sizeMBAfter} MB`);
  } catch (err) {
    console.error(`Error compressing ${file}:`, err);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

console.log("All videos optimized successfully!");
