import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PublicNav from "../components/PublicNav";
import Reveal from "../components/Reveal";
import LoadingSpinner from "../components/LoadingSpinner";
import PageLoadingSpinner from "../components/PageLoadingSpinner";
import { Icon } from "../components/Icon";
import { buildSearchHref, buildStoryHref } from "../data/readerFlow";
import { useReaderHomeQuery } from "../reader/readerHooks";

const desktopReaderFeatures = [
  {
    icon: "psychology",
    title: "AI-Powered Discovery",
    description:
      "Our advanced engine learns your tastes to recommend your next obsession with uncanny precision.",
  },
  {
    icon: "groups",
    title: "Active Community",
    description:
      "Join thousands of readers in chapter-by-chapter discussions, theories, and fan art galleries.",
  },
  {
    icon: "format_paint",
    title: "Total Personalization",
    description:
      "Customize your reading space with immersive themes, custom fonts, and atmospheric background sounds.",
  },
];

const mobileFeatures = [
  {
    icon: "psychology",
    title: "AI-Powered Discovery",
    description:
      "Our engine understands your taste profile to suggest stories that resonate with your deepest interests, not just keywords.",
  },
  {
    icon: "groups",
    title: "Vibrant Community",
    description:
      "Join millions of readers in live discussions, theory crafting, and direct feedback loops with your favorite authors.",
  },
  {
    icon: "diamond",
    title: "Personalized Experience",
    description:
      "Customize fonts, themes, and interactive paths in select stories to make every reading journey uniquely yours.",
  },
];

function getHomeErrorMessage(error) {
  if (error?.status === 404) {
    return "The public story shelves are empty right now. Publish stories in the backend to populate the homepage.";
  }

  return (
    error?.message || "We could not load the live homepage catalog right now."
  );
}

function LiveCatalogNotice({ compact, message }) {
  return (
    <div className={`border border-primary/10 bg-primary/5 text-center ${compact ? "rounded-xl p-3" : "rounded-2xl p-6"}`}>
      <h4 className={compact ? "text-sm font-bold" : "text-lg font-bold"}>Live catalog unavailable</h4>
      
    </div>
  );
}

function DesktopHome({
  creatorBenefits,
  featuredStory,
  homeError,
  isHomeLoading,
  trendingStories,
}) {
  const trendingHref = buildSearchHref(
    trendingStories[0]?.genreLabel ?? featuredStory?.genres?.[0],
  );

  return (
    <div className="hidden bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <PublicNav showSearch />

        <main className="flex-grow mt-16">
          <section className="relative w-full px-4 py-10 md:px-10 md:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-slate-900 p-6 text-center dark:bg-primary/5 md:min-h-[600px] md:p-12">
                <div className="absolute inset-0 z-0 opacity-60 mix-blend-overlay">
                  <img
                    alt="Mystical library with floating magical books and golden light"
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2fSowUokhR7_eUhHeI9ZZSDcameWfMGEwYO46U1RnaTCn3BGvrVRJ3Jak1O4z0HR1wcx2cBrWRegfF8TusiUMi0j539SWwdTbJA2HBzArMLi5usEo1rVYbwFGqEgCpHngxVont_SIvS9XFWwg0j-oFwFm07uRoBrYsMWUGdSU1clB_k2ck7NKMfmszlxbWXBKC_dsJGRpsBmA321I8eB3AnXbPb2tumpIYYvV6LX-rLLmyRCecWV1zsP1xFU4EC7700G0yD-6jFc"
                  />
                </div>
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />

                <Reveal className="relative z-10 max-w-3xl" distance={18}>
                  <span className="mb-6 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-background-dark">
                    Discover the Extraordinary
                  </span>
                  <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl">
                    <>
                      Your next epic adventure{" "}
                      <span className="italic text-primary">begins here</span>
                    </>
                  </h1>
                  <p className="mb-10 text-lg font-light leading-relaxed text-slate-200 md:text-xl">
                    Immerse yourself in thousands of worlds crafted by the
                    world's most talented independent storytellers.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <motion.div
                      className="flex"
                      transition={{ duration: 0.22 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 30px rgba(244,192,37,0.4)",
                      }}
                      whileTap={{ scale: 0.98 }}>
                      <Link
                        className="flex h-14 min-w-[180px] items-center justify-center gap-2 rounded-xl bg-primary px-8 text-lg font-bold text-background-dark"
                        to="/auth">
                        <Icon name="auto_stories" className="h-5 w-5" />
                        Start Reading
                      </Link>
                    </motion.div>
                    <motion.div
                      className="flex"
                      transition={{ duration: 0.22 }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(255,255,255,0.18)",
                      }}
                      whileTap={{ scale: 0.98 }}>
                      <Link
                        className="flex h-14 min-w-[180px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-lg font-bold text-white backdrop-blur-sm"
                        to="/writer-benefits">
                        <Icon name="edit_note" className="h-5 w-5" />
                        Start Writing
                      </Link>
                    </motion.div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <Reveal as="section" className="px-4 py-12 md:px-10">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    <Icon name="trending_up" className="h-7 w-7 text-primary" />
                    Trending Stories
                  </h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    What everyone is talking about this week
                  </p>
                </div>
                <Link
                  className="flex items-center gap-1 font-bold text-primary hover:underline"
                  to={trendingHref}>
                  See all{" "}
                  <Icon name="chevron_right" className="h-4 w-4" />
                </Link>
              </div>
              {isHomeLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size={48} />
                </div>
              ) : homeError ? (
                <LiveCatalogNotice message={getHomeErrorMessage(homeError)} />
              ) : trendingStories.length ? (
                <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto pb-6">
                  {trendingStories.map((story) => (
                    <Link
                      className="block"
                      key={story.slug}
                      to={buildStoryHref(story.slug)}>
                      <motion.article
                        className="group w-64 flex-shrink-0 cursor-pointer snap-start"
                        transition={{ duration: 0.24 }}
                        whileHover={{ y: -8 }}>
                        <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-2xl shadow-lg">
                          <img
                            alt={story.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src={story.coverImage}
                          />
                          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-primary backdrop-blur-md">
                            <span className="material-symbols-outlined fill-1 text-xs">
                              star
                            </span>
                            {story.averageRating.toFixed(1)}
                          </div>
                        </div>
                        <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
                          {story.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {story.authorName} • {story.genreLabel}
                        </p>
                      </motion.article>
                    </Link>
                  ))}
                </div>
              ) : (
                <LiveCatalogNotice message="Publish stories to populate the live trending shelf." />
              )}
            </div>
          </Reveal>

          <Reveal as="section" className="bg-primary/5 py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-10">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Built for the Modern Reader
                </h2>
                <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
                  Experience storytelling like never before with features
                  designed for complete immersion.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {desktopReaderFeatures.map((feature, index) => (
                  <motion.article
                    className="rounded-2xl border border-primary/10 bg-background-light p-8 shadow-xl dark:bg-background-dark"
                    key={feature.title}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    whileHover={{ y: -6, borderColor: "rgba(244,192,37,0.4)" }}>
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-3xl">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                    <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="overflow-hidden px-4 py-24 md:px-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center gap-16 lg:flex-row">
                <div className="relative lg:w-1/2">
                  <div className="absolute -left-10 -top-10 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
                  <motion.img
                    alt="Writer working on a laptop with golden sunlight across the desk"
                    className="relative z-10 w-full rounded-3xl shadow-2xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXcCtcZQrZPXf2crIBGXMpiCijljevXpUXoYlVhWlN9JVqr9BzqI8SYb9PQBDQLr_Vw9ee-TtGgcnRIHEjXeAkTf4edHL4a-t6BFbmNgewkWtwDsDhEOZdqiEmCWJkcxbdKeiOyqNftGDH9e-szrj86sasBWMmO8ksIP-fxFfwXY9Njm7TC_I-o04j9t1KroNEyPRL43axZipTIkGReAUc8_fLg6ED4IUV1r224OqFXMrUAmY9MSH8EETBEWkxWVZmdHSdKPaQYhA"
                    transition={{ duration: 0.35 }}
                    whileHover={{ scale: 1.01 }}
                  />
                  <div className="absolute -bottom-6 -right-6 z-20 max-w-[200px] rounded-2xl bg-primary p-6 shadow-xl">
                    <p className="text-center font-bold text-background-dark">
                      Creator Studio 2.0 Now Live
                    </p>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <h2 className="mb-6 text-4xl font-extrabold tracking-tight">
                    Unleash your{" "}
                    <span className="text-primary">Creative Empire</span>
                  </h2>
                  <p className="mb-10 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                    TaleStead isn't just a platform; it's a launchpad for your
                    career. We provide the tools you need to write, grow, and
                    monetize your passion.
                  </p>
                  {creatorBenefits.length ? (
                    <ul className="space-y-6">
                      {creatorBenefits.map((benefit) => (
                        <li className="flex gap-4" key={benefit.title}>
                          <span className="material-symbols-outlined font-bold text-primary">
                            check_circle
                          </span>
                          <div>
                            <h4 className="text-lg font-bold">
                              {benefit.title}
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400">
                              {benefit.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <LiveCatalogNotice message="Creator benefits will appear here once the landing content feed is available." />
                  )}
                  <div className="mt-12 flex flex-wrap items-center gap-4">
                    <motion.div
                      className="flex"
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}>
                      <Link
                        className="flex h-14 items-center rounded-xl bg-primary px-10 text-lg font-bold text-background-dark"
                        to="/auth">
                        Open Your Studio
                      </Link>
                    </motion.div>
                    <Link
                      className="text-primary font-semibold transition-colors hover:underline"
                      to="/writer-benefits">
                      View writer benefits →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-10">
              <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-12 text-center dark:bg-primary/5 md:p-20">
                <div className="absolute inset-0 z-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                </div>
                <div className="relative z-10">
                  <h2 className="mb-8 text-3xl font-extrabold text-white md:text-5xl">
                    Join 50,000+ readers and writers worldwide
                  </h2>
                  <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-300 md:text-xl">
                    Start your journey today. Whether you're looking for your
                    next obsession or ready to share your own story, there's a
                    place for you in our circle.
                  </p>
                  <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                    <div className="text-center">
                      <div className="mb-2 text-4xl font-black text-primary md:text-5xl">
                        12M+
                      </div>
                      <div className="text-sm font-medium uppercase tracking-widest text-slate-400">
                        Monthly Reads
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 text-4xl font-black text-primary md:text-5xl">
                        150K+
                      </div>
                      <div className="text-sm font-medium uppercase tracking-widest text-slate-400">
                        Stories Published
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 text-4xl font-black text-primary md:text-5xl">
                        4.9/5
                      </div>
                      <div className="text-sm font-medium uppercase tracking-widest text-slate-400">
                        App Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </main>

        <AppFooter variant="full" />
      </div>
    </div>
  );
}

function ReaderParadiseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pageSize = el.scrollWidth / mobileFeatures.length;
    const index = Math.round(el.scrollLeft / pageSize);
    setActiveIndex(Math.max(0, Math.min(index, mobileFeatures.length - 1)));
  }, []);

  const goToSlide = useCallback((index) => {
    const el = scrollRef.current;
    if (!el) return;
    const pageSize = el.scrollWidth / mobileFeatures.length;
    el.scrollTo({ left: index * pageSize, behavior: "smooth" });
  }, []);

  return (
    <Reveal as="section" className="space-y-4 px-3 py-6">
      <div className="flex flex-col items-center space-y-1.5 text-center">
        <h3 className="text-lg font-bold">A Reader's Paradise</h3>
        <div className="h-0.5 w-8 rounded-full bg-primary" />
      </div>
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={handleScroll}
      >
        {mobileFeatures.map((feature, index) => (
          <motion.article
            className="relative flex w-[85vw] min-w-[85vw] flex-shrink-0 snap-center flex-col gap-2 rounded-xl border border-slate-100/10 bg-gradient-to-br from-slate-100/5 to-transparent p-4"
            key={feature.title}
            initial={{ opacity: 0.8, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.05 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
            </div>
            <h4 className="text-sm font-bold text-primary">{feature.title}</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              {feature.description}
            </p>
          </motion.article>
        ))}
      </div>
      <div className="flex justify-center gap-1.5">
        {mobileFeatures.map((_, i) => (
          <motion.button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-slate-300 dark:bg-slate-600"
            }`}
            onClick={() => goToSlide(i)}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        ))}
      </div>
    </Reveal>
  );
}

function MobileHome({
  featuredStory,
  homeError,
  isHomeLoading,
  trendingStories,
}) {
  const trendingHref = buildSearchHref(
    trendingStories[0]?.genreLabel ?? featuredStory?.genres?.[0],
  );

  return (
    <div className="bg-background-light font-display text-slate-900 transition-colors duration-300 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <PublicNav compact />

      <main className="pb-12 mt-12">
        <section className="relative overflow-hidden px-4 pb-12 pt-6">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background-dark/60 to-background-dark" />
            <img
              alt="Cinematic library with floating golden dust particles"
              className="h-[500px] w-full object-cover opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyG3r-EEqU5bPZ3D4VuFlRhBHyo0Zlzsul6dXbaf0fxAUbYZO2h-ZmSJ0HF-fjDs8AYWBrxfUkZx9o2k4kG1ZR4u8-jW1rPgkHf68KLW_vpAD-qP1RimgElRNH5ZcJ0Kah-KQl2RmgiWqVf6A1Ox5nHW4qvkXTZVz7iER6ljXaVu39hbBmufRdaxnG47EAS70l86R9zI2cu4ciBYoNLIZWhy0Qjbe6Vb-bzEa6-It1y3qmmA6ys-o4ayuGHAnhNpYsYMwXKOz2xaY"
            />
          </div>
          <Reveal className="relative z-20 mt-24 flex flex-col items-center space-y-3 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              The Future of Narrative
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
              <>
                Enter Your Next <br />
                <span className="italic text-primary">Great Story</span>
              </>
            </h2>
            <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-slate-400">
              Immerse yourself in worlds crafted by AI and boundless human imagination.
            </p>
            <div className="flex w-full flex-row gap-2 pt-2">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20"
                  to="/auth"
                >
                  <span className="material-symbols-outlined text-lg">auto_stories</span>
                  Read
                </Link>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-100/20 bg-slate-100/10 py-3 text-sm font-bold text-slate-100 backdrop-blur-sm"
                  to="/writer-benefits"
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                  Write
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </section>

        <Reveal as="section" className="py-4">
          <div className="mb-3 flex items-center justify-between px-3">
            <h3 className="text-base font-bold">Trending</h3>
            <Link
              className="flex items-center gap-0.5 text-xs font-medium text-primary"
              to={trendingHref}
            >
              See All
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </Link>
          </div>
          {isHomeLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size={36} />
            </div>
          ) : homeError ? (
            <div className="px-3">
              <LiveCatalogNotice compact message={getHomeErrorMessage(homeError)} />
            </div>
          ) : trendingStories.length ? (
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-3">
              {trendingStories.slice(0, 3).map((story) => (
                <Link className="block w-36 flex-none" key={story.slug} to={buildStoryHref(story.slug)}>
                  <motion.article className="group" whileHover={{ y: -4 }}>
                    <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-lg border border-slate-100/10">
                      <img
                        alt={story.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={story.coverImage}
                      />
                      <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-primary backdrop-blur-md">
                        <span className="material-symbols-outlined fill-1 text-[10px]">star</span>
                        {story.averageRating.toFixed(1)}
                      </div>
                    </div>
                    <h4 className="line-clamp-1 text-xs font-bold">{story.title}</h4>
                    <p className="text-[10px] text-slate-500">{story.genreLabel}</p>
                  </motion.article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-3">
              <LiveCatalogNotice compact message="Publish stories to populate the live trending shelf." />
            </div>
          )}
        </Reveal>

        <ReaderParadiseCarousel />

        <Reveal as="section" className="mx-3 my-4 overflow-hidden rounded-2xl bg-primary p-5">
          <div className="absolute" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-black leading-tight text-background-dark">
              Unleash Your Creative Empire
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-background-dark">80%</span>
                <span className="text-[10px] font-medium uppercase text-background-dark/70">
                  Rev Share
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-background-dark">1.2M+</span>
                <span className="text-[10px] font-medium uppercase text-background-dark/70">
                  Authors
                </span>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                className="flex items-center justify-center gap-1.5 rounded-lg bg-background-dark px-4 py-2.5 text-sm font-bold text-primary"
                to="/auth"
              >
                Open Your Studio
                <span className="material-symbols-outlined text-base">rocket_launch</span>
              </Link>
            </motion.div>
          </div>
        </Reveal>

        <AppFooter className="mt-8" variant="full" />
      </main>

    </div>
  );
}

export default function HomePage() {
  const { data, error, isLoading } = useReaderHomeQuery();

  if (isLoading && !data) {
    return <PageLoadingSpinner />;
  }

  return (
    <>
      <DesktopHome
        creatorBenefits={data?.creatorBenefits ?? []}
        featuredStory={data?.featured ?? null}
        homeError={error}
        isHomeLoading={isLoading}
        trendingStories={data?.trendingStories ?? []}
      />
      <MobileHome
        featuredStory={data?.featured ?? null}
        homeError={error}
        isHomeLoading={isLoading}
        trendingStories={data?.trendingStories ?? []}
      />
    </>
  );
}
