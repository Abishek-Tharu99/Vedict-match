import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

function cn(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{children}</h2>
      {hint && <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{hint}</p>}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-[var(--color-saffron)] to-[var(--color-saffron-soft)] text-white shadow-lg shadow-orange-900/30 hover:brightness-110",
    ghost: "border border-[var(--line)] bg-[var(--inset)] text-[var(--ink-soft)] hover:bg-[var(--inset-hover)]",
    danger:
      "border border-rose-400/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-200",
  };
  return <button className={cn(base, styles[variant], className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--ink-soft)]">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{error}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-xl border border-[var(--line)] bg-[var(--field-bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-faint)] focus:border-[var(--color-saffron-soft)] focus:ring-2 focus:ring-orange-500/20";

export function Input(props: HTMLAttributes<HTMLInputElement> & Record<string, unknown>) {
  const { className, ...rest } = props as { className?: string };
  return <input className={cn(inputBase, className)} {...(rest as object)} />;
}

export function Select(props: HTMLAttributes<HTMLSelectElement> & Record<string, unknown>) {
  const { className, children, ...rest } = props as { className?: string; children?: ReactNode };
  return (
    <select className={cn(inputBase, "appearance-none", className)} {...(rest as object)}>
      {children}
    </select>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-[var(--ink-soft)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--color-saffron-soft)]" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export { cn };
