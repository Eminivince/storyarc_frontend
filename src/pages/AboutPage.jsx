import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PublicNav from "../components/PublicNav";
import Reveal from "../components/Reveal";
import MaterialSymbol from "../components/MaterialSymbol";

const readerHighlights = [
  {
    icon: "auto_awesome",
    title: "Immersive Experiences",
    description:
      "Lose yourself in atmospheric storytelling enhanced by multimedia elements. Our reader-centric design ensures every chapter feels like a journey, not just a scroll.",
  },
  {
    icon: "travel_explore",
    title: "Personalized Discovery",
    description:
      "Find your next favorite story with our AI-powered recommendation engine that understands your taste deeper than just genres, identifying themes and vibes you love.",
  },
];

const writerHighlights = [
  {
    icon: "payments",
    title: "Creator-First Monetization",
    description:
      "Fair splits and multiple revenue streams including tips, subscriptions, and dynamic unlockable content.",
    width: "w-2/3",
  },
  {
    icon: "public",
    title: "Global Reach",
    description:
      "Our AI-assisted translation and localization tools help your story resonate with readers across cultures and languages.",
    width: "w-1/2",
  },
  {
    icon: "construction",
    title: "Rich Creative Tools",
    description:
      "Advanced analytics, character trackers, and world-building wikis integrated directly into your writing dashboard.",
    width: "w-4/5",
  },
];

const mobileOffers = [
  {
    icon: "auto_stories",
    title: "For Readers",
    description:
      "Dive into a universe of undiscovered worlds. From epic fantasy to intimate memoirs, find stories you won't see anywhere else.",
    points: ["Personalized Recommendations", "Offline Reading Mode"],
  },
  {
    icon: "edit_note",
    title: "For Writers",
    description:
      "Your first draft deserves a standing ovation. We provide the analytics, community feedback, and tools to perfect your craft.",
    points: ["Direct-to-Fan Monetization", "Advanced Writing Suite"],
  },
];

function DesktopAbout() {
  return (
    <div className="hidden bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <PublicNav ctaLabel="Get Started" variant="dark" />

      <main className="w-full">
        <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-background-dark/40 via-background-dark/70 to-background-dark" />
            <div
              className="h-full w-full scale-105 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2X8A4zGSegWvHRxCfh6x0xYsfkPs-EtZJhKot4EbdLOOeVGCqh3SHv_GF4uhwCbj61ASLONSdYMGaFlT53FTVCAYHxodig3ULy5Dci-1-noXq79bj81JZJMwofUEEVQWWWe0lJuMb8irbrRQKgDaGUobylhxaAjwjx4MWaWIaUAaMhAJRBWM3p0eOlhxCOMJfsYk6lIMBSkOkeLglszUgNNdBzNwBdybPwbxKFKHZJiXeJkqHZiBMeiOLFDj_hxr5y1mVB34s_No')",
              }}
            />
          </div>
          <Reveal className="relative z-20 mx-auto max-w-4xl px-6 text-center" distance={16}>
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary">
              Our Vision
            </span>
            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter text-white md:text-7xl">
              Empowering the next generation of{" "}
              <span className="text-primary">storytellers</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl">
              TaleStead is a premium webnovel platform where imagination meets
              AI potential, creating a sanctuary for creators and a playground
              for readers.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  className="rounded-xl bg-primary px-8 py-4 text-lg font-bold text-background-dark shadow-xl shadow-primary/10"
                  to="/auth"
                >
                  Start Reading
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.18)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md"
                  to="/creator"
                >
                  Join as Writer
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </section>

        <Reveal as="section" className="bg-background-dark px-6 py-24 md:px-20">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-[80px]" />
              <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl">
                Our Mission
              </h2>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-slate-300">
                  At TaleStead, we believe that the soul of every great story
                  lies in human imagination. However, the future of literature
                  is being shaped by the symbiotic relationship between authors
                  and technology.
                </p>
                <p className="border-l-4 border-primary py-2 pl-6 text-lg italic leading-relaxed text-slate-400">
                  "Bridging the gap between human imagination and AI potential
                  to create a new era of digital literature."
                </p>
                <p className="text-lg leading-relaxed text-slate-300">
                  We are building the tools and the community to ensure that as
                  storytelling evolves, it becomes more accessible, more
                  immersive, and more rewarding for those who dare to dream.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <motion.div
                  className="h-64 rounded-2xl bg-cover bg-center shadow-2xl"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxDtBS37F30kK4par3yIUblegYv7VoEcafu4D2JHRENMHshas1qwJr9IWja-Ldp07KqPWcl2bSVjkmbz5J4xIGWzMAyvRiUxo97IQZrxuk4mdFFLD8kFs5miMeHtHCI87LZJCnA3IBligzSdfSITBsAyemE2EAqorvBLuUgNuxXls0jORdEMbTVVTaPGU47TeSVVGgeOgA5dQHnm9NfXWksqOLPbPqB6bJD8kJ8iRwg65m6_ImsbKx1JXcBOkUFwsDjFZ4wvmOMik')",
                  }}
                  whileHover={{ scale: 1.02 }}
                />
                <div className="flex h-40 items-center justify-center rounded-2xl border border-primary/30 bg-primary/20">
                  <MaterialSymbol name="lightbulb" className="text-6xl text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex h-40 items-center justify-center rounded-2xl border border-accent-dark bg-accent-dark">
                  <MaterialSymbol name="psychology" className="text-6xl text-slate-400" />
                </div>
                <motion.div
                  className="h-64 rounded-2xl bg-cover bg-center shadow-2xl"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJuTr9LHksJfPR22PCFmyOYlKPhGdIty99UlD_sA3nwoZHKxrp5OkUve8tRX7hDpUKY7mtS6FQVHJ4oVxM3MbQq5LumzZN5hcSKfJbEe6QdcQdUqdbbSthw2VehS-8a6SRMuLkFXcwG4sS8R-vln7nE28jjkpQFLAvLFDb8bDaSD_1tTou1rPep7LrArKmarPMlBxSFiJP8uyK-Yt31UMOaEPkH6KUk3T6EgkQNB6N7PWlInFzUuzQkhcbGTV__A0efPJpX9NW5l8')",
                  }}
                  whileHover={{ scale: 1.02 }}
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="bg-accent-dark/20 px-6 py-24 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col items-center text-center">
              <span className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
                The Experience
              </span>
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                For Readers
              </h2>
              <p className="max-w-2xl text-slate-400">
                Dive into worlds crafted with passion and polished with
                precision. Experience the next evolution of digital reading.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {readerHighlights.map((item) => (
                <motion.article
                  className="group rounded-2xl border border-accent-dark bg-background-dark p-8 transition-all hover:border-primary/50"
                  key={item.title}
                  whileHover={{ y: -6 }}
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                    <MaterialSymbol name={item.icon} className="text-primary group-hover:text-background-dark" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="relative overflow-hidden bg-background-dark px-6 py-24 md:px-20">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-primary/5 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
              <div className="max-w-xl">
                <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary">
                  The Creative Hub
                </span>
                <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                  For Writers
                </h2>
                <p className="text-slate-400">
                  We prioritize the creator. Our platform is built from the
                  ground up to support your artistic vision and your career
                  growth.
                </p>
              </div>
              <motion.button
                className="rounded-lg border border-primary/20 bg-primary/10 px-6 py-3 font-bold text-primary transition-all"
                type="button"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(244,192,37,0.18)", color: "#181611" }}
                whileTap={{ scale: 0.98 }}
              >
                View Creator Handbook
              </motion.button>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {writerHighlights.map((item) => (
                <motion.article
                  className="flex h-full flex-col rounded-2xl border border-accent-dark bg-accent-dark/30 p-8"
                  key={item.title}
                  whileHover={{ y: -6, borderColor: "rgba(244,192,37,0.35)" }}
                >
                  <MaterialSymbol name={item.icon} className="mb-6 text-4xl text-primary" />
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mb-8 flex-grow text-slate-400">
                    {item.description}
                  </p>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-primary/20">
                    <div className={`h-full rounded-full bg-primary ${item.width}`} />
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="mt-16 flex flex-col items-center gap-10 rounded-3xl border border-accent-dark bg-accent-dark/10 p-8 md:flex-row md:p-12">
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Ready to write your legacy?
                </h3>
                <p className="text-slate-400">
                  Join a community of thousands of creators who are already
                  defining the future of digital fiction.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  className="whitespace-nowrap rounded-xl bg-primary px-10 py-4 text-lg font-bold text-background-dark"
                  to="/creator"
                >
                  Create Your Story
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="border-t border-accent-dark/30 bg-background-dark py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Stay in the Loop
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-slate-400">
              Get notified about new features, writing contests, and the best
              stories curated just for you.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                className="flex-1 rounded-xl border-none bg-accent-dark px-4 py-3 text-base text-white focus:ring-1 focus:ring-primary"
                placeholder="Enter your email"
                type="email"
              />
              <motion.div
                whileHover={{ scale: 1.03, filter: "brightness(1.08)" }}
                whileTap={{ scale: 0.98 }}
              >
                <button className="rounded-xl bg-primary px-6 py-3 font-bold text-background-dark" type="button">
                  Subscribe
                </button>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </main>

      <AppFooter variant="full" />
    </div>
  );
}

function MobileAbout() {
  return (
    <div className="flex min-h-screen flex-col bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <PublicNav compact variant="dark" />

      <main className="flex-1 pb-8 pt-12">
        <section className="relative flex h-[50vh] min-h-[280px] w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
            <img
              alt="Close up of fountain pen writing"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjC2VbMcoofBUwPCcGfXrEZ3at1crLnr9lKq-olQ9-TaNLMHlF9i42n7rqFe1iocx_N0aXYAlPvslN9KxOb-QIra-p_KETF_o5i1ws7Iak28n8HJSk6XYbSu8vFLLeRv7uvmFuh-wfzBsOZGWhh5hMXN1nHHw9blqHXDeYBeSGbpNtJYob5mPCrv5X7r4ug4-XfO2La-HIiAve_8SmGZpSrioUQpZrAPn_cJC7-wxFCuI-ZrYj1Lufd_pVOFlpFkR2BcQ6kQ0lWbQ"
            />
          </div>
          <Reveal className="relative z-20 space-y-3">
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-slate-100">
              Empowering the next generation of{" "}
              <span className="text-primary">storytellers</span>
            </h1>
            <p className="mx-auto max-w-[260px] text-sm font-normal text-slate-300">
              Where every voice finds its stage and every story finds its home.
            </p>
            <div className="pt-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-background-dark shadow-lg shadow-primary/20"
                  to="/auth"
                >
                  Join the Journey
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </section>

        <Reveal as="section" className="space-y-4 px-4 py-6">
          <div className="inline-block border-l-4 border-primary pl-3">
            <h2 className="font-display text-lg font-bold uppercase tracking-widest text-primary/80">
              Our Mission
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            To cultivate a global community where creativity knows no bounds. We
            bridge the gap between imagination and publication, providing tools
            that turn aspiring writers into celebrated authors.
          </p>
          <div className="overflow-hidden rounded-lg shadow-2xl">
            <img
              alt="Atmospheric stack of old vintage books"
              className="h-36 w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOjhgcIx--cgeBZutGcmZKlxn5BMvDWwQadJyvGUb5AJJEskmIEK71hWAs4gMmNwZpcvoJB87POAx4-T4UzahX4eHTb4a2dXuP0_KBFb5kF1e_H12WTvh4h45Cm0rMOl1NOspBnRn50rhXQb_z_rg2ovhJNPehbtIA8djxNE972X-I5A67OIffQp-TKk0X87WJ_JeaIMfgKim_6JXrZKQgSAuE-oq4biFoO2WN3bl9FMc35PiP9lSVW2qh1F_h_Z2krZ2ZobXAmfE"
            />
          </div>
        </Reveal>

        <Reveal as="section" className="space-y-4 bg-primary/5 px-4 py-6 dark:bg-primary/5">
          <h2 className="mb-4 text-center font-display text-xl font-bold">
            What We Offer
          </h2>
          {mobileOffers.map((offer) => (
            <motion.article
              className="space-y-2 rounded-xl border border-primary/10 bg-white p-4 shadow-sm dark:bg-white/5"
              key={offer.title}
              whileHover={{ y: -2 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <MaterialSymbol name={offer.icon} className="text-2xl" />
              </div>
              <h3 className="font-display text-base font-bold">{offer.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {offer.description}
              </p>
              <ul className="space-y-1 pt-1">
                {offer.points.map((point) => (
                  <li
                    className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
                    key={point}
                  >
                    <MaterialSymbol name="check_circle" className="text-base text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </Reveal>

        <Reveal as="section" className="space-y-4 px-4 py-8 text-center">
          <h2 className="font-display text-xl font-bold">Ready to begin?</h2>
          <p className="mx-auto max-w-[260px] text-sm text-slate-600 dark:text-slate-400">
            Join thousands of creators and readers today. Your next great
            adventure starts here.
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              className="block w-full rounded-xl bg-primary py-3 text-sm font-extrabold uppercase tracking-widest text-background-dark shadow-xl shadow-primary/30"
              to="/auth"
            >
              Create Your Story
            </Link>
          </motion.div>
        </Reveal>

        <AppFooter className="py-8" />
      </main>

    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <DesktopAbout />
      <MobileAbout />
    </>
  );
}
