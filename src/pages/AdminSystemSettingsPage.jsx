import { useDeferredValue, useEffect, useMemo, useState } from "react";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import { useAdmin } from "../context/AdminContext";
import { maintenanceActions } from "../data/adminFlow";
import MaterialSymbol from "../components/MaterialSymbol";

function formatSettingDraft(setting) {
  if (typeof setting?.valueCents !== "number") {
    return "";
  }

  if (setting.kind === "PERCENTAGE") {
    return String(setting.valueCents);
  }

  return (setting.valueCents / 100).toFixed(2);
}

function parseSettingDraft(setting, value) {
  const normalized = value.trim().replace(/,/g, "");

  if (!normalized) {
    return null;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  if (setting.kind === "PERCENTAGE") {
    if (amount > 100) {
      return null;
    }

    return Math.round(amount);
  }

  return Math.round(amount * 100);
}

export default function AdminSystemSettingsPage() {
  const {
    runMaintenanceAction,
    settings,
    toggleSystemSetting,
    updateSystemSetting,
  } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [settingDrafts, setSettingDrafts] = useState({});
  const deferredSearch = useDeferredValue(searchTerm);

  useEffect(() => {
    const nextDrafts = settings.reduce((drafts, item) => {
      if (["CURRENCY_CENTS", "PERCENTAGE"].includes(item.kind)) {
        drafts[item.id] = formatSettingDraft(item);
      }

      return drafts;
    }, {});

    setSettingDrafts(nextDrafts);
  }, [settings]);

  const groupedSettings = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const visibleSettings = settings.filter((item) => {
      if (!query) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.group.toLowerCase().includes(query) ||
        (item.formattedValue ?? "").toLowerCase().includes(query)
      );
    });

    return visibleSettings.reduce((groups, item) => {
      groups[item.group] = groups[item.group] ? [...groups[item.group], item] : [item];
      return groups;
    }, {});
  }, [deferredSearch, settings]);

  return (
    <AdminPageLayout
      headerActions={
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
          onClick={() => runMaintenanceAction("run-backup")}
          type="button"
        >
          Backup Now
        </button>
      }
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search settings, policies, or maintenance actions..."
      searchTerm={searchTerm}
      subtitle="Control platform-wide configuration, maintenance posture, and the safety rules that guard publishing and payouts."
      title="System Settings"
    >
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {Object.entries(groupedSettings).map(([group, items], index) => (
            <Reveal
              className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5"
              delay={index * 0.05}
              key={group}
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                {group}
              </p>
              <div className="mt-5 space-y-4">
                {items.map((item) => {
                  const parsedDraftValue = parseSettingDraft(
                    item,
                    settingDrafts[item.id] ?? "",
                  );
                  const isCurrency = item.kind === "CURRENCY_CENTS";

                  return (
                    <div
                      className="flex flex-col gap-4 rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50 lg:flex-row lg:items-center lg:justify-between"
                      key={item.id}
                    >
                      <div className="max-w-xl">
                        <p className="font-black">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                      {item.kind === "BOOLEAN" ? (
                        <button
                          aria-pressed={item.enabled}
                          className={`relative h-9 w-16 rounded-full transition-colors ${
                            item.enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                          }`}
                          onClick={() => toggleSystemSetting(item.id)}
                          type="button"
                        >
                          <span
                            className={`absolute top-1 size-7 rounded-full bg-white transition-transform ${
                              item.enabled ? "translate-x-8" : "translate-x-1"
                            }`}
                          />
                        </button>
                      ) : (
                        <div className="w-full max-w-sm">
                          <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                            {isCurrency ? "Currency Value" : "Percentage Value"}
                          </label>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-primary/10 bg-white px-4 py-3 dark:bg-background-dark">
                              {isCurrency ? (
                                <span className="text-sm font-bold text-slate-400">$</span>
                              ) : null}
                              <input
                                className={`min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none ${
                                  isCurrency ? "pl-2" : ""
                                }`}
                                inputMode="decimal"
                                onChange={(event) =>
                                  setSettingDrafts((current) => ({
                                    ...current,
                                    [item.id]: event.target.value,
                                  }))
                                }
                                placeholder={isCurrency ? "0.00" : "0"}
                                type="text"
                                value={settingDrafts[item.id] ?? ""}
                              />
                              {!isCurrency ? (
                                <span className="text-sm font-bold text-slate-400">%</span>
                              ) : null}
                            </div>
                            <button
                              className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                              disabled={
                                parsedDraftValue === null ||
                                parsedDraftValue === item.valueCents
                              }
                              onClick={() =>
                                updateSystemSetting(item.id, parsedDraftValue)
                              }
                              type="button"
                            >
                              Save
                            </button>
                          </div>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Current value: {item.formattedValue}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="space-y-6">
          <Reveal className="rounded-[28px] border border-primary/10 bg-gradient-to-br from-[#17130d] via-[#20170d] to-[#0f0c08] p-6 text-white shadow-[0_28px_80px_-40px_rgba(16,12,8,0.9)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary/75">
              Platform Maintenance
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              High-impact operations
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Use these controls for cache rebuilds, search repair, and emergency
              snapshot creation. Every action writes into the activity log.
            </p>

            <div className="mt-6 space-y-3">
              {maintenanceActions.map((action) => (
                <button
                  className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left transition-colors hover:bg-white/10"
                  key={action.id}
                  onClick={() => runMaintenanceAction(action.id)}
                  type="button"
                >
                  <span className="font-bold">{action.label}</span>
                  <MaterialSymbol name="bolt" className="text-primary" />
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Security Policies
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50">
                <p className="font-black">Publishing guardrails</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Strict moderation and two-person payout review should stay enabled
                  while the creator program is still scaling.
                </p>
              </div>
              <div className="rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50">
                <p className="font-black">Operational note</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Maintenance mode should only be enabled during deploy windows or
                  data repair operations to avoid breaking active reading sessions.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </AdminPageLayout>
  );
}
