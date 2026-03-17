import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { buildStoryHref } from "../data/readerFlow";

const overlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panel = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1 } },
  exit: { opacity: 0, y: 20, scale: 0.97 },
};

export default function WelcomeBackModal({
  data,
  onClose,
  onConvert,
  open,
}) {
  if (!data) return null;

  const { missedStories = [] } = data;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          variants={overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-background-dark shadow-2xl"
            variants={panel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-6 pb-4 pt-8 text-center">
              <span className="material-symbols-outlined text-5xl text-primary">
                waving_hand
              </span>
              <h2 className="mt-3 text-2xl font-black">Welcome back!</h2>
              <p className="mt-2 text-sm text-slate-400">
                We've missed you. Here's what's new since your last visit.
              </p>
            </div>

            {missedStories.length > 0 && (
              <div className="px-6 py-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                  While you were away
                </p>
                <div className="space-y-2">
                  {missedStories.map((story) => (
                    <Link
                      className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-2.5 transition-colors hover:bg-primary/10"
                      key={story.slug}
                      onClick={() => {
                        onConvert?.();
                        onClose();
                      }}
                      to={buildStoryHref(story.slug)}
                    >
                      {story.coverImageUrl && (
                        <img
                          alt={story.title}
                          className="h-14 w-10 shrink-0 rounded-lg object-cover"
                          src={story.coverImageUrl}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-bold">
                          {story.title}
                        </p>
                        <p className="text-[10px] text-primary">New updates</p>
                      </div>
                      <span className="material-symbols-outlined text-sm text-slate-400">
                        chevron_right
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                className="flex-1 rounded-xl border border-primary/20 py-2.5 text-sm font-bold text-slate-400 transition-colors hover:text-white"
                onClick={onClose}
                type="button"
              >
                Maybe later
              </button>
              <Link
                className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-background-dark"
                onClick={() => {
                  onConvert?.();
                  onClose();
                }}
                to="/"
              >
                Start reading
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
