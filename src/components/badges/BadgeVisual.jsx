import { lazy, Suspense } from "react";
import CommonBadge from "./CommonBadge";
import UncommonBadge from "./UncommonBadge";
import RareBadge from "./RareBadge";

const EpicBadge = lazy(() => import("./EpicBadge"));
const LegendaryBadge = lazy(() => import("./LegendaryBadge"));

console.log("BadgeVisual");

function FallbackIcon({ title, color }) {
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white ${color}`}
    >
      {title?.charAt(0) ?? "?"}
    </div>
  );
}

export default function BadgeVisual({ rarity, title, earned }) {
  switch (rarity) {
    case "COMMON":
      return <CommonBadge title={title} earned={earned} />;
    case "UNCOMMON":
      return <UncommonBadge title={title} earned={earned} />;
    case "RARE":
      return <RareBadge title={title} earned={earned} />;
    case "EPIC":
      return (
        <Suspense fallback={<FallbackIcon title={title} color="bg-purple-500" />}>
          <EpicBadge title={title} earned={earned} />
        </Suspense>
      );
    case "LEGENDARY":
      return (
        <Suspense fallback={<FallbackIcon title={title} color="bg-amber-500" />}>
          <LegendaryBadge title={title} earned={earned} />
        </Suspense>
      );
    default:
      return <CommonBadge title={title} earned={earned} />;
  }
}
