// Upload hi-fi project images to Sanity, preserving each project's display
// order: folder file #1 -> mainImage (first image on site), #2 -> gallery[0], etc.
// Usage: node scripts/upload-hifi-images.mjs [--dry] [--upload-only]
// --upload-only: just upload assets to the media library (no document patches);
//                you then assign/reorder them per project in the Sanity studio.
import fs from "fs";
import path from "path";

const DRY = process.argv.includes("--dry");
const UPLOAD_ONLY = process.argv.includes("--upload-only");
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n")
    .filter(l => l.includes("="))
    .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const PID = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DS = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOK = env.SANITY_WRITE_TOKEN || env.SANITY_API_TOKEN;
if (!PID || !TOK) { console.error("Missing Sanity env vars"); process.exit(1); }

const ROOT = "C:/Users/Owner/Downloads/WEBSITE REPLACEMENT IMAGES/WEBSITE REPLACEMENT IMAGES";
// docId = the project document in the CMS; folder = hi-fi images in display order
const PLAN = [
  { title: "PORTFOLIO.",     docId: "JF45kMApXNjiRUyG02hj3d",    folder: "1-PORTFOLIO 2025" },
  { title: "HOUSE ARIES.",   docId: "LmnXOkuQqTWMk2vgbXZ0LH",    folder: "2-HOUSE ARIES" },
  { title: "THE CORINTHIAN.",docId: "fRYWkTs9BV3skEux6vWuG0",    folder: "3-THE CORINTHIAN" },
  { title: "CLERGY HOUSE.",  docId: "JF45kMApXNjiRUyFzzl9dt",    folder: "4-CLERGY HOUSE" },
  { title: "NKA NA UZU.",    docId: "project-nka-na-uzu",        folder: "5-NKA NA UZU" },
  { title: "THE HAVEN.",     docId: "2eb9868d-dca6-40c8-80d4-a0a328a5ff1f", folder: "6-THE HAVEN" },
];

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true });
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
    if (res.status === 429 && attempt < 5) { await sleep(1500 * attempt); return uploadAsset(filePath, attempt + 1); }
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
      mutations: [{ patch: { id: docId, set: {
        mainImage: { _type: "image", asset: { _type: "reference", _ref: mainRef } },
        gallery: galleryRefs.map(ref => ({ _type: "image", asset: { _type: "reference", _ref: ref } })),
      } } }],
    }),
  });
  if (!res.ok) throw new Error(`patch ${docId}: ${res.status} ${await res.text()}`);
}

async function pool(items, worker, size = 6) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) { const idx = i++; results[idx] = await worker(items[idx], idx); }
  }));
  return results;
}

const summary = [];
for (const project of PLAN) {
  const dir = path.join(ROOT, project.folder);
  const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".webp")).sort(natural)
    .map(f => path.join(dir, f));
  const [mainFile, ...galleryFiles] = files;
  console.log(`\n=== ${project.title} — ${files.length} files (main + ${galleryFiles.length} gallery) ===`);
  console.log("  main   <-", path.basename(mainFile));
  galleryFiles.forEach((f, i) => console.log(`  g[${String(i).padStart(2, "0")}] <-`, path.basename(f)));
  if (DRY) continue;

  const mainRef = await uploadAsset(mainFile);
  const galleryRefs = await pool(galleryFiles, f => uploadAsset(f));
  if (!UPLOAD_ONLY) {
    await patchDoc(project.docId, mainRef, galleryRefs);
    console.log("  ✔ uploaded + patched");
  } else {
    console.log(`  ✔ uploaded to media library (${galleryRefs.length + 1} assets)`);
  }
  summary.push(`${project.title}: ${UPLOAD_ONLY ? "assets uploaded (no doc changes)" : "main + " + galleryRefs.length + " gallery OK"}`);
}

if (!DRY) {
  console.log("\n===== DONE =====");
  summary.forEach(s => console.log("✔", s));
}
