import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Lock } from "lucide-react";
import logo from "@/assets/edexcel-easy-logo.png";

export const Route = createFileRoute("/purchase")({
  validateSearch: (search: Record<string, unknown>) => ({
    item: typeof search["item"] === "string" ? search["item"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Get Full Access — Edexcel Easy" },
      {
        name: "description",
        content:
          "Purchase Edexcel Easy topicwise worksheets and mark schemes. Contact us on WhatsApp to buy.",
      },
      { property: "og:title", content: "Get Full Access — Edexcel Easy" },
      {
        property: "og:description",
        content:
          "Purchase Edexcel Easy topicwise worksheets and mark schemes. Contact us on WhatsApp to buy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PurchasePage,
});

function PurchasePage() {
  const { item } = Route.useSearch();

  const whatsappText = encodeURIComponent(
    `Hello! I would like to purchase: ${item ?? "Edexcel Easy worksheets"}`,
  );
  const whatsappUrl = `https://wa.me/8801842900265?text=${whatsappText}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="Back to worksheets"
          >
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
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="size-7 text-primary" aria-hidden="true" />
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
          This resource is available for purchase
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          {item
            ? `“${item}” is a paid resource.`
            : "This resource is a paid resource."}{" "}
          Message us on WhatsApp and we'll send you the worksheet and mark
          scheme right away.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Buy on WhatsApp
        </a>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to all topics
        </Link>
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center text-sm text-muted-foreground">
          Worksheets and mark schemes are compiled from Edexcel past papers.
        </p>
      </footer>
    </div>
  );
}
