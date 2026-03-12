import { Link } from "react-router-dom";

const lastUpdated = "March 12, 2026";

const privacySections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    paragraphs: [
      "We collect several types of information to operate and improve the Service.",
    ],
    subsections: [
      {
        title: "1.1 Information You Provide",
        paragraphs: [
          "When you create an account or interact with the Service, you may provide:",
        ],
        bullets: [
          "Name or username",
          "Email address",
          "Password (stored in encrypted form)",
          "Profile information (bio, avatar, preferences)",
          "Payment information (processed via third-party providers)",
          "Creator payout information (bank account or payment processor details)",
          "Content you publish (stories, chapters, comments, reviews)",
        ],
        closing:
          "Creators may also provide additional information required for monetization programs.",
      },
      {
        title: "1.2 Reading and Usage Data",
        paragraphs: [
          "To operate a serialized reading platform, we collect usage data such as:",
        ],
        bullets: [
          "Stories you read",
          "Chapters unlocked",
          "Reading progress",
          "Time spent reading",
          "Likes, ratings, bookmarks, and comments",
          "Search queries",
        ],
        closing:
          "This information helps power features such as personalized recommendations, reading progress synchronization, and content discovery.",
      },
      {
        title: "1.3 Device and Technical Data",
        paragraphs: [
          "When you access the Service, we may automatically collect:",
        ],
        bullets: [
          "IP address",
          "Browser type",
          "Device type",
          "Operating system",
          "App version",
          "Log data (timestamps, request data)",
        ],
        closing:
          "This information helps maintain platform stability, security, and performance.",
      },
      {
        title: "1.4 Payment and Transaction Data",
        paragraphs: [
          "If you purchase coins, credits, or premium chapters, payments are processed by third-party payment providers.",
          "We may receive transaction metadata such as transaction ID, purchase amount, and payment status.",
          "We do not store full credit card information on our servers.",
        ],
      },
      {
        title: "1.5 Cookies and Tracking Technologies",
        paragraphs: [
          "We may use cookies and similar technologies to:",
        ],
        bullets: [
          "Maintain login sessions",
          "Remember user preferences",
          "Measure platform performance",
          "Improve recommendation systems",
          "Detect fraud or abuse",
        ],
        closing:
          "Users may control cookie settings through their browser.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    paragraphs: [
      "We use collected information to operate and improve the Service.",
    ],
    subsections: [
      {
        title: "Core Platform Operations",
        bullets: [
          "Creating and managing user accounts",
          "Delivering serialized stories and chapters",
          "Tracking reading progress",
          "Processing purchases and payments",
          "Enabling creator monetization",
        ],
      },
      {
        title: "Platform Improvements",
        bullets: [
          "Improving recommendation algorithms",
          "Personalizing story suggestions",
          "Optimizing reading experience",
        ],
      },
      {
        title: "Safety and Security",
        bullets: [
          "Detecting fraud or abuse",
          "Preventing unauthorized access",
          "Enforcing platform rules",
        ],
      },
      {
        title: "Communications",
        paragraphs: ["We may use your information to:"],
        bullets: [
          "Send service notifications",
          "Provide updates about the platform",
          "Respond to support requests",
        ],
        closing: "Users may opt out of non-essential communications.",
      },
    ],
  },
  {
    id: "how-we-share-information",
    title: "3. How We Share Information",
    paragraphs: ["We do not sell personal data to third parties."],
    subsections: [
      {
        title: "3.1 Service Providers",
        paragraphs: [
          "We may share information with trusted third-party providers that help operate the platform, including:",
        ],
        bullets: [
          "Payment processors",
          "Cloud hosting providers",
          "Analytics services",
          "Customer support tools",
        ],
        closing:
          "These providers may only use the information to perform services on our behalf.",
      },
      {
        title: "3.2 Creator Payments",
        paragraphs: [
          "If you participate in creator monetization programs, your payout information may be shared with payment processors and financial service providers for the purpose of transferring earnings.",
        ],
      },
      {
        title: "3.3 Legal Compliance",
        paragraphs: [
          "We may disclose information if required to:",
        ],
        bullets: [
          "Comply with legal obligations",
          "Respond to lawful government requests",
          "Enforce our Terms of Service",
          "Protect users or the platform from harm",
        ],
      },
      {
        title: "3.4 Business Transfers",
        paragraphs: [
          "If the platform undergoes a merger, acquisition, or sale of assets, user data may be transferred as part of the transaction.",
        ],
      },
    ],
  },
  {
    id: "public-information",
    title: "4. Public Information",
    paragraphs: [
      "Some information is visible to other users, including:",
    ],
    bullets: [
      "Your username",
      "Profile information",
      "Stories and chapters you publish",
      "Comments and reviews",
    ],
    closing:
      "Creators should understand that published stories and related content are publicly accessible unless otherwise restricted by platform features.",
  },
  {
    id: "data-retention",
    title: "5. Data Retention",
    paragraphs: [
      "We retain personal information only for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements.",
      "Users may request account deletion subject to applicable legal requirements.",
    ],
  },
  {
    id: "data-security",
    title: "6. Data Security",
    paragraphs: [
      "We implement reasonable technical and organizational measures to protect user data, including:",
    ],
    bullets: [
      "Encrypted connections (HTTPS)",
      "Password hashing",
      "Restricted access controls",
      "Infrastructure security monitoring",
    ],
    closing:
      "However, no system can guarantee absolute security.",
  },
  {
    id: "childrens-privacy",
    title: "7. Children's Privacy",
    paragraphs: [
      "The Service is not intended for children under the age of 13, or the minimum legal age in your jurisdiction.",
      "If we become aware that we have collected personal data from a child without appropriate consent, we will take steps to delete that information.",
    ],
  },
  {
    id: "privacy-rights",
    title: "8. Your Privacy Rights",
    paragraphs: [
      "Depending on your location, you may have certain rights regarding your personal data.",
      "These may include:",
    ],
    bullets: [
      "Access to personal data we hold about you",
      "Correction of inaccurate information",
      "Deletion of personal data",
      "Restriction of processing",
      "Data portability",
    ],
    closing:
      "Requests may be submitted using the contact information below.",
  },
  {
    id: "international-transfers",
    title: "9. International Data Transfers",
    paragraphs: [
      "Your information may be processed or stored in countries outside your place of residence.",
      "By using the Service, you consent to such transfers where permitted by law.",
    ],
  },
  {
    id: "changes-to-policy",
    title: "10. Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy periodically.",
      "When updates occur, the revised policy will be posted on this page and the Last Updated date will be revised.",
      "Continued use of the Service after changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    id: "contact-information",
    title: "11. Contact Information",
    paragraphs: [
      "If you have questions about this Privacy Policy, you may contact us:",
    ],
    items: [
      { label: "Email", text: "[Support Email]" },
      { label: "Company", text: "StoryArc Inc." },
      { label: "Address", text: "[Company Address]" },
    ],
  },
];

function PrivacySection({ section }) {
  return (
    <section
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-white/10 dark:bg-white/5 md:p-8"
      id={section.id}
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {section.title}
      </h2>

      <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {section.bullets?.length ? (
          <ul className="list-disc space-y-2 pl-5 marker:text-primary">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}

        {section.subsections?.map((subsection) => (
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-background-dark/40" key={subsection.title}>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              {subsection.title}
            </h3>

            {subsection.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {subsection.bullets?.length ? (
              <ul className="list-disc space-y-2 pl-5 marker:text-primary">
                {subsection.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}

            {subsection.closing ? <p>{subsection.closing}</p> : null}
          </div>
        ))}

        {section.items?.length ? (
          <div className="space-y-3">
            {section.items.map((item) => (
              <p key={item.label}>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {item.label}:
                </span>{" "}
                {item.text}
              </p>
            ))}
          </div>
        ) : null}

        {section.closing ? <p>{section.closing}</p> : null}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background-light/90 backdrop-blur-md dark:bg-background-dark/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 md:px-6 lg:px-10">
          <Link className="flex items-center gap-3 text-primary" to="/">
            <span className="material-symbols-outlined text-3xl">auto_stories</span>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              StoryArc
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
              to="/"
            >
              Home
            </Link>
            <Link
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
              to="/about"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
              to="/terms"
            >
              Terms
            </Link>
          </nav>

          <Link
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background-dark transition-transform hover:scale-[1.02]"
            to="/auth"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-background-dark px-4 py-16 md:px-6 md:py-24 lg:px-10">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-8rem] right-[-5rem] h-80 w-80 rounded-full bg-primary/10 blur-[140px]" />
          </div>

          <div className="relative mx-auto max-w-5xl">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Legal
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              This Privacy Policy explains how StoryArc collects, uses, stores,
              and protects your information when you use our website, mobile
              applications, and related services.
            </p>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </section>

        <section className="px-4 py-10 md:px-6 md:py-14 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[250px,minmax(0,1fr)]">
            <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
              <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  On This Page
                </p>
                <nav className="mt-4 flex flex-col gap-2">
                  {privacySections.map((section) => (
                    <a
                      className="rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-300"
                      href={`#${section.id}`}
                      key={section.id}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="space-y-6">
              {privacySections.map((section) => (
                <PrivacySection key={section.id} section={section} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/10 px-4 py-8 md:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              StoryArc
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Serialized fiction for readers and creators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <Link className="transition-colors hover:text-primary" to="/terms">
              Terms
            </Link>
            <Link className="transition-colors hover:text-primary" to="/privacy">
              Privacy
            </Link>
            <Link className="transition-colors hover:text-primary" to="/auth">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
