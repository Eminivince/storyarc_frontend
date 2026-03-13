import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { prefetchChapter, prefetchStoryDetails } from "../reader/readerHooks";

export function PrefetchableStoryLink({ storySlug, children, ...props }) {
  const queryClient = useQueryClient();

  function handlePrefetch() {
    prefetchStoryDetails(queryClient, storySlug);
  }

  return (
    <Link
      onFocus={handlePrefetch}
      onMouseEnter={handlePrefetch}
      {...props}
    >
      {children}
    </Link>
  );
}

export function PrefetchableChapterLink({
  storySlug,
  chapterSlug,
  children,
  ...props
}) {
  const queryClient = useQueryClient();

  function handlePrefetch() {
    prefetchChapter(queryClient, storySlug, chapterSlug);
  }

  return (
    <Link
      onFocus={handlePrefetch}
      onMouseEnter={handlePrefetch}
      {...props}
    >
      {children}
    </Link>
  );
}
