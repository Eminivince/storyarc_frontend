import SkeletonBlock from "./SkeletonBlock";

export default function RouteLoadingScreen() {
  return (
    <div className="min-h-screen bg-background-light px-6 py-10 text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-12 w-12 rounded-2xl bg-primary/20 dark:bg-primary/15" />
            <div className="space-y-3">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-4 w-64" />
            </div>
          </div>
          <SkeletonBlock className="h-11 w-28 rounded-xl" />
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_24rem]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-primary/10 bg-white/80 p-6 dark:bg-white/5">
              <SkeletonBlock className="h-72 w-full rounded-[1.75rem]" />
              <div className="mt-6 space-y-4">
                <SkeletonBlock className="h-5 w-28 rounded-full bg-primary/20 dark:bg-primary/15" />
                <SkeletonBlock className="h-12 w-4/5" />
                <SkeletonBlock className="h-4 w-3/5" />
                <div className="flex gap-3 pt-2">
                  <SkeletonBlock className="h-12 w-40 rounded-xl bg-primary/25 dark:bg-primary/20" />
                  <SkeletonBlock className="h-12 w-36 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="rounded-3xl border border-primary/10 bg-white/80 p-4 dark:bg-white/5"
                  key={index}
                >
                  <SkeletonBlock className="aspect-[3/4] w-full rounded-2xl" />
                  <div className="mt-4 space-y-3">
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-1/2" />
                    <SkeletonBlock className="h-3 w-2/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="rounded-3xl border border-primary/10 bg-white/80 p-5 dark:bg-white/5"
                key={index}
              >
                <SkeletonBlock className="h-4 w-1/3" />
                <div className="mt-4 space-y-3">
                  <SkeletonBlock className="h-12 w-full" />
                  <SkeletonBlock className="h-12 w-full" />
                  <SkeletonBlock className="h-12 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
