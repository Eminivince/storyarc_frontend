import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useToast } from "../context/ToastContext";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  useShopCatalogQuery,
  usePurchaseShopItemMutation,
  useMyShopItemsQuery,
} from "../engagement/engagementHooks";

const CATEGORY_LABELS = {
  AVATAR_FRAME: "Avatar Frames",
  PROFILE_BADGE: "Profile Badges",
  THEME: "Themes",
  READING_EFFECT: "Reading Effects",
  TITLE: "Titles",
};

const CATEGORY_ICONS = {
  AVATAR_FRAME: "frame_person",
  PROFILE_BADGE: "verified",
  THEME: "palette",
  READING_EFFECT: "auto_awesome",
  TITLE: "badge",
};

const DURATION_LABELS = {
  PERMANENT: "Permanent",
  TIMED: "Limited time",
  SINGLE_USE: "Single use",
};

function ConfirmPurchaseModal({ item, onConfirm, onCancel, isPending }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <motion.div
        className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-bold text-zinc-100">Confirm Purchase</h3>
        <p className="mb-1 text-sm text-zinc-300">{item.title}</p>
        <p className="mb-4 text-xs text-zinc-500">{item.description}</p>

        <div className="mb-4 rounded-lg bg-zinc-800 px-3 py-2 text-center">
          <span className="text-2xl font-bold text-amber-400">{item.cost}</span>
          <span className="ml-1 text-sm text-zinc-400">points</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-zinc-700 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item.id)}
            disabled={isPending}
            className="flex-1 rounded-lg bg-primary py-2 text-sm font-bold text-background-dark hover:brightness-110 disabled:opacity-50"
          >
            {isPending ? "Purchasing..." : "Buy Now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ShopItemCard({ item, onPurchase, owned }) {
  return (
    <motion.div
      className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
      whileHover={{ y: -2 }}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {item.iconUrl ? (
            <img src={item.iconUrl} alt="" className="h-6 w-6" />
          ) : (
            <MaterialSymbol name={CATEGORY_ICONS[item.category] ?? "shopping_bag"} className="text-primary" />
          )}
        </div>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
          {DURATION_LABELS[item.durationType] ?? item.durationType}
          {item.durationType === "TIMED" && item.durationDays && ` · ${item.durationDays}d`}
        </span>
      </div>

      <h3 className="mb-1 text-sm font-bold text-zinc-100">{item.title}</h3>
      <p className="mb-3 flex-1 text-xs text-zinc-500">{item.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-amber-400">{item.cost} pts</span>
        {owned ? (
          <span className="rounded-lg bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
            Owned
          </span>
        ) : (
          <button
            onClick={() => onPurchase(item)}
            className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-background-dark hover:brightness-110"
          >
            Buy
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ShopContent({ catalog, myItems, onPurchase }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = catalog?.categories ? Object.keys(catalog.categories) : [];
  const displayCategory = activeCategory || categories[0];
  const items = catalog?.categories?.[displayCategory] ?? [];
  const ownedKeys = new Set((myItems ?? []).map((i) => i.key));

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                displayCategory === cat
                  ? "bg-primary text-background-dark"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              <MaterialSymbol name={CATEGORY_ICONS[cat] ?? "category"} className="text-sm" />
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            onPurchase={onPurchase}
            owned={ownedKeys.has(item.key)}
          />
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-sm text-zinc-500">No items in this category yet.</p>
      )}
    </>
  );
}

export default function PointShopPage() {
  const { showToast } = useToast();
  const catalogQuery = useShopCatalogQuery();
  const myItemsQuery = useMyShopItemsQuery();
  const purchaseMutation = usePurchaseShopItemMutation();
  const [confirmItem, setConfirmItem] = useState(null);

  if (catalogQuery.isLoading) return <RouteLoadingScreen />;

  async function handlePurchase(itemId) {
    try {
      const result = await purchaseMutation.mutateAsync(itemId);
      setConfirmItem(null);
      showToast(`Purchased! Balance: ${result.balanceAfter} pts`, { title: "Item Bought" });
    } catch (err) {
      showToast(err?.message ?? "Purchase failed.", { title: "Error", tone: "error" });
    }
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden min-h-screen bg-background-dark font-display text-slate-100 md:block">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link className="text-xs font-bold uppercase tracking-widest text-primary hover:underline" to="/account/rewards">
                Rewards
              </Link>
              <h1 className="mt-1 text-2xl font-bold">Point Shop</h1>
              <p className="mt-1 text-sm text-zinc-400">Spend your points on exclusive items.</p>
            </div>
            <Link
              to="/account/shop"
              className="text-xs font-semibold text-primary hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              My Items ({myItemsQuery.data?.length ?? 0})
            </Link>
          </div>

          <ShopContent
            catalog={catalogQuery.data}
            myItems={myItemsQuery.data}
            onPurchase={setConfirmItem}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="min-h-screen bg-background-dark font-display text-slate-100 md:hidden">
        <div className="px-4 py-6">
          <div className="mb-6">
            <Link className="text-xs font-bold uppercase tracking-widest text-primary hover:underline" to="/account/rewards">
              Rewards
            </Link>
            <h1 className="mt-1 text-xl font-bold">Point Shop</h1>
          </div>

          <ShopContent
            catalog={catalogQuery.data}
            myItems={myItemsQuery.data}
            onPurchase={setConfirmItem}
          />
        </div>
      </div>

      <AnimatePresence>
        {confirmItem && (
          <ConfirmPurchaseModal
            item={confirmItem}
            onConfirm={handlePurchase}
            onCancel={() => setConfirmItem(null)}
            isPending={purchaseMutation.isPending}
          />
        )}
      </AnimatePresence>
    </>
  );
}
