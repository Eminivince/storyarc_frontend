import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { getQueueSize } from "../lib/offlineQueue";
import MaterialSymbol from "./MaterialSymbol";

export default function OfflineBanner() {
  const { isOnline } = useOnlineStatus();
  const [visible, setVisible] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      getQueueSize().then(setQueueCount).catch(() => {});
      return;
    }

    if (visible) {
      const timeoutId = window.setTimeout(() => setVisible(false), 3000);
      return () => window.clearTimeout(timeoutId);
    }
  }, [isOnline, visible]);

  useEffect(() => {
    if (!isOnline && visible) {
      const intervalId = window.setInterval(() => {
        getQueueSize().then(setQueueCount).catch(() => {});
      }, 5000);
      return () => window.clearInterval(intervalId);
    }
  }, [isOnline, visible]);

  const message = !isOnline
    ? queueCount > 0
      ? `You're offline. ${queueCount} action${queueCount === 1 ? "" : "s"} will sync when you reconnect.`
      : "You're offline. Cached content is still available."
    : "You're back online.";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-amber-950"
          exit={{ opacity: 0, y: -40 }}
          initial={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
        >
          <MaterialSymbol name={isOnline ? "wifi" : "wifi_off"} className="text-base" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
