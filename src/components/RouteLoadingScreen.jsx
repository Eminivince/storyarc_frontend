import { motion } from "framer-motion";

export default function RouteLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light px-6 py-16 text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] border border-primary/10 bg-white/90 px-8 py-10 text-center shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-slate-950/70"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <motion.span
            animate={{ rotate: 360 }}
            className="material-symbols-outlined text-[30px]"
            transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
          >
            auto_stories
          </motion.span>
        </div>
        <div className="space-y-2">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Loading StoryArc
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-300/80">
            Pulling in the next screen and keeping the current product surface
            ready for real API data.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
