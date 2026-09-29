import { Fragment, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Facebook, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/edexcel-easy-logo.png";
import { FollowPopup } from "@/components/FollowPopup";
import { getLinks } from "@/data/links";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { checkAccess } from "@/lib/access.functions";
import { useUser } from "@/hooks/use-user";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Edexcel Easy — Topicwise Maths Worksheets" },
      {
        name: "description",
        content:
          "Topicwise worksheets from Edexcel past papers with matching mark schemes, organised by chapter.",
      },
      { property: "og:title", content: "Edexcel Easy — Topicwise Maths Worksheets" },
      {
        property: "og:description",
        content:
          "Topicwise worksheets from Edexcel past papers with matching mark schemes, organised by chapter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const chapters = [
  {
    title: "Chapter 1",
    topics: ["Simplification", "Rationalization", "Factorisation", "Simultaneous Equation"],
  },
  {
    title: "Chapter 2",
    topics: [
      "Quadratic & Cubic Graphs",
      "Tangent & Normal",
      "Inequalities",
      "Nature of Roots",
      "Perpendicular Lines",
    ],
  },
  {
    title: "Chapter 3",
    topics: ["Translation & Sketching on Curves", "Translation & Sketching on Trigonometric Curves"],
  },
  {
    title: "Chapter 4",
    topics: ["Trigonometry", "Circular Measure"],
  },
  {
    title: "Chapter 5",
    topics: ["Differentiation"],
  },
  {
    title: "Chapter 6",
    topics: ["Basic Integration", "Graphical Integration"],
  },
];

function DownloadLink({
  href,
  label,
  topic,
  chapter,
  kind,
  free,
}: {
  href: string;
  label: string;
  topic: string;
  chapter: string;
  kind: "worksheet" | "markScheme";
  free?: boolean;
}) {
  // Free topic with a Drive link → open Google Drive directly.
  if (free) {
    if (!href) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground/60">
          <FileDown className="size-4" aria-hidden="true" />
          PDF
        </span>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
      >
        <FileDown className="size-4" aria-hidden="true" />
        PDF
      </a>
    );
  }

  // Paid topic → sign in with Google, then check Drive sharing.
  return <PaidButton label={label} chapter={chapter} topic={topic} kind={kind} />;
}

function PaidButton({
  label,
  chapter,
  topic,
  kind,
}: {
  label: string;
  chapter: string;
  topic: string;
  kind: "worksheet" | "markScheme";
}) {
  const navigate = useNavigate();
  const check = useServerFn(checkAccess);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Sign-in failed. Please try again.");
        return;
      }
      if (result.redirected) return;
    }
    setBusy(true);
    try {
      const res = await check({ data: { chapter, topic, kind } });
      if (res.allowed) {
        const win = window.open(res.url, "_blank", "noopener,noreferrer");
        if (!win) window.location.href = res.url;
        return;
      }
      navigate({ to: "/purchase", search: { item: label } });
    } catch {
      navigate({ to: "/purchase", search: { item: label } });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <FileDown className="size-4" aria-hidden="true" />}
      PDF
    </button>
  );
}

function AccountButton() {
  const user = useUser();
  if (!user) {
    return (
      <button
        type="button"
        onClick={() =>
          lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })
        }
        className="inline-flex h-9 items-center rounded-full border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
      >
        Sign in
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => supabase.auth.signOut()}
      title={user.email ?? ""}
      className="inline-flex h-9 items-center rounded-full border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      Sign out
    </button>
  );
}

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-4 px-6 py-5 sm:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <img
              src={logo}
              alt="Edexcel Easy logo"
              className="size-11 shrink-0"
              width={44}
              height={44}
            />
            <span className="font-display text-2xl font-semibold tracking-tight text-primary">
              Edexcel Easy
            </span>
          </div>
          <p className="text-center font-display text-lg italic text-muted-foreground">
            Topicwise worksheet from Past Papers.
          </p>
          <div className="flex items-center justify-center gap-2 sm:justify-end">
              <AccountButton />
            <a
              href="https://www.facebook.com/edexceleasy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Edexcel Easy on Facebook"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="size-4" aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/+8801842900265"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Edexcel Easy on WhatsApp"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="mb-6">
          <FollowPopup />
        </div>



        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-secondary text-sm uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4 font-semibold">Topics</th>
                  <th className="px-6 py-4 font-semibold">Worksheet File</th>
                  <th className="px-6 py-4 font-semibold">Mark Scheme</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter) => (
                  <Fragment key={chapter.title}>
                    <tr>
                      <th
                        colSpan={3}
                        className="border-y border-border bg-primary/5 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary"
                      >
                        {chapter.title}
                      </th>
                    </tr>
                    {chapter.topics.map((topic, index) => (
                      <tr
                        key={topic}
                        className="border-b border-border transition-colors last:border-b-0 hover:bg-secondary/40"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">
                          <span className="mr-3 tabular-nums text-muted-foreground">
                            {index + 1}.
                          </span>
                          {topic}
                        </td>
                        <td className="px-6 py-4">
                          <DownloadLink
                            href={getLinks(chapter.title, topic).worksheet}
                            chapter={chapter.title}
                            kind="worksheet"
                            label={`Worksheet file for ${topic}`}
                            topic={topic}
                            free={getLinks(chapter.title, topic).free ?? false}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <DownloadLink
                            href={getLinks(chapter.title, topic).markScheme}
                            chapter={chapter.title}
                            kind="markScheme"
                            label={`Mark scheme for ${topic}`}
                            topic={topic}
                            free={getLinks(chapter.title, topic).free ?? false}
                          />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center text-sm text-muted-foreground">
          Worksheets and mark schemes are compiled from Edexcel past papers.
        </p>
      </footer>
      <Toaster />
    </div>
  );
}
