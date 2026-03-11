import { readerLibraryHref } from "./readerFlow";

export function buildGiftSendingHref(storySlug) {
  return storySlug ? `/stories/${storySlug}/gift` : readerLibraryHref;
}

export const creatorCommunityTabs = [
  { id: "recent", label: "Recent Feed" },
  { id: "polls", label: "Active Polls" },
  { id: "scheduled", label: "Scheduled" },
  { id: "archive", label: "Archive" },
];

export const creatorCommunityActions = [
  {
    id: "update",
    title: "New Update",
    detail: "Publish a release note to your readers",
    icon: "edit_square",
  },
  {
    id: "poll",
    title: "New Poll",
    detail: "Ask the community what happens next",
    icon: "poll",
  },
];
