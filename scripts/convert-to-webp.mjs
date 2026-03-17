#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp"]);
const SKIP_DIRECTORIES = new Set(["node_modules", ".git", ".next"]);

function parseArgs(argv) {
  const options = {
    dir: "public",
    quality: 82,
    deleteOriginal: false,
    recursive: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--dir" && argv[i + 1]) {
      options.dir = argv[i + 1];
      i += 1;
    } else if (arg === "--quality" && argv[i + 1]) {
      const q = Number(argv[i + 1]);
      if (Number.isNaN(q) || q < 1 || q > 100) {
        throw new Error("--quality must be a number from 1 to 100");
      }
      options.quality = q;
      i += 1;
    } else if (arg === "--delete") {
      options.deleteOriginal = true;
    } else if (arg === "--no-recursive") {
      options.recursive = false;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Convert images to WebP\n\nUsage:\n  node scripts/convert-to-webp.mjs [options]\n\nOptions:\n  --dir <path>       Target folder (default: public)\n  --quality <1-100>  WebP quality (default: 82)\n  --delete           Delete original image after conversion\n  --no-recursive     Convert only files in the top-level folder\n  -h, --help         Show this help`);
}

async function* walkFiles(dir, recursive) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!recursive || SKIP_DIRECTORIES.has(entry.name)) {
        continue;
      }
      yield* walkFiles(fullPath, recursive);
      continue;
    }

    yield fullPath;
  }
}

function isConvertibleImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

async function convertImageToWebp(filePath, quality, deleteOriginal) {
  const outputPath = filePath.replace(/\.[^.]+$/, ".webp");

  await sharp(filePath).webp({ quality }).toFile(outputPath);

  if (deleteOriginal) {
    await fs.unlink(filePath);
  }

  return outputPath;
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const targetDir = path.resolve(process.cwd(), options.dir);

    const stat = await fs.stat(targetDir).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      throw new Error(`Directory not found: ${targetDir}`);
    }

    let scanned = 0;
    let converted = 0;

    console.log(`Scanning: ${targetDir}`);

    for await (const filePath of walkFiles(targetDir, options.recursive)) {
      scanned += 1;

      if (!isConvertibleImage(filePath)) {
        continue;
      }

      try {
        const outputPath = await convertImageToWebp(filePath, options.quality, options.deleteOriginal);
        converted += 1;
        console.log(`Converted: ${path.relative(process.cwd(), filePath)} -> ${path.relative(process.cwd(), outputPath)}`);
      } catch (error) {
        console.error(`Failed: ${path.relative(process.cwd(), filePath)} (${error.message})`);
      }
    }

    console.log(`Done. Scanned ${scanned} files, converted ${converted} image(s).`);
  } catch (error) {
    console.error(error.message);
    printHelp();
    process.exit(1);
  }
}

await main();