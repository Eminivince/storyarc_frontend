import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";
import { useOnboarding } from "../context/OnboardingContext";
import { useToast } from "../context/ToastContext";

const desktopGenres = [
  { name: "Fantasy", icon: "storm", description: "Magic & Dragons" },
  { name: "Romance", icon: "favorite", description: "Heartfelt stories" },
  { name: "Sci-Fi", icon: "rocket_launch", description: "Future worlds" },
  { name: "Mystery", icon: "search", description: "Whodunnits" },
  { name: "Horror", icon: "skull", description: "Spooky tales" },
  { name: "Slice of Life", icon: "coffee", description: "Daily adventures" },
  { name: "Historical", icon: "history_edu", description: "Past eras" },
  { name: "Thriller", icon: "psychology", description: "Suspenseful plots" },
  { name: "Non-Fiction", icon: "menu_book", description: "True stories" },
];

const mobileGenres = [
  {
    name: "Fantasy",
    icon: "castle",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmnDO07CqGc5EoRt2NcjXypfF2SPdvus904YXMjvsymUzBbddWC-WiFT9lDt0UXrmIOwzJnQpIBQO-vlqdNM870i3AhGnYjmz3bDd4uPcLPEEk5dz2eqZoC8UQQBZlG_KYXKu0qUCD1oPwYYXrJoRrM4Vp8ZCPVXEHRlYqSue42sdMVHzdav-FRIWeOZ_pEkSf_p2XM7a8biw_3QJ_pI6N7X5XQU78Ux48S7PXnXijEHjCaVmxCSBvFNZinupYZUBrU130FiDx25s",
  },
  {
    name: "Sci-Fi",
    icon: "rocket_launch",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQQBKpXk-kwE_fhQpF8dcMLExyHopEfd0KV6Kvu5Rjabv3b1HcbnUb9INk5hXxmjuB62a_Q99xtoXYilhkv1kFZFXhDHnfsawD9o43VoKfjVC4ZNk7qEnYDrT4pdJOURPQF4shVme_clk3OUKNmVKHiWrnJmtxS1-GfEebQAcU4bC5g0JFZ-Xolwdeu9Q6piqDrxyd6LbY7i8UVjFu9d50u40ojYBpdtnmmivMl8x2qbz1CYZT51B0GSWkVq6F2c_A8gJ489jpxeU",
  },
  {
    name: "Romance",
    icon: "favorite",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQmv8dwdwTYLjPdlK9FJDhQgDwAFcwO7-6UBgxxn9jHmtwreehK68VKMfpBKBjGlk_yKO_OIKbgi5OXqWiU4k03P7FnWbw0txjmj2PG177G0x5gHtGRmVvmnaD0MSXrzfoGpAdvF6ulzG0Bu9CkZJ26zm87UEovYrhkoAyZvgpgTmO3QDSnxVZ1Tp7YwJEMCzvPqkc6C4W-z8HBQ4N4GVvKp9Obn8ymvv5SdqBPgshtYOzMAHXCU_PrcziNx8j_zfZXGL5jS2l3Uw",
  },
  {
    name: "Mystery",
    icon: "search",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg2n_moFEKd-ts5ZC9-OsIVJxpTuHdKzUvWV4juofSBqDvKNZ3S5h54v63X7CKKMFpaOyA3kH77fd8ASHhHnl9fFyslt0MACAzj88wERCx3VhwkS4ULBXpxoYJ6J0ehVRAsXTUj1ftO6JAN_RoUSfnEpiLxN89Jfulglw9gvWYXibx_fp8g0RhXH5UgdXBZw6cnfM_wl6ULGJGRGO203m480hxuBvqIl6um37MSNZyUMu86Vm6a-7SgIlR4xq41d2vdWJU-jmJSlw",
  },
  {
    name: "Horror",
    icon: "skull",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrA-kw0DGMzqwYYvNqW4VfQceHshRj4_G575It5U6Y6N4vfUvGN-oo_6g8VjFcmuSjkdgD_aHMBAhBIVS9PxTEiiLjTnILcIhBMhtEDGaYBe0jtcUYXx9zdtXdtg0Nfa5a9KlBYI0ptJf1FBIUJsp1KGaYICZ-I9tzl8JG0UNijSMC7d0nRMNaeHPRqtPITqQbOY1fI5rNJMVtIWuwuTIcvYx_Dg5dd3f5W0PGKDegxq85OaTci9JZa3hvK-IUOMdYXGxoTD4hQuE",
  },
  {
    name: "Thriller",
    icon: "visibility",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAFFl_7ubENi93Wasywp7gV6FRumUi9uIRlRDXKnAFvDfvbqPDtecnNvZ9BWooeXCjJbHj_OnuU0GDqKQlZzRQ-6JhxTXrvZVcBHMa9gOYEOzxTHwD1Bn9r33KbxMbREXLi4cYQxCYb0pKLSkAd_cK2g0uFOS6cOVYkbV7586guc2nez3S9eP-bHv2P9tx6reM80JpvYdBW2bR25IEspfLp1Lhm84dmiJUZxHfNBnd82Q77CnvN0MD5N-SwLfHzu_L-OtWKjM4INY",
  },
  {
    name: "Adventure",
    icon: "explore",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhZDYS0e6o3PR047UVji2R1TZYnAdr1m7CjI3rau7ed4jrZq0EbRhw8-kWQ17uyqg0binA5UC64b3-hgmdTe2EUgG72s4KCs0tOCnE9WDuagDEQjTS2YZNhUwMCHifSPiMgL2zzfPEvj_IPKMsJvItcYZzDTrV8HeHgKWHGzzF89yvmAmqEbqvR5AeKmmuLnpBIATudeDgMjQPGnSBx6vYWxCrs6_vQUMjM-_85He2ttKeHWdE1A-bp2WlbuPuVw0EjzClZH2dAGo",
  },
  {
    name: "Historical",
    icon: "history_edu",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2j_NHRxTpo-hx4Ug7Ay2JlQ8o0gbYAOt9NgHWT2U0ddo_vKySqH4ztGr7Qiub8Pbps94twZXMGbBlN2N2MzB9HgQUTD13YJ5UNtku5ww7GovFY67C-jMRe_4FnEUacu7g2i5F_drMnQh1UP4IYVZ5L4niOKkjyKUKO9wc0lUQ7TeUTveVOYXftNMjEYA6-0fiS5rLdmJ1lvp_N_8wEj6bUJQiA3dyVC8pSMI_FWwvRChyg1rAF32NCzgfrr2bCyr-Es5rBwyR21c",
  },
];

function getErrorMessage(error) {
  return error?.message || "We could not save your genres.";
}

function DesktopGenreSelection() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isSavingGenres, persistGenres, selectedGenres, toggleGenre } =
    useOnboarding();

  async function handleContinue() {
    if (selectedGenres.length === 0) {
      showToast("Choose at least one genre to continue.", {
        tone: "error",
        title: "Genres required",
      });
      return;
    }

    try {
      await persistGenres();
      navigate("/onboarding/preferences");
    } catch (error) {
      showToast(getErrorMessage(error), {
        tone: "error",
        title: "Could not save genres",
      });
    }
  }

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col px-4 py-5 md:px-10">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-4 py-3 dark:border-primary/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">
                auto_stories
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-[-0.015em]">TaleStead</h2>
          </div>
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-900 dark:bg-primary/10 dark:text-primary"
            to="/auth"
          >
            <span className="material-symbols-outlined">close</span>
          </Link>
        </header>

        <Reveal className="mt-4 flex flex-col gap-3 p-4" distance={12}>
          <div className="flex items-end justify-between gap-6">
            <p className="text-base font-medium">Onboarding progress</p>
            <p className="text-sm opacity-70">2 of 5</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
            <div className="h-full w-[40%] rounded-full bg-primary" />
          </div>
        </Reveal>

        <div className="px-4 pb-4 pt-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            What do you love to read?
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Select all the genres that spark your interest.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
          {desktopGenres.map((genre) => {
            const selected = selectedGenres.includes(genre.name);

            return (
              <motion.button
                className={`group flex cursor-pointer flex-col gap-4 rounded-xl p-5 text-left transition-all ${
                  selected
                    ? "border-2 border-primary bg-primary/10"
                    : "border border-slate-200 bg-white hover:border-primary/50 dark:border-primary/20 dark:bg-primary/5"
                }`}
                key={genre.name}
                onClick={() => toggleGenre(genre.name)}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={selected ? "text-primary" : "text-slate-400 dark:text-primary/60"}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={selected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {genre.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold leading-tight">{genre.name}</h2>
                    {selected && (
                      <span className="material-symbols-outlined text-xl text-primary">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {genre.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 px-4 py-10 md:flex-row">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              className="order-2 flex h-12 min-w-[140px] w-full items-center justify-center rounded-lg border-2 border-primary bg-transparent px-6 text-base font-bold text-primary hover:bg-primary/10 md:order-1 md:w-auto"
              to="/auth"
            >
              Back
            </Link>
          </motion.div>
          <motion.button
            className="order-1 flex h-12 w-full flex-1 items-center justify-center rounded-lg bg-primary px-8 text-lg font-bold text-background-dark shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60 md:order-2"
            disabled={isSavingGenres}
            onClick={handleContinue}
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSavingGenres ? "Saving..." : "Next"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function MobileGenreSelection() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isSavingGenres, persistGenres, selectedGenres, toggleGenre } =
    useOnboarding();

  async function handleContinue() {
    if (selectedGenres.length === 0) {
      showToast("Choose at least one genre to continue.", {
        tone: "error",
        title: "Genres required",
      });
      return;
    }

    try {
      await persistGenres();
      navigate("/onboarding/preferences");
    } catch (error) {
      showToast(getErrorMessage(error), {
        tone: "error",
        title: "Could not save genres",
      });
    }
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="flex items-center justify-between border-b border-slate-200 bg-background-light p-4 dark:border-slate-800 dark:bg-background-dark">
        <Link
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          to="/auth"
        >
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
            arrow_back
          </span>
        </Link>
        <h2 className="flex-1 pr-10 text-center text-lg font-bold tracking-tight">
          Select Genres
        </h2>
      </div>

      <div className="flex flex-col gap-3 bg-background-light p-4 dark:bg-background-dark">
        <div className="flex items-end justify-between gap-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Your Preferences
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Step 2 of 5
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-[40%] rounded-full bg-primary" />
        </div>
      </div>

      <div className="px-4 pb-2 pt-6 text-center">
        <h3 className="mb-2 text-2xl font-bold leading-tight">
          What stories do you love?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Select at least 3 genres to personalize your feed.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {mobileGenres.map((genre) => {
            const selected = selectedGenres.includes(genre.name);

            return (
              <motion.button
                className={`relative aspect-square overflow-hidden rounded-xl border-2 text-left transition-all ${
                  selected
                    ? "border-primary ring-2 ring-inset ring-primary/20"
                    : "border-transparent hover:border-primary/50"
                }`}
                key={genre.name}
                onClick={() => toggleGenre(genre.name)}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgba(34, 30, 16, 0.9) 0%, rgba(34, 30, 16, 0.2) 100%), url('${genre.image}')`,
                  }}
                />
                {selected && (
                  <div className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-background-dark">
                    <span className="material-symbols-outlined text-sm font-bold">
                      check
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="material-symbols-outlined mb-1 text-primary">
                    {genre.icon}
                  </span>
                  <p className="text-base font-bold leading-tight text-white">
                    {genre.name}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 border-t border-slate-200 bg-background-light p-4 dark:border-slate-800 dark:bg-background-dark">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            className="flex w-full items-center justify-center rounded-xl bg-slate-200 px-6 py-4 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            to="/auth"
          >
            Back
          </Link>
        </motion.div>
        <motion.button
          className="flex-[2] rounded-xl bg-primary px-6 py-4 font-bold text-background-dark shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSavingGenres}
          onClick={handleContinue}
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSavingGenres ? "Saving..." : "Next"}
        </motion.button>
      </div>
    </div>
  );
}

export default function GenreSelectionPage() {
  return (
    <>
      <DesktopGenreSelection />
      <MobileGenreSelection />
    </>
  );
}
