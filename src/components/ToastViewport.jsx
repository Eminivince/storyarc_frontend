import { AnimatePresence, motion } from "framer-motion";

const toneStyles = {
  error: {
    accent: "bg-rose-500",
    icon: "error",
    iconClass: "text-rose-500",
  },
  info: {
    accent: "bg-sky-500",
    icon: "info",
    iconClass: "text-sky-500",
  },
  success: {
    accent: "bg-emerald-500",
    icon: "check_circle",
    iconClass: "text-emerald-500",
  },
};

export default function ToastViewport({ onDismiss, toasts }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[140] flex justify-center px-4 sm:justify-end">
      <div className="flex w-full max-w-md flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const tone = toneStyles[toast.tone] ?? toneStyles.info;

            return (
              <motion.div
                animate={{ opacity: 1, x: 0, y: 0 }}
                className="pointer-events-auto overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-[0_24px_64px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90"
                exit={{ opacity: 0, x: 40, y: -8 }}
                initial={{ opacity: 0, x: 40, y: -8 }}
                key={toast.id}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`h-1.5 w-full ${tone.accent}`} />
                <div className="flex items-start gap-3 px-4 py-4">
                  <span className={`material-symbols-outlined mt-0.5 ${tone.iconClass}`}>
                    {tone.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    {toast.title ? (
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {toast.title}
                      </p>
                    ) : null}
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {toast.message}
                    </p>
                  </div>
                  <button
                    className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-100"
                    onClick={() => onDismiss(toast.id)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
