import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "../lib/theme";
import { cn } from "./ui";

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition",
        active
          ? "bg-[var(--inset-hover)] text-[var(--ink)]"
          : "text-[var(--ink-soft)] hover:text-[var(--ink)]",
      )}
    >
      {label}
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-saffron)] text-lg text-white">
            ✶
          </span>
          <span className="text-base font-semibold tracking-tight text-[var(--ink)]">
            Vedic<span className="text-[var(--color-saffron-soft)]">Match</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--inset)] p-1">
            <NavLink href="/" label="Compute" active={location === "/"} />
            <NavLink href="/reports" label="Reports" active={location.startsWith("/reports")} />
          </nav>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--inset)] text-[var(--ink-soft)] transition hover:bg-[var(--inset-hover)] hover:text-[var(--ink)]"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <main className="flex-1 pb-16">{children}</main>

      <footer className="border-t border-[var(--line)] py-6 text-center text-xs text-[var(--ink-faint)]">
        Ashtakoot Guna Milan · heuristic Vedic compatibility · for guidance, not certainty.
      </footer>
    </div>
  );
}
