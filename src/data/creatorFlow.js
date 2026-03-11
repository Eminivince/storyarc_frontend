export const creatorLandingHref = "/creator";
export const creatorApplicationHref = "/creator/apply";
export const creatorSubmittedHref = "/creator/application-submitted";
export const authorDashboardHref = "/creator/dashboard";
export const creatorCommunityHref = "/creator/community";
export const creatorStoryCreateHref = "/creator/stories/new";

function buildCreatorStoryHref(storySlug, suffix = "") {
  if (!storySlug) {
    return creatorStoryCreateHref;
  }

  return `/creator/stories/${storySlug}${suffix}`;
}

export function getCreatorStoryManagementHref(storySlug) {
  return buildCreatorStoryHref(storySlug);
}

export function getCreatorChapterEditorHref(storySlug) {
  return buildCreatorStoryHref(storySlug, "/chapters/new");
}

export function getCreatorVolumeManagerHref(storySlug) {
  return buildCreatorStoryHref(storySlug, "/structure");
}

export function getCreatorScheduledChaptersHref(storySlug) {
  return buildCreatorStoryHref(storySlug, "/schedule");
}

export function getCreatorPublishedChaptersHref(storySlug) {
  return buildCreatorStoryHref(storySlug, "/published");
}

export const creatorBenefits = [
  {
    title: "Write",
    description:
      "Access a focused editor, world-building tools, and chapter planning built for serial fiction.",
    icon: "edit_note",
  },
  {
    title: "Grow",
    description:
      "Reach readers through curated discovery, community feedback loops, and creator-focused analytics.",
    icon: "trending_up",
  },
  {
    title: "Earn",
    description:
      "Unlock revenue sharing, subscriptions, digital collectibles, and premium chapter monetization.",
    icon: "payments",
  },
];

export const creatorTimeline = [
  {
    step: 1,
    title: "Define Your Universe",
    description:
      "Share your genre, premise, and reader promise so we can understand your creative lane.",
  },
  {
    step: 2,
    title: "First Chapter Review",
    description:
      "Our editorial board reviews your voice, structure, and commercial readiness.",
  },
  {
    step: 3,
    title: "Arc Membership Activation",
    description:
      "Approved authors get full access to the creator suite and audience-growth tools.",
  },
];

export const creatorGenres = [
  "High Fantasy & Magic",
  "Science Fiction & Cyberpunk",
  "Mystery & Thriller",
  "Contemporary Romance",
  "Non-Fiction & Essays",
  "Horror & Supernatural",
];

export const creatorMobileGenres = ["Fiction", "Non-Fiction", "Poetry", "Academic"];

export const creatorExperienceLevels = [
  {
    id: "Hobbyist",
    title: "Hobbyist",
    description: "Writing for personal growth and enjoyment",
  },
  {
    id: "Aspiring Pro",
    title: "Aspiring Pro",
    description: "Actively building a writing career",
  },
  {
    id: "Published",
    title: "Published",
    description: "Traditional or self-published work history",
  },
];

export const initialCreatorApplication = {
  fullName: "Alex Thorne",
  email: "alex@storyarc.world",
  primaryGenre: "High Fantasy & Magic",
  experience: "Aspiring Pro",
  portfolioUrl: "https://storyarc.world/alex",
  motivation:
    "I want to join StoryArc because I’m building a premium long-form fantasy saga and I want an audience that values deep lore, consistent updates, and community-driven momentum. I’m looking for a platform that treats authors like long-term partners and gives me the tools to grow sustainably.",
};

export const creatorSubmissionSteps = [
  {
    title: "Initial Review",
    description: "Our team screens your materials within 24 hours.",
    icon: "description",
    complete: true,
  },
  {
    title: "Portfolio Assessment",
    description: "Detailed evaluation typically takes 3-5 business days.",
    icon: "palette",
    complete: false,
  },
  {
    title: "Final Decision",
    description: "You will receive a notification via your registered email.",
    icon: "notifications",
    complete: false,
  },
];

export const storyGenreOptions = [
  "Fantasy",
  "Dark Romance",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "LitRPG",
  "Wuxia/Xianxia",
];

export const storyAudienceOptions = [
  "Young Adult",
  "Adult",
  "Middle Grade",
  "New Adult",
];

export const storyTagSuggestions = [
  "Magic",
  "Adventure",
  "Werewolf",
  "Slow Burn",
  "Found Family",
  "Political Intrigue",
  "Supernatural",
  "Romantasy",
];

export const createStoryCallouts = [
  "Portrait cover recommended at 600x900px",
  "Keep your synopsis tight and hook-forward",
  "Use tags readers actually search for",
];

export function createInitialStoryDraft() {
  return {
    title: "",
    synopsis: "",
    genre: "",
    audience: "",
    tags: [],
    termsAccepted: false,
    coverImage: "",
  };
}
