import Link from "next/link";

/** Logo MonDjassa : un sac de boutique en forme de bulle de discussion (la commande arrive en message) */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`shrink-0 ${className}`} aria-hidden>
      <rect width="48" height="48" rx="13" fill="#e8690b" />
      <g transform="translate(0 -1.5)">
        <path d="M18.5 17.5v-1.8a5.5 5.5 0 0 1 11 0v1.8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M14.6 17.5h18.8a2 2 0 0 1 2 2.1l-.9 13.6a3.2 3.2 0 0 1-3.2 3H20.2l-5.4 4.3v-4.6a3.2 3.2 0 0 1-1.8-2.7l-.4-13.6a2 2 0 0 1 2-2.1z" fill="#fff" />
        <circle cx="19.2" cy="27" r="1.7" fill="#e8690b" />
        <circle cx="24" cy="27" r="1.7" fill="#e8690b" />
        <circle cx="28.8" cy="27" r="1.7" fill="#e8690b" />
      </g>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="MonDjassa, accueil">
      <LogoMark className="size-8" />
      <span className="font-display text-[1.25rem] font-bold tracking-tight">
        mon<span className="text-brand">djassa</span>
      </span>
    </Link>
  );
}
