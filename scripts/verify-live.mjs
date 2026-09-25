const query = `*[_type == "project"] | order(coalesce(order, 0) asc) {
  title,
  "slug": slug.current,
  "mainImage": mainImage.asset->url,
  "galleryCount": count(gallery),
  "gallery": gallery[].asset->url
}`;

const url = "https://a4s65bdv.api.sanity.io/v1/data/query/production?query=" + encodeURIComponent(query);

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("=== LIVE SANITY VERIFICATION ===");
    for (const p of data.result) {
      console.log(`\nProject: ${p.title} (${p.slug})`);
      console.log(`  Thumbnail (mainImage): ${p.mainImage}`);
      console.log(`  Gallery Count: ${p.galleryCount}`);
      if (p.gallery && p.gallery.length > 0) {
        p.gallery.forEach((url, i) => console.log(`    [${i}] ${url}`));
      }
    }
  })
  .catch(console.error);
