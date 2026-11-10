/**
 * Seed 6 demo maid profiles with photos from Picsum and placeholder documents.
 *
 *   node scripts/seed-demo-maids.mjs
 *
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEMO_MAIDS = [
  {
    id: "DEMO-MAID-SUNITA",
    name: "Sunita Kulkarni (Demo)",
    phone: "9823014567",
    areas: ["Hinjewadi Phase 1", "Wakad"],
    services: ["Cooking", "Elder care"],
    experience: 6,
    salary: "16000",
    languages: "Marathi, Hindi",
    schedule: "8 AM – 6 PM",
    photoSeed: "sakhihome-sunita",
  },
  {
    id: "DEMO-MAID-LAKSHMI",
    name: "Lakshmi Patil (Demo)",
    phone: "9765432180",
    areas: ["Wakad", "Baner"],
    services: ["Cleaning"],
    experience: 4,
    salary: "12000",
    languages: "Marathi, Hindi, English",
    schedule: "9 AM – 1 PM, Mon–Sat",
    photoSeed: "sakhihome-lakshmi",
  },
  {
    id: "DEMO-MAID-ANITA",
    name: "Anita Deshmukh (Demo)",
    phone: "9654321876",
    areas: ["Baner", "Megapolis"],
    services: ["Childcare", "Cleaning"],
    experience: 9,
    salary: "18000",
    languages: "Hindi, Marathi",
    schedule: "7:30 AM – 4 PM",
    photoSeed: "sakhihome-anita",
  },
  {
    id: "DEMO-MAID-MEENA",
    name: "Meena Yadav (Demo)",
    phone: "9543218765",
    areas: ["Marunji", "Hinjewadi Phase 2"],
    services: ["Full-time help", "Cooking"],
    experience: 12,
    salary: "22000",
    languages: "Hindi, Bhojpuri",
    schedule: "Live-in",
    photoSeed: "sakhihome-meena",
  },
  {
    id: "DEMO-MAID-KAVITA",
    name: "Kavita Jadhav (Demo)",
    phone: "9432187654",
    areas: ["Megapolis", "Hinjewadi Phase 3"],
    services: ["Cleaning", "Cooking"],
    experience: 5,
    salary: "14500",
    languages: "Marathi, Hindi",
    schedule: "10 AM – 6 PM",
    photoSeed: "sakhihome-kavita",
  },
  {
    id: "DEMO-MAID-REKHA",
    name: "Rekha Shinde (Demo)",
    phone: "9321876543",
    areas: ["Hinjewadi Phase 2", "Baner"],
    services: ["Elder care", "Cooking"],
    experience: 7,
    salary: "17000",
    languages: "Marathi, Hindi, Konkani",
    schedule: "8 AM – 3 PM",
    photoSeed: "sakhihome-rekha",
  },
];

async function fetchPicsum(seed, w, h) {
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
  const res = await fetch(imageUrl, { redirect: "follow" });
  if (!res.ok) throw new Error(`Picsum ${seed}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get("content-type")?.includes("png")
    ? "image/png"
    : "image/jpeg";
  return { buf, type, ext: type === "image/png" ? "png" : "jpg" };
}

async function upload(bucket, path, buf, contentType) {
  const { error } = await sb.storage.from(bucket).upload(path, buf, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`${bucket}/${path}: ${error.message}`);
}

function buildPayload(entry) {
  const area = entry.areas.join(", ");
  const photoPath = `${entry.id}/photo.jpg`;
  const docDefs = [
    { id: "identity", name: "Identity proof", file: "identity.jpg", suffix: "id" },
    { id: "address", name: "Address proof", file: "address.jpg", suffix: "addr" },
    { id: "police", name: "Police verification", file: "police.jpg", suffix: "police" },
    {
      id: "ref",
      name: "Reference letter",
      file: "reference.jpg",
      suffix: "ref",
      note: "Demo reference",
      reviewed: false,
    },
  ];
  const documents = docDefs.map((d) => ({
    id: `${entry.id}-doc-${d.id}`,
    name: d.name,
    note: d.note,
    file: d.file,
    path: `${entry.id}/${d.file}`,
    reviewed: d.reviewed ?? true,
  }));

  return {
    id: entry.id,
    name: entry.name,
    phone: entry.phone,
    area,
    areas: entry.areas,
    services: entry.services,
    experience: entry.experience,
    salary: entry.salary,
    languages: entry.languages,
    schedule: entry.schedule,
    status: "Available",
    verification: "Verified",
    address: `Demo address, ${entry.areas[0]}, Pune`,
    maritalStatus: "Married",
    guardian: "",
    dependants: "1",
    emergency: "Family · 9000000001",
    notes: "INTERNAL: Demo profile with sample photo from picsum.photos.",
    photoPath,
    documents,
    photoSeed: entry.photoSeed,
    docDefs,
  };
}

const site =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

for (const entry of DEMO_MAIDS) {
  const built = buildPayload(entry);
  const { photoSeed, docDefs, ...payload } = built;

  console.log("Seeding", entry.id, "…");
  const photo = await fetchPicsum(photoSeed, 480, 480);
  await upload("maid-photos", payload.photoPath, photo.buf, photo.type);

  for (const d of docDefs) {
    const docImg = await fetchPicsum(`${photoSeed}-${d.suffix}`, 400, 520);
    const path = `${entry.id}/${d.file}`;
    await upload("maid-documents", path, docImg.buf, docImg.type);
  }

  const { error: maidError } = await sb.from("maids").upsert({
    id: entry.id,
    payload,
  });
  if (maidError) {
    console.error("Maid upsert failed:", maidError.message);
    process.exit(1);
  }

  const teaser = randomBytes(32).toString("base64url");
  const full = randomBytes(32).toString("base64url");
  const expires = new Date();
  expires.setDate(expires.getDate() + 90);

  const { error: linkError } = await sb.from("maid_share_links").upsert(
    {
      maid_id: entry.id,
      teaser_token: teaser,
      full_token: full,
      created_by: "seed-demo-maids.mjs",
      expires_at: expires.toISOString(),
      revoked_at: null,
    },
    { onConflict: "maid_id" },
  );

  console.log("  ✓", payload.name);
  if (linkError) {
    console.warn("  Share links:", linkError.message);
  } else {
    console.log("  Basic:", `${site}/s/${teaser}`);
  }
}

console.log(`Done. ${DEMO_MAIDS.length} demo maids ready in admin / field.`);
