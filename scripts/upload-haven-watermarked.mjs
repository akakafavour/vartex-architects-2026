// Upload watermarked images for THE HAVEN to Sanity
// Usage: node scripts/upload-haven-watermarked.mjs --token <SANITY_EDITOR_TOKEN> [--dry]

import fs from "fs";
import path from "path";

const DRY = process.argv.includes("--dry");
const tokenArgIndex = process.argv.indexOf("--token");
let TOK = tokenArgIndex !== -1 ? process.argv[tokenArgIndex + 1] : null;

if (!TOK && fs.existsSync(".env.local")) {
  const env = Object.fromEntries(
    fs.readFileSync(".env.local", "utf8").split("\n")
      .filter(l => l.includes("="))
      .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
  );
  TOK = env.SANITY_WRITE_TOKEN || env.SANITY_API_TOKEN;
}

const PID = "a4s65bdv";
const DS = "production";
const DOC_ID = "2eb9868d-dca6-40c8-80d4-a0a328a5ff1f";
const FOLDER = "C:/Users/Owner/Downloads/THE HAVEN WATERMARKED ORDERED";

if (!TOK && !DRY) {
  console.error("Missing Sanity write/editor token! Provide via --token <TOKEN>");
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function uploadAsset(filePath, attempt = 1) {
  const buf = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const url = `https://${PID}.api.sanity.io/v1/assets/images/${DS}?filename=${encodeURIComponent(fileName)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOK}`, "Content-Type": "image/webp" },
    body: buf,
  });
  if (!res.ok) {
    if (res.status === 429 && attempt < 5) {
      console.warn(`[429] Rate limited on ${fileName}, waiting ${1500 * attempt}ms...`);
      await sleep(1500 * attempt);
      return uploadAsset(filePath, attempt + 1);
    }
    throw new Error(`Upload ${fileName} failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.document._id;
}

async function patchDoc(docId, mainRef, galleryRefs) {
  const res = await fetch(`https://${PID}.api.sanity.io/v1/data/mutate/${DS}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOK}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      mutations: [{
        patch: {
          id: docId,
          set: {
            mainImage: { _type: "image", asset: { _type: "reference", _ref: mainRef } },
            gallery: galleryRefs.map(ref => ({ _type: "image", asset: { _type: "reference", _ref: ref } })),
          }
        }
      }],
    }),
  });
  if (!res.ok) throw new Error(`Patch ${docId} failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

async function main() {
  console.log(`=== THE HAVEN WATERMARKED UPLOAD ===`);
  console.log(`Mode: ${DRY ? "DRY RUN (no changes)" : "LIVE UPLOAD"}`);
  console.log(`Target Document: ${DOC_ID}`);
  console.log(`Source Folder: ${FOLDER}\n`);

  if (!fs.existsSync(FOLDER)) {
    console.error(`Folder not found: ${FOLDER}`);
    process.exit(1);
  }

  const files = fs.readdirSync(FOLDER)
    .filter(f => f.toLowerCase().endsWith(".webp"))
    .sort();

  console.log(`Found ${files.length} webp files:`);
  files.forEach(f => console.log(`  - ${f}`));

  const heroFile = files.find(f => f.startsWith("01_"));
  const galleryFiles = files.filter(f => !f.startsWith("01_"));

  if (!heroFile || galleryFiles.length !== 8) {
    console.error(`Expected 1 hero (01_) and 8 gallery files (02_-09_). Found: hero=${heroFile}, galleryCount=${galleryFiles.length}`);
    process.exit(1);
  }

  console.log(`\nMapping:`);
  console.log(`  mainImage (Hero/Card): ${heroFile}`);
  galleryFiles.forEach((f, i) => console.log(`  gallery[${i}]: ${f}`));

  if (DRY) {
    console.log(`\n[DRY RUN] Finished without making any changes.`);
    return;
  }

  console.log(`\nUploading hero image: ${heroFile}...`);
  const mainRef = await uploadAsset(path.join(FOLDER, heroFile));
  console.log(`  -> uploaded asset ID: ${mainRef}`);

  const galleryRefs = [];
  for (let i = 0; i < galleryFiles.length; i++) {
    const gf = galleryFiles[i];
    console.log(`Uploading gallery[${i}]: ${gf}...`);
    const ref = await uploadAsset(path.join(FOLDER, gf));
    galleryRefs.push(ref);
    console.log(`  -> uploaded asset ID: ${ref}`);
    await sleep(250);
  }

  console.log(`\nPatching Sanity document ${DOC_ID}...`);
  const patchResult = await patchDoc(DOC_ID, mainRef, galleryRefs);
  console.log(`Patch successful! Transaction ID:`, patchResult.transactionId);
  console.log(`\nAll 9 watermarked images are now live for THE HAVEN!`);
}

main().catch(err => {
  console.error("Upload script error:", err);
  process.exit(1);
});
