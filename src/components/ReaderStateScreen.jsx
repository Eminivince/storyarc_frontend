import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MaterialSymbol from "./MaterialSymbol";

export default function ReaderStateScreen({
  ctaLabel = "Back to Dashboard",
  ctaTo = "/dashboard",
  secondaryLabel,
  secondaryTo,
  title,
  tone = "info",
  description,
}) {
  const toneClass =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
      : "border-primary/10 bg-primary/5 text-primary";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light px-4 font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-[2rem] border border-primary/10 bg-white p-8 text-center shadow-xl dark:bg-surface-dark"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.28 }}
      >
        <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border ${toneClass}`}>
          <MaterialSymbol name={tone === "error" ? "error" : "auto_stories"} className="text-3xl" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-background-dark"
            to={ctaTo}
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryTo ? (
            <Link
              className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-3 text-sm font-bold"
              to={secondaryTo}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
