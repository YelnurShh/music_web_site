import Link from "next/link";
import type { ReactNode } from "react";

export interface Crumb {
  href?: string;
  label: string;
}

/** PageHero — ішкі беттердің тақырыбы мен «жол көрсеткіші» (breadcrumbs) */
export function PageHero({
  crumbs,
  title,
  lead,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-bg-alt to-bg py-8 sm:py-12">
      <div className="mx-auto w-[min(100%-2rem,1180px)]">
        <nav aria-label="Бет навигациясы" className="mb-3 flex flex-wrap gap-1.5 text-[0.85rem] text-muted">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {crumb.href ? (
                <Link href={crumb.href} className="no-underline hover:text-accent hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {index < crumbs.length - 1 && <span className="opacity-50">›</span>}
            </span>
          ))}
        </nav>

        <h1 className="font-head text-[clamp(1.8rem,4vw,2.8rem)] font-semibold">{title}</h1>
        <p className="max-w-3xl text-[1.05rem] text-ink-soft">{lead}</p>
        {children}
      </div>
    </section>
  );
}
