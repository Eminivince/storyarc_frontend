import SkeletonBlock from "./SkeletonBlock";

function LoadingSidebar() {
  return (
    <aside className="hidden h-full min-h-[72vh] rounded-[2rem] border border-primary/10 bg-white/80 p-5 dark:bg-white/5 lg:flex lg:flex-col">
      <div className="space-y-3">
        <SkeletonBlock className="h-10 w-10 rounded-2xl bg-primary/20 dark:bg-primary/15" />
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-3 w-20" />
      </div>

      <div className="mt-8 space-y-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            className="flex items-center gap-3 rounded-2xl border border-primary/10 px-3 py-3"
            key={index}
          >
            <SkeletonBlock className="h-8 w-8 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-3/4" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-[1.5rem] border border-primary/10 p-4">
        <SkeletonBlock className="h-4 w-1/2" />
        <SkeletonBlock className="mt-3 h-10 w-full rounded-xl" />
      </div>
    </aside>
  );
}

function LoadingContent() {
  return (
    <div className="flex min-h-[72vh] flex-col gap-6">
      <section className="rounded-[2rem] border border-primary/10 bg-white/80 p-5 dark:bg-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-24 rounded-full bg-primary/20 dark:bg-primary/15" />
            <SkeletonBlock className="h-8 w-56 sm:w-80" />
            <SkeletonBlock className="h-4 w-48 sm:w-64" />
          </div>
          <div className="flex gap-3">
            <SkeletonBlock className="h-11 w-28 rounded-xl" />
            <SkeletonBlock className="h-11 w-24 rounded-xl bg-primary/20 dark:bg-primary/15" />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-primary/10 bg-white/80 p-5 dark:bg-white/5">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="rounded-[1.5rem] border border-primary/10 p-4"
              key={index}
            >
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-4 h-8 w-20" />
              <SkeletonBlock className="mt-3 h-3 w-2/3" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex-1 rounded-[2rem] border border-primary/10 bg-white/80 p-5 dark:bg-white/5">
        <div className="flex items-center justify-between gap-4">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-10 w-28 rounded-xl" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="rounded-[1.5rem] border border-primary/10 p-4"
              key={index}
            >
              <SkeletonBlock className="aspect-[4/5] w-full rounded-[1.25rem]" />
              <div className="mt-4 space-y-3">
                <SkeletonBlock className="h-4 w-4/5" />
                <SkeletonBlock className="h-3 w-3/5" />
                <SkeletonBlock className="h-3 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function RouteLoadingScreen() {
  return (
    <div className="min-h-[100svh] bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex h-14 items-center justify-between gap-4 rounded-[1.5rem] border border-primary/10 bg-white/80 px-4 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-10 w-10 rounded-2xl bg-primary/20 dark:bg-primary/15" />
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SkeletonBlock className="hidden h-10 w-32 rounded-xl sm:block" />
            <SkeletonBlock className="h-10 w-10 rounded-xl" />
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <LoadingSidebar />
          <LoadingContent />
        </div>
      </div>
    </div>
  );
}
