import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { getServiceSupabase } from "@/lib/supabase-service";

export async function POST(request: Request) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const workerId = String(form.get("workerId") ?? "");
    const photo = form.get("photo") === "1";
    const file = form.get("file");
    if (!workerId || !(file instanceof File)) {
      return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
    }
    const allowed = photo
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const limit = photo ? 5 : 10;
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }
    if (file.size > limit * 1024 * 1024 || file.size === 0) {
      return NextResponse.json({ error: "File size out of range" }, { status: 400 });
    }
    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "application/pdf": "pdf",
    }[file.type];
    const path = `${workerId}/${crypto.randomUUID()}.${extension}`;
    const bucket = photo ? "maid-photos" : "maid-documents";
    const sb = getServiceSupabase();
    const { error } = await sb.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    let signedUrl: string | undefined;
    if (photo) {
      const signed = await sb.storage.from(bucket).createSignedUrl(path, 900);
      if (signed.error) throw signed.error;
      signedUrl = signed.data.signedUrl;
    }
    return NextResponse.json({ bucket, path, signedUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      files?: { bucket: string; path: string }[];
    };
    const sb = getServiceSupabase();
    for (const file of body.files ?? []) {
      await sb.storage.from(file.bucket).remove([file.path]);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}
