// Upload reordered hi-fi project images to Sanity
// Preserves the exact website hierarchy:
// 00_THUMBNAIL_* -> mainImage (Card / Hero thumbnail)
// 01_PAGE_IMAGE_01_* -> gallery[0] (First image on project page)
// 02_PAGE_IMAGE_02_* -> gallery[1] (Second image on project page), etc.
// Usage: node scripts/upload-ordered-hifi.mjs [--dry] [--token <SANITY_EDITOR_TOKEN>]

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

if (!TOK && !DRY) {
  console.error("Missing Sanity write/editor token! Provide via --token <TOKEN> or in .env.local");
  process.exit(1);
}

const ROOT = "C:/Users/Owner/Downloads/vartex replacement images ordered";

const PROJECTS = [
  { title: "THE HAVEN",       docId: "2eb9868d-dca6-40c8-80d4-a0a328a5ff1f", folder: "6-THE HAVEN" },
  { title: "NKA NA UZU.",     docId: "project-nka-na-uzu",                    folder: "5-NKA NA UZU" },
  { title: "CLERGY HOUSE.",   docId: "JF45kMApXNjiRUyFzzl9dt",                folder: "4-CLERGY HOUSE" },
  { title: "THE CORINTHIAN.", docId: "fRYWkTs9BV3skEux6vWuG0",                folder: "3-THE CORINTHIAN" },
  { title: "HOUSE ARIES.",    docId: "LmnXOkuQqTWMk2vgbXZ0LH",                folder: "2-HOUSE ARIES" },
  { title: "PORTFOLIO.",      docId: "JF45kMApXNjiRUyG02hj3d",                folder: "1-PORTFOLIO 2025" },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function uploadAsset(filePath, attempt = 1) {
  const buf = fs.readFileSync(filePath);
  const url = `https://${PID}.api.sanity.io/v1/assets/images/${DS}?filename=${encodeURIComponent(path.basename(filePath))}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOK}`, "Content-Type": "image/webp" },
    body: buf,
  });
  if (!res.ok) {
    if (res.status === 429 && attempt < 5) {
      await sleep(1500 * attempt);
      return uploadAsset(filePath, attempt + 1);
    }
    throw new Error(`${res.status} ${await res.text()}`);
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
  if (!res.ok) throw new Error(`patch ${docId}: ${res.status} ${await res.text()}`);
}

async function main() {
  console.log(`=== VARTEX HIFI REORDERED UPLOAD ===`);
  console.log(`Mode: ${DRY ? "DRY RUN (no changes)" : "LIVE UPLOAD"}`);
  console.log(`Source: ${ROOT}\n`);

  for (const p of PROJECTS) {
    const dir = path.join(ROOT, p.folder);
    if (!fs.existsSync(dir)) {
      console.error(`Folder missing: ${dir}`);
      continue;
    }

    const allFiles = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".webp")).sort();
    const thumbnailFile = allFiles.find(f => f.startsWith("00_THUMBNAIL_"));
    const galleryFiles = allFiles.filter(f => !f.startsWith("00_THUMBNAIL_"));

    console.log(`\n-----------------------------------------------------------`);
    console.log(`PROJECT: ${p.title} (${allFiles.length} total files)`);
    console.log(`  Thumbnail (mainImage): ${thumbnailFile || "MISSING!"}`);
    console.log(`  Gallery (${galleryFiles.length} images):`);
    galleryFiles.forEach((gf, i) => {
      console.log(`    [Slot ${String(i + 1).padStart(2, "0")}] -> ${gf}`);
    });

    if (DRY) continue;

    console.log(`  Uploading thumbnail...`);
    const mainRef = await uploadAsset(path.join(dir, thumbnailFile));
    console.log(`  ✔ Thumbnail uploaded: ${mainRef}`);

    console.log(`  Uploading ${galleryFiles.length} gallery images...`);
    const galleryRefs = [];
    for (let i = 0; i < galleryFiles.length; i++) {
      const gFile = galleryFiles[i];
      const gRef = await uploadAsset(path.join(dir, gFile));
      galleryRefs.push(gRef);
      process.stdout.write(`  ✔ [${i + 1}/${galleryFiles.length}] ${path.basename(gFile)}\n`);
    }

    console.log(`  Patching document (${p.docId})...`);
    await patchDoc(p.docId, mainRef, galleryRefs);
    console.log(`  ✔ SUCCESS: ${p.title} fully updated with hi-fi images!`);
  }

  console.log(`\n===========================================================`);
  console.log(`ALL DONE!`);
}

main().catch(err => {
  console.error("Upload error:", err);
  process.exit(1);
});
