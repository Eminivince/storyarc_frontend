import { Link } from "react-router-dom";
import { LogoBrand } from "./LogoBrand";

/**
 * Shared footer used across the app. Based on the Reading Lists / dashboard footer.
 * Use variant="full" for marketing pages (landing, about) with logo and link columns.
 */
export default function AppFooter({ className = "", variant = "default" }) {
  if (variant === "full") {
    return (
      <footer
        className={`border-t border-primary/10 bg-slate-950 px-4 pb-10 pt-20 dark:bg-background-dark md:px-10 ${className}`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <LogoBrand className="mb-6" size="lg" textClassName="text-white" to="/" />
              <p className="mb-8 max-w-sm text-slate-400">
                Empowering the next generation of storytellers. Discover, read,
                and write original fiction across every genre imaginable.
              </p>
              <div className="flex gap-4">
                {["public", "alternate_email", "video_library"].map((icon) => (
                  <a
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-all hover:bg-primary hover:text-background-dark"
                    href="#"
                    key={icon}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mb-6 font-bold text-white">Creators</h4>
              <ul className="space-y-4 text-slate-400">
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    to="/writer-benefits"
                  >
                    Writer Benefits
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    to="/creator"
                  >
                    Creator Studio
                  </Link>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-primary"
                    href="#"
                  >
                    Monetization
                  </a>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-primary"
                    href="#"
                  >
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white">Support</h4>
              <ul className="space-y-4 text-slate-400">
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    to="/account/help"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    to="/about"
                  >
                    About TaleStead
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    to="/terms"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    to="/privacy"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 md:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} TaleStead Inc. All rights reserved.
            </p>
            {/* <div className="flex items-center gap-6">
              <img
                alt="Download on App Store"
                className="h-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUDLAs9GYbfSGtG6s2RmWQ9Cs_lVVehRI4Er6Yh5Ssq8ESVtNPj4sk-EIiOBZLplwx8ynogbwOmYPERTxppjunUCJ5dKaUlDNeW0z0LJijMIMzrkAKH4JxZYL5yf8vs5Csf6m6pEWeVaoRbV8P64bp4yPj5v6hcJKhEXX9SIKxlmO7qZ13Pf_yAmqrC47Mx-GIfunzu34YghOyAYBOb-epL5tQxvQ0ANUjzKSe4nlxqtLgWXjnA8XLsNLlMLHsNwXUjNSTzo1XzkQ"
              />
              <img
                alt="Get it on Google Play"
                className="h-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCauHA_BS6MTA_xucMMgcff3nYWKtOZrbOXoa3M8woBKk6gtuii2IeyyT9xudU9twxHW1YErMBCU9bxGL1E825skwQle-xpSsQ26ZFN_4vMH_T5keu4Ekdf3Q064DZdjuxvbggQVxMxehzPr_ICVF2kHhkOG6KRsDs4WfCrm3BXHxiPrspy15w2na_SXteoHDBWraqPPJs75YoSrAECy8GHGJI6sb98-SMa2A0mRByqLvdP2d2xs6XjwBGyH_gf-F8GSBOMwo6GYEw"
              />
            </div> */}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`flex flex-col items-center justify-between gap-4 border-t border-primary/10 px-4 py-8 text-xs text-slate-500 md:flex-row md:gap-6 md:px-8 ${className}`}
    >
      <p>© {new Date().getFullYear()} TaleStead Inc. All rights reserved.</p>
      <div className="flex gap-6">
        <Link className="transition-colors hover:text-primary" to="/privacy">
          Privacy Policy
        </Link>
        <Link className="transition-colors hover:text-primary" to="/terms">
          Terms of Service
        </Link>
        <Link className="transition-colors hover:text-primary" to="/account/help">
          Help Center
        </Link>
      </div>
    </footer>
  );
}
