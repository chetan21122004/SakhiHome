import { NextResponse } from "next/server";
import type { Json } from "@/lib/database.types";
import type { Enquiry, EnquiryInput } from "@/lib/enquiries";
import { upsertClientFromEnquiry } from "@/lib/client-access";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getServiceSupabase } from "@/lib/supabase-service";
import { sendEnquiryNotification } from "@/lib/brevo";
import { checkShareRateLimit } from "@/lib/share-rate-limit";
import {
  formatIndianMobileForStorage,
  isValidIndianMobile,
} from "@/lib/india-contact";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (!checkShareRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const input = (await request.json()) as EnquiryInput;
    if (!input.name?.trim() || !input.phone?.trim()) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 },
      );
    }
    if (!isValidIndianMobile(input.phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 },
      );
    }
    const phone = formatIndianMobileForStorage(input.phone);

    const sb = getSupabaseServer();
    if (!sb) {
      return NextResponse.json(
        {
          error:
            "Enquiry form is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
        },
        { status: 503 },
      );
    }

    const id = `ENQ-${crypto.randomUUID()}`;
    const payload: Enquiry = {
      id,
      ...input,
      phone,
      area: input.area?.trim() || "Not specified",
      service: input.service?.trim() || "Not specified",
      status: "New",
    };
    const { error } = await sb.from("enquiries").insert({
      id,
      payload: payload as Json,
    });
    if (error) throw error;

    try {
      getServiceSupabase();
      await upsertClientFromEnquiry(payload);
    } catch (clientError) {
      console.warn(
        "Client lead not created (set SUPABASE_SERVICE_ROLE_KEY for auto client records):",
        clientError instanceof Error ? clientError.message : clientError,
      );
    }

    const mail = await sendEnquiryNotification(payload);
    if (!mail.ok) {
      console.error("Brevo enquiry email failed:", mail.error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
