import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogoBrand } from "./LogoBrand";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "About", href: "/about" },
  { label: "Write", href: "/writer-benefits" },
];

/**
 * Shared navigation for public/unauthenticated pages (Home, About, Writer Benefits, Auth, Privacy, Terms).
 */
export default function PublicNav({
  compact = false,
  ctaHref = "/auth",
  ctaLabel = "Log In / Sign Up",
  showCta = true,
  showSearch = false,
  variant = "light",
}) {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = variant === "dark";
  const headerClasses = isDark
    ? "border-neutral-border/50 bg-background-dark/90 text-slate-100"
    : "bg-background-light/80 text-slate-900 dark:bg-background-dark/80 dark:text-slate-100";
  const linkClasses = isDark
    ? "text-slate-300 hover:text-primary"
    : "text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary";
  const activeLinkClasses = "font-semibold text-primary";

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b backdrop-blur-md md:px-6 lg:px-10 ${compact ? "px-3 py-1.5 md:px-6 md:py-3" : "px-4 py-3"} ${headerClasses}`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between ${compact ? "gap-2 md:gap-4" : "gap-4"}`}>
        <LogoBrand compact={compact} to="/" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className={`text-sm font-medium transition-colors ${linkClasses} ${
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  ? activeLinkClasses
                  : ""
              }`}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          {showCta && (
            <Link
              className="hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-background-dark transition-colors hover:bg-primary/90 sm:inline-flex"
              to={ctaHref}
            >
              {ctaLabel}
            </Link>
          )}
          <motion.button
            animate={{ scale: 1 }}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
            className={`rounded-lg md:hidden ${compact ? "p-1.5" : "p-2"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.92 }}
            type="button"
          >
            <span className={`material-symbols-outlined ${compact ? "text-2xl" : ""}`}>
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden md:hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
              height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <div className={`flex flex-col border-t border-primary/10 ${compact ? "mt-2 gap-0.5 pt-2" : "mt-3 gap-1 pt-3"}`}>
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -12 }}
                  key={item.href}
                  transition={{
                    duration: 0.25,
                    delay: 0.05 + index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    className={`block rounded-lg font-medium transition-colors active:scale-[0.98] ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} ${linkClasses} ${
                      pathname === item.href ? activeLinkClasses : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {showCta && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -12 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.05 + NAV_ITEMS.length * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    className={`block rounded-lg bg-primary text-center font-bold text-background-dark transition-transform active:scale-[0.98] ${compact ? "mt-1.5 px-3 py-2 text-xs" : "mt-2 px-4 py-3 text-sm"}`}
                    onClick={() => setMobileMenuOpen(false)}
                    to={ctaHref}
                  >
                    {ctaLabel}
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
