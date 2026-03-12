import { Link } from "react-router-dom";

const lastUpdated = "March 12, 2026";

const termsSections = [
  {
    id: "definitions",
    title: "1. Definitions",
    items: [
      { label: "Platform", text: "StoryArc." },
      { label: "User", text: "Any person who accesses or uses the Service." },
      {
        label: "Creator",
        text: "A user who publishes stories or other content.",
      },
      {
        label: "Content",
        text: "Stories, chapters, comments, images, text, or any other material uploaded or published on the platform.",
      },
      {
        label: "Coins / Credits",
        text: "Digital tokens used to unlock premium content on the platform.",
      },
      {
        label: "Premium Content",
        text: "Chapters or stories that require payment or coins to access.",
      },
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    paragraphs: [
      "To use the Service, you must be at least 13 years old, or the minimum age required in your jurisdiction, have the legal capacity to enter into a binding agreement, and comply with all applicable laws when using the Service.",
      "If you are under the age of majority in your jurisdiction, you must use the Service with the consent of a parent or legal guardian.",
    ],
  },
  {
    id: "account-registration",
    title: "3. Account Registration",
    paragraphs: [
      "To access certain features of the Service, you may be required to create an account.",
    ],
    bullets: [
      "The information you provide during registration is accurate and complete.",
      "You will maintain the security of your account credentials.",
      "You are responsible for all activities conducted under your account.",
    ],
    closing:
      "StoryArc reserves the right to suspend or terminate accounts that provide false information or violate these Terms.",
  },
  {
    id: "the-service",
    title: "4. The Service",
    paragraphs: [
      "StoryArc provides a serialized publishing platform where creators may publish stories and readers may discover and read serialized content.",
    ],
    bullets: [
      "Publishing and distributing serialized stories",
      "Unlocking premium chapters using coins or credits",
      "Reader engagement through comments, ratings, and reviews",
      "Creator monetization programs",
      "Community interaction",
    ],
    closing:
      "StoryArc may modify, suspend, or discontinue features at any time without prior notice.",
  },
  {
    id: "creator-content",
    title: "5. Creator Content and Ownership",
    paragraphs: [
      "Creators retain ownership of the intellectual property rights to the content they publish on StoryArc.",
      "By publishing content on StoryArc, you grant StoryArc a worldwide, non-exclusive, royalty-free license to host and store your content, display and distribute it to users, promote it within the platform, and format and optimize it for various devices and interfaces.",
      "This license continues for as long as the content remains on StoryArc.",
      "Creators are responsible for ensuring they have the rights to publish the content they upload.",
    ],
  },
  {
    id: "prohibited-content",
    title: "6. Prohibited Content",
    paragraphs: ["Users may not upload, publish, or distribute content that:"],
    bullets: [
      "Violates intellectual property rights",
      "Contains illegal material",
      "Promotes violence or criminal activity",
      "Contains explicit or exploitative content involving minors",
      "Contains malware, malicious code, or harmful software",
      "Harasses, threatens, or abuses other users",
    ],
    closing:
      "StoryArc reserves the right to remove content or suspend accounts that violate these rules.",
  },
  {
    id: "content-moderation",
    title: "7. Content Moderation",
    paragraphs: [
      "StoryArc may review, remove, or restrict content that violates these Terms or applicable laws.",
      "StoryArc may also limit visibility of content, suspend publishing privileges, or terminate accounts that repeatedly violate the rules.",
      "Moderation decisions are made at the sole discretion of StoryArc.",
    ],
  },
  {
    id: "premium-content-purchases",
    title: "8. Premium Content and Purchases",
    paragraphs: [
      "StoryArc may allow users to purchase coins, credits, or other digital goods to unlock premium chapters.",
      "By making a purchase, you agree that:",
    ],
    bullets: [
      "Digital purchases are non-refundable, except where required by law.",
      "Coins or credits have no monetary value outside the platform.",
      "Coins may only be used for platform features as defined by StoryArc.",
    ],
    closing:
      "StoryArc reserves the right to adjust pricing or coin conversion rates.",
  },
  {
    id: "creator-monetization",
    title: "9. Creator Monetization",
    paragraphs: ["Creators may be eligible to earn revenue through:"],
    bullets: [
      "Paid chapters",
      "Revenue share programs",
      "Creator incentive programs",
    ],
    closing:
      "Participation may require meeting eligibility criteria set by StoryArc. StoryArc reserves the right to modify or terminate monetization programs at any time.",
  },
  {
    id: "intellectual-property",
    title: "10. Intellectual Property",
    paragraphs: [
      "All platform software, design, logos, and trademarks belong to StoryArc or its licensors.",
      "Users may not copy or redistribute platform software, reverse engineer platform systems, or use StoryArc branding without permission.",
    ],
  },
  {
    id: "copyright-infringement",
    title: "11. Copyright Infringement (DMCA)",
    paragraphs: [
      "If you believe your copyright has been infringed on StoryArc, you may submit a notice including:",
    ],
    bullets: [
      "Identification of the copyrighted work",
      "Identification of the infringing content",
      "Contact information",
      "A statement that the claim is made in good faith",
    ],
    closing: "StoryArc will review and take appropriate action.",
  },
  {
    id: "user-conduct",
    title: "12. User Conduct",
    paragraphs: ["Users agree not to:"],
    bullets: [
      "Use automated bots or scraping tools",
      "Attempt to hack or disrupt the platform",
      "Circumvent payment mechanisms",
      "Manipulate rankings or engagement systems",
      "Harass or impersonate other users",
    ],
    closing: "Violations may result in suspension or permanent bans.",
  },
  {
    id: "termination",
    title: "13. Termination",
    paragraphs: [
      "StoryArc may suspend or terminate your account if you violate these Terms, your activity harms the platform or its users, or termination is required by law or regulation.",
      "Users may stop using the Service at any time.",
      "Termination does not eliminate obligations incurred prior to termination.",
    ],
  },
  {
    id: "warranties",
    title: "14. Disclaimer of Warranties",
    paragraphs: [
      'The Service is provided "as is" and "as available."',
      "StoryArc does not guarantee that the Service will always be available, that the platform will be error-free, or that content will meet user expectations.",
      "Users access the platform at their own risk.",
    ],
  },
  {
    id: "liability",
    title: "15. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, StoryArc shall not be liable for loss of data, loss of revenue, indirect or consequential damages, or user-generated content.",
      "StoryArc's liability shall not exceed the amount paid by the user in the previous 12 months.",
    ],
  },
  {
    id: "third-party-services",
    title: "16. Third-Party Services",
    paragraphs: [
      "The Service may integrate with third-party services including payment processors, analytics services, and advertising networks.",
      "StoryArc is not responsible for third-party services or their policies.",
    ],
  },
  {
    id: "changes-to-terms",
    title: "17. Changes to the Terms",
    paragraphs: [
      "StoryArc may update these Terms periodically. When changes are made, the updated Terms will be posted on the platform and the Last Updated date will be revised.",
      "Continued use of the Service constitutes acceptance of the updated Terms.",
    ],
  },
  {
    id: "governing-law",
    title: "18. Governing Law",
    paragraphs: [
      "These Terms shall be governed by the laws of [Jurisdiction / Country], without regard to conflict of law principles.",
    ],
  },
  {
    id: "contact-information",
    title: "19. Contact Information",
    paragraphs: ["For questions regarding these Terms, please contact:"],
    items: [
      { label: "Email", text: "[Support Email]" },
      { label: "Company", text: "StoryArc Inc." },
      { label: "Address", text: "[Company Address]" },
    ],
  },
];

function TermsSection({ section }) {
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

export default function TermsPage() {
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
              to="/auth"
            >
              Sign In
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
              Terms of Service
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              These Terms govern your use of the StoryArc website, mobile
              applications, and related services. By accessing or using the
              Service, you agree to be bound by these Terms. If you do not agree
              to these Terms, you must not use the Service.
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
                  {termsSections.map((section) => (
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
              {termsSections.map((section) => (
                <TermsSection key={section.id} section={section} />
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
            <Link className="transition-colors hover:text-primary" to="/privacy">
              Privacy
            </Link>
            <Link className="transition-colors hover:text-primary" to="/">
              Home
            </Link>
            <Link className="transition-colors hover:text-primary" to="/about">
              About
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
