import type { ReactNode } from "react";

const WIDTH_CLASS = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
} as const;

export function AdminPageShell({
  children,
  width = "default",
}: {
  children: ReactNode;
  width?: keyof typeof WIDTH_CLASS;
}) {
  return (
    <div className="px-6 py-8">
      <div className={`mx-auto space-y-8 ${WIDTH_CLASS[width]}`}>{children}</div>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FFB89A]/70">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="title-header text-2xl font-extrabold tracking-wide sm:text-3xl">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-white/55">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function AdminAlert({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={
        status === "success" ? "admin-alert admin-alert-success" : "admin-alert admin-alert-error"
      }
      role="alert"
    >
      {message}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
  title,
  description,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className={`admin-card rounded-2xl p-5 sm:p-6 ${className}`}>
      {title ? (
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description ? <p className="mt-1 text-xs text-white/40">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function AdminFieldLabel({ children }: { children: ReactNode }) {
  return <label className="admin-label">{children}</label>;
}

export const adminInputClass = "admin-input";
export const adminTextareaClass = "admin-input min-h-[120px] resize-y";
export const adminSelectClass = "admin-input";
export const adminFileClass = "admin-file-input";
export const adminBtnPrimaryClass = "admin-btn admin-btn-primary";
export const adminBtnSecondaryClass = "admin-btn admin-btn-secondary";
export const adminBtnDangerClass = "admin-btn admin-btn-danger";
export const adminBtnMutedClass = "admin-btn admin-btn-muted";

export function AdminFilterPills({
  options,
  current,
  buildHref,
}: {
  options: readonly string[];
  current: string;
  buildHref: (option: string) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = current === option;
        return (
          <a
            key={option}
            href={buildHref(option)}
            className={isActive ? "admin-filter-pill admin-filter-pill-active" : "admin-filter-pill"}
          >
            {option}
          </a>
        );
      })}
    </div>
  );
}

export function AdminEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 px-4 py-12 text-center text-sm text-white/40">
      {children}
    </div>
  );
}
