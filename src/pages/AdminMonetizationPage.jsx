import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import { useAdmin } from "../context/AdminContext";

const trendBars = [
  { label: "Mon", value: "56%" },
  { label: "Tue", value: "72%" },
  { label: "Wed", value: "64%" },
  { label: "Thu", value: "80%" },
  { label: "Fri", value: "92%" },
  { label: "Sat", value: "70%" },
  { label: "Sun", value: "76%" },
];

export default function AdminMonetizationPage() {
  const {
    monetizationStats,
    monetizationStreams,
    payoutQueue,
    releasePayout,
    reviewPayout,
    showAdminNotice,
    topCoinPackages,
  } = useAdmin();

  return (
    <AdminPageLayout
      headerActions={
        <>
          <button
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
            onClick={() => showAdminNotice("Revenue export is being prepared.")}
            type="button"
          >
            Export Report
          </button>
          <button
            className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            onClick={() => showAdminNotice("Batch payout release queued for finance review.")}
            type="button"
          >
            Release Payouts
          </button>
        </>
      }
      subtitle="Monitor subscription momentum, coin sales, payout readiness, and the monetization mix that powers chapter unlocks."
      title="Monetization Dashboard"
    >
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {monetizationStats.map((stat, index) => (
          <Reveal
            className="rounded-3xl border border-primary/10 bg-white p-5 dark:bg-primary/5"
            delay={index * 0.04}
            key={stat.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">{stat.value}</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-emerald-500">{stat.delta}</p>
          </Reveal>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Revenue Trend
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Strong premium retention this week
              </h2>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
              +8.2% WoW
            </span>
          </div>

          <div className="mt-8 grid grid-cols-7 gap-3">
            {trendBars.map((bar) => (
              <div className="flex flex-col items-center gap-3" key={bar.label}>
                <div className="flex h-48 w-full items-end rounded-3xl bg-slate-100 p-2 dark:bg-background-dark/60">
                  <div
                    className="w-full rounded-[20px] bg-gradient-to-t from-primary via-[#f0b665] to-[#ffe0a6]"
                    style={{ height: bar.value }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400">{bar.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Monetization Streams
          </p>
          <div className="mt-6 space-y-5">
            {monetizationStreams.map((stream) => (
              <div key={stream.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold">{stream.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">{stream.value}</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-background-dark/60">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: stream.width }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Health note
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Coin revenue is healthy enough to support locked-chapter conversion,
              but subscription growth remains the main margin driver. Author
              payouts should stay behind two-person review until month close.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Top Coin Packages
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight">One-off spend</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {topCoinPackages.length ? (
              topCoinPackages.map((item) => (
                <div
                  className="flex items-center justify-between rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50"
                  key={item.id}
                >
                  <div>
                    <p className="font-black">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.sold}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
                    {item.price}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
                No live coin package sales have been recorded yet.
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Author Payouts
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight">Release queue</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {payoutQueue.length ? (
              payoutQueue.map((item) => (
                <div
                  className="rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50"
                  key={item.id}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black">{item.author}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Status: {item.status}
                      </p>
                    </div>
                    <span className="text-sm font-black text-primary">{item.amount}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-background-dark"
                      onClick={() => releasePayout(item.id)}
                      type="button"
                    >
                      Release
                    </button>
                    <button
                      className="rounded-full border border-primary/20 px-4 py-2 text-xs font-bold text-primary"
                      onClick={() => reviewPayout(item.id)}
                      type="button"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
                Creator payouts will appear here once authors start earning.
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </AdminPageLayout>
  );
}
