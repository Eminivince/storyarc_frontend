import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAdmin } from "../context/AdminContext";

function statusDot(status) {
  if (status === "online") {
    return "bg-emerald-500";
  }

  if (status === "away") {
    return "bg-amber-500";
  }

  return "bg-slate-400";
}

export default function AdminMessagingPage() {
  const {
    adminNotice,
    clearAdminNotice,
    conversations,
    selectedConversation,
    selectedConversationId,
    selectConversation,
    sendMessage,
    showAdminNotice,
  } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [composer, setComposer] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const filteredConversations = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return conversations.filter((conversation) => {
      if (!query) {
        return true;
      }

      return (
        conversation.userName.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query) ||
        conversation.roleLabel.toLowerCase().includes(query)
      );
    });
  }, [conversations, deferredSearch]);

  const activeConversation =
    filteredConversations.find((item) => item.id === selectedConversationId) ??
    selectedConversation ??
    filteredConversations[0] ??
    null;

  function handleSendMessage(event) {
    event.preventDefault();

    if (sendMessage(composer, activeConversation?.id)) {
      setComposer("");
    }
  }

  return (
    <AdminPageLayout
      headerActions={
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
          onClick={() => showAdminNotice("Inbox filters refreshed.")}
          type="button"
        >
          Refresh Inbox
        </button>
      }
      notice={adminNotice}
      onDismissNotice={clearAdminNotice}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search creators, readers, support notes, or messages..."
      searchTerm={searchTerm}
      subtitle="Handle live creator and reader conversations, inspect account context, and respond without leaving the admin console."
      title="Messaging"
    >
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Inbox
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight">
                Active conversations
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
              {filteredConversations.length} open
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {filteredConversations.map((conversation) => (
              <button
                className={`w-full rounded-3xl border p-4 text-left transition-colors ${
                  activeConversation?.id === conversation.id
                    ? "border-primary/40 bg-primary/10"
                    : "border-primary/10 bg-slate-50 hover:border-primary/30 hover:bg-primary/5 dark:bg-background-dark/50"
                }`}
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                type="button"
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <UserAvatar
                      className="size-14 rounded-2xl"
                      fallbackClassName="text-xl"
                      name={conversation.userName}
                      src={conversation.avatar}
                    />
                    <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${statusDot(conversation.status)}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-black">{conversation.userName}</p>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {conversation.updatedAt}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      {conversation.roleLabel}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {conversation.preview}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        {activeConversation ? (
          <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <UserAvatar
                  className="size-16 rounded-[20px]"
                  fallbackClassName="text-2xl"
                  name={activeConversation.userName}
                  src={activeConversation.avatar}
                />
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    {activeConversation.userName}
                  </h2>
                  <p className="mt-1 text-sm text-primary">{activeConversation.roleLabel}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Last active {activeConversation.updatedAt} ago
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                to={activeConversation.profileHref}
              >
                View Profile
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-primary/10 bg-slate-50 p-4 text-center dark:bg-background-dark/50">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Stories
                </p>
                <p className="mt-3 text-2xl font-black">
                  {activeConversation.accountOverview.stories}
                </p>
              </div>
              <div className="rounded-3xl border border-primary/10 bg-slate-50 p-4 text-center dark:bg-background-dark/50">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Status
                </p>
                <p className="mt-3 text-sm font-black text-primary">
                  {activeConversation.accountOverview.status}
                </p>
              </div>
              <div className="rounded-3xl border border-primary/10 bg-slate-50 p-4 text-center dark:bg-background-dark/50">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Spend
                </p>
                <p className="mt-3 text-2xl font-black">
                  {activeConversation.accountOverview.totalSpend}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-[28px] border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50">
              {activeConversation.messages.map((message) => (
                <div
                  className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                  key={message.id}
                >
                  <div
                    className={`max-w-xl rounded-[24px] px-4 py-3 text-sm leading-7 ${
                      message.sender === "admin"
                        ? "bg-primary text-background-dark"
                        : "bg-white text-slate-700 shadow-sm dark:bg-primary/10 dark:text-slate-100"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`mt-2 text-[11px] font-bold uppercase tracking-[0.16em] ${
                        message.sender === "admin"
                          ? "text-background-dark/75"
                          : "text-slate-400"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSendMessage}>
              <input
                className="min-w-0 flex-1 rounded-full border border-primary/10 bg-slate-50 px-5 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) => setComposer(event.target.value)}
                placeholder="Send a reply, escalate a case, or share a support note..."
                type="text"
                value={composer}
              />
              <button
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark"
                type="submit"
              >
                Send Reply
              </button>
            </form>
          </Reveal>
        ) : null}
      </section>
    </AdminPageLayout>
  );
}
