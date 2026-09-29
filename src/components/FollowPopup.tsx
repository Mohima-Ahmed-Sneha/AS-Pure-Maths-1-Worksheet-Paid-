import { Facebook, Instagram, Youtube } from "lucide-react";
import avatar from "@/assets/mohima-photo.png";

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/mohima.EDXESY/",
    Icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/mohimasneha/",
    Icon: Instagram,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@EdexcelEasy_MohimaAhmedSneha",
    Icon: Youtube,
  },
];

export function FollowPopup() {
  return (
    <div
      role="region"
      aria-label="Follow us"
      className="flex w-full flex-col items-center gap-4 rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-sm sm:flex-row sm:justify-between sm:px-6 sm:py-4 sm:text-left"
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
        <img
          src={avatar}
          alt="Mohima Ahmed Sneha"
          className="size-16 shrink-0 rounded-full border-2 border-primary/30 object-cover object-top sm:size-14"
          width={64}
          height={64}
        />
        <div>
          <p className="font-display text-base font-semibold leading-tight text-foreground">
            Mohima Ahmed Sneha
          </p>
          <p className="text-sm text-muted-foreground">Follow for more maths help</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {socials.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground sm:size-10"
          >
            <Icon className="size-5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}
