import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getLinks } from "@/data/links";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

function extractFileId(link: string): string | null {
  const m = link.match(/\/d\/([a-zA-Z0-9_-]+)/) ?? link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m?.[1] ?? null;
}

export const checkAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        chapter: z.string().max(100),
        topic: z.string().max(200),
        kind: z.enum(["worksheet", "markScheme"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const email = String((context.claims as { email?: string }).email ?? "").toLowerCase();
    const link = getLinks(data.chapter, data.topic)[data.kind];
    if (!email || !link) return { allowed: false as const };
    const fileId = extractFileId(link);
    if (!fileId) return { allowed: false as const };

    const lovableKey = process.env["LOVABLE_API_KEY"];
    const driveKey = process.env["GOOGLE_DRIVE_API_KEY"];
    if (!lovableKey || !driveKey) throw new Error("Google Drive is not connected");

    const res = await fetch(
      `${GATEWAY_URL}/files/${fileId}/permissions?fields=permissions(type,emailAddress)&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": driveKey } },
    );
    if (!res.ok) {
      console.error(`Drive permissions failed [${res.status}]: ${await res.text()}`);
      return { allowed: false as const };
    }
    const body = (await res.json()) as {
      permissions?: { type?: string; emailAddress?: string }[];
    };
    const ok = (body.permissions ?? []).some(
      (p) => p.type === "anyone" || p.emailAddress?.toLowerCase() === email,
    );
    return ok ? { allowed: true as const, url: link } : { allowed: false as const };
  });
