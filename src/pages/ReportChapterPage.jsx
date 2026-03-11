import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  desktopReportReasons,
  buildChapterHref,
  mobileReportReasons,
} from "../data/readerFlow";
import { useToast } from "../context/ToastContext";
import { createContentReport } from "../reader/reportApi";
import { useChapterQuery } from "../reader/readerHooks";

function DesktopReportModal({
  details,
  onClose,
  onDetailsChange,
  onReasonChange,
  onSubmit,
  selectedReason,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none p-10 opacity-40 grayscale">
        <div className="mx-auto max-w-2xl space-y-6">
          <h1 className="mb-8 text-4xl font-bold">Chapter 14: The Golden Echo</h1>
          <p className="text-lg leading-relaxed">
            The sun dipped below the horizon, casting long, amber shadows across
            the valley. Kaelen stood at the precipice, his fingers tracing the
            ancient runes carved into the cold stone. For centuries, this place
            had been forgotten, a whisper in the archives of the Great Library.
            Now, it was the only thing standing between his people and the
            encroaching void.
          </p>
          <p className="text-lg leading-relaxed">
            "Are you certain?" Elara asked, her voice barely audible over the
            wind. She stepped closer, the light of her staff flickering like a
            dying star. "Once the seal is broken, there is no turning back. The
            balance will be shifted forever."
          </p>
          <p className="text-lg leading-relaxed">
            Kaelen didn&apos;t look away from the runes. "The balance was lost the
            moment they crossed the Iron Gates. We are not shifting the balance,
            Elara. We are reclaiming it."
          </p>
        </div>
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 p-4 backdrop-blur-sm">
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative flex w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-primary/10 bg-background-light shadow-2xl dark:bg-[#2d2818]"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
        >
          <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background-dark">
                <span className="material-symbols-outlined text-xl font-bold">
                  flag
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight">
                Report This Content
              </h2>
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary/10 dark:text-slate-400"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <div className="space-y-6 p-6">
            <div>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Please let us know what&apos;s wrong with this chapter. Your feedback
                helps keep StoryArc safe and high-quality.
              </p>

              <div className="grid gap-3">
                {desktopReportReasons.map((reason) => {
                  const isSelected = selectedReason === reason.title;

                  return (
                    <button
                      className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "border-primary/10 hover:border-primary/40 dark:border-primary/20"
                      }`}
                      key={reason.title}
                      onClick={() => onReasonChange(reason.title)}
                      type="button"
                    >
                      <div className="flex grow flex-col">
                        <p className="text-sm font-semibold">{reason.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {reason.description}
                        </p>
                      </div>
                      <span
                        className={`material-symbols-outlined text-primary ${
                          isSelected ? "fill-1" : ""
                        }`}
                      >
                        radio_button_checked
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Additional Details</label>
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-primary/10 bg-white p-4 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-[#221e10] dark:text-slate-100"
                onChange={(event) => onDetailsChange(event.target.value)}
                placeholder="Please describe the issue in detail to help our moderators..."
                value={details}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-primary/10 bg-primary/5 px-6 py-5">
            <button
              className="rounded-lg border border-primary/20 px-6 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-primary/10 dark:text-slate-300"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-background-dark shadow-lg shadow-primary/10 transition-all hover:brightness-110"
              onClick={onSubmit}
              type="button"
            >
              Submit Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MobileReportModal({
  details,
  onClose,
  onDetailsChange,
  onReasonChange,
  onSubmit,
  selectedReason,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light p-4 font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-primary/10 dark:bg-zinc-900/50"
        initial={{ opacity: 0, y: 18 }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-primary/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              report_problem
            </span>
            <h1 className="text-xl font-bold tracking-tight">Report Content</h1>
          </div>
          <button
            className="text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Please select the most relevant reason for reporting this chapter.
              Your feedback helps us keep the community safe.
            </p>
            <div className="space-y-3">
              {mobileReportReasons.map((reason) => {
                const isSelected = selectedReason === reason;

                return (
                  <button
                    className={`flex w-full items-center rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary/40 bg-primary/5"
                        : "border-slate-200 bg-slate-50 hover:border-primary/40 dark:border-primary/5 dark:bg-primary/5"
                    }`}
                    key={reason}
                    onClick={() => onReasonChange(reason)}
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined mr-3 text-primary ${
                        isSelected ? "fill-1" : ""
                      }`}
                    >
                      radio_button_checked
                    </span>
                    <span className="font-medium transition-colors">
                      {reason}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-primary/70">
              Additional Details
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-background-dark dark:text-slate-100"
              onChange={(event) => onDetailsChange(event.target.value)}
              placeholder="Provide more context to help our moderators..."
              rows="4"
              value={details}
            />
            <p className="text-right text-xs text-slate-500 dark:text-slate-500">
              {details.length} / 500 characters
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-5 dark:border-primary/10">
          <button
            className="w-full rounded-lg bg-primary px-4 py-3.5 font-bold text-background-dark shadow-lg shadow-primary/10 transition-transform active:scale-[0.98]"
            onClick={onSubmit}
            type="button"
          >
            Submit Report
          </button>
          <button
            className="w-full rounded-lg bg-slate-100 px-4 py-3.5 font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 pb-6 opacity-60">
          <span className="material-symbols-outlined text-[16px]">security</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Encrypted Moderation Link
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function ReportChapterPage() {
  const navigate = useNavigate();
  const { storySlug = "", chapterSlug = "" } = useParams();
  const { showToast } = useToast();
  const { data } = useChapterQuery(storySlug, chapterSlug);
  const [selectedReason, setSelectedReason] = useState("Inappropriate Content");
  const [details, setDetails] = useState("");
  const reportMutation = useMutation({
    mutationFn: createContentReport,
    onError: (error) => {
      showToast(error.message || "We could not submit that report.", {
        tone: "info",
      });
    },
    onSuccess: (response) => {
      showToast(
        response.message || "Report submitted. Our moderation team has been notified.",
      );
      navigate(buildChapterHref(storySlug, chapterSlug));
    },
  });

  function handleClose() {
    navigate(buildChapterHref(storySlug, chapterSlug));
  }

  function handleSubmit() {
    reportMutation.mutate({
      chapterSlug,
      details,
      reason: selectedReason,
      storySlug,
      title:
        data?.chapter?.chapterTitle && data?.story?.title
          ? `${data.story.title} • ${data.chapter.chapterTitle}`
          : null,
    });
  }

  return (
    <>
      <DesktopReportModal
        details={details}
        onClose={handleClose}
        onDetailsChange={setDetails}
        onReasonChange={setSelectedReason}
        onSubmit={handleSubmit}
        selectedReason={selectedReason}
      />
      <MobileReportModal
        details={details}
        onClose={handleClose}
        onDetailsChange={setDetails}
        onReasonChange={setSelectedReason}
        onSubmit={handleSubmit}
        selectedReason={selectedReason}
      />
    </>
  );
}
