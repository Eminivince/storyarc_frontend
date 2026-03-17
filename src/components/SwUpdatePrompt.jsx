import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const SW_UPDATE_EVENT = "talestead:sw-update-available";

export default function SwUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    function handleUpdateAvailable() {
      setShowPrompt(true);
    }

    globalThis.addEventListener(SW_UPDATE_EVENT, handleUpdateAvailable);

    return () => {
      globalThis.removeEventListener(SW_UPDATE_EVENT, handleUpdateAvailable);
    };
  }, []);

  function handleUpdate() {
    if (typeof window.__talesteadUpdateSw === "function") {
      window.__talesteadUpdateSw(true);
    }
    setShowPrompt(false);
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-center gap-4 bg-slate-900 px-4 py-3 text-sm text-slate-100"
          exit={{ opacity: 0, y: 40 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
        >
          <span>A new version is available.</span>
          <button
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-background-dark transition-colors hover:brightness-110"
            onClick={handleUpdate}
            type="button"
          >
            Update
          </button>
          <button
            className="rounded-lg px-3 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
            onClick={() => setShowPrompt(false)}
            type="button"
          >
            Later
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
