import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { getServiceSupabase } from "@/lib/supabase-service";

export async function GET(request: Request) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const path = new URL(request.url).searchParams.get("path");
  if (!path || path.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  const bucket = path.endsWith(".pdf") ? "maid-documents" : "maid-documents";
  const sb = getServiceSupabase();
  const { data, error } = await sb.storage.from(bucket).download(path);
  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const name = path.split("/").pop() ?? "file";
  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
