import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminContracts } from "../admin/adminApi";
import AdminPageLayout from "../components/AdminPageLayout";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useAdmin } from "../context/AdminContext";
import { adminContractFilters } from "../data/adminContractFlow";
import {
  adminContractTemplatesHref,
  adminNewContractHref,
  buildAdminContractDetailsHref,
  buildAdminContractEditHref,
} from "../data/adminFlow";

const pageSize = 4;

function matchesFilter(contract, filter) {
  if (filter === "All Contracts") {
    return true;
  }

  return contract.status === filter;
}

function contractTypeClasses(contractType) {
  if (contractType === "Exclusive") {
    return "border border-primary/30 bg-primary/10 text-primary";
  }

  return "border border-slate-700 bg-slate-900/60 text-slate-300";
}

function statusClasses(status) {
  if (status === "Active") {
    return {
      dot: "bg-emerald-500",
      text: "text-emerald-500",
    };
  }

  if (status === "Pending Signature") {
    return {
      dot: "bg-amber-500",
      text: "text-amber-500",
    };
  }

  if (status === "Terminated") {
    return {
      dot: "bg-rose-500",
      text: "text-rose-500",
    };
  }

  if (status === "Expired") {
    return {
      dot: "bg-slate-400",
      text: "text-slate-400",
    };
  }

  return {
    dot: "bg-slate-500",
    text: "text-slate-300",
  };
}

function MobileContractCard({ contract, onEdit, onView }) {
  function handleKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onView(contract);
  }

  return (
    <div
      className="w-full cursor-pointer rounded-[24px] border border-primary/10 bg-primary/5 p-4 text-left shadow-sm transition-colors hover:border-primary/30"
      onClick={() => onView(contract)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-black text-primary">
            {contract.initials}
          </div>
          <div>
            <p className="font-black">{contract.userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {contract.partyRole}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${statusClasses(contract.status).text} bg-white/5`}
        >
          {contract.status}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-base text-primary">
            auto_stories
          </span>
          <span className="font-semibold italic">{contract.storyTitle}</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <p>{contract.contractId}</p>
          <p className="mt-1">{contract.templateName || "Custom terms"}</p>
        </div>
        <div className="flex items-center justify-between border-t border-primary/10 pt-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <p>Created</p>
            <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
              {contract.createdAt}
            </p>
          </div>
          <button
            className="inline-flex items-center gap-1 text-sm font-bold text-primary"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(contract);
            }}
            type="button"
          >
            Edit
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminContractManagementPage() {
  const navigate = useNavigate();
  const { showAdminNotice } = useAdmin();
  const [activeFilter, setActiveFilter] = useState(adminContractFilters[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchTerm);

  const contractsQuery = useQuery({
    queryKey: ["admin", "contracts"],
    queryFn: fetchAdminContracts,
    staleTime: 15_000,
  });

  const contracts = contractsQuery.data?.contracts ?? [];
  const filteredContracts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return contracts.filter((contract) => {
      const matchesQuery =
        !query ||
        contract.userName.toLowerCase().includes(query) ||
        contract.storyTitle.toLowerCase().includes(query) ||
        contract.contractId.toLowerCase().includes(query) ||
        contract.partyRole.toLowerCase().includes(query) ||
        contract.templateName.toLowerCase().includes(query);

      return matchesFilter(contract, activeFilter) && matchesQuery;
    });
  }, [activeFilter, contracts, deferredSearch]);

  const pageCount = Math.max(1, Math.ceil(filteredContracts.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const visibleContracts = filteredContracts.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, deferredSearch]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  function handleView(contract) {
    navigate(buildAdminContractDetailsHref(contract.id));
  }

  function handleEdit(contract) {
    navigate(buildAdminContractEditHref(contract.id));
  }

  function handleDownload(contract) {
    showAdminNotice(
      `Live contract data is ready for ${contract.contractId}; PDF export is not wired yet.`,
      "info",
    );
  }

  if (contractsQuery.isLoading && !contractsQuery.data) {
    return <RouteLoadingScreen />;
  }

  if (contractsQuery.isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Go To Admin Dashboard"
        ctaTo="/admin"
        description={
          contractsQuery.error?.message ||
          "We could not load the contract registry right now."
        }
        secondaryLabel="Retry"
        secondaryTo="/admin/contracts"
        title="Contracts Unavailable"
        tone="error"
      />
    );
  }

  return (
    <AdminPageLayout
      headerActions={
        <>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            to={adminContractTemplatesHref}
          >
            <span className="material-symbols-outlined text-base">library_books</span>
            Manage Templates
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
            to={adminNewContractHref}
          >
            <span className="material-symbols-outlined text-base">add</span>
            Create New Contract
          </Link>
        </>
      }
      subtitle="Monitor legal agreements, manage intellectual property rights, and track signature statuses for active TaleStead contracts."
      title="Contract Management"
    >
      <section className="rounded-[28px] border border-primary/10 bg-[#151006] p-4 shadow-[0_28px_80px_-40px_rgba(16,12,8,0.9)] sm:p-6">
        <div className="border-b border-primary/10">
          <div className="no-scrollbar flex gap-1 overflow-x-auto pb-px">
            {adminContractFilters.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
                    active
                      ? "border-primary font-black text-primary"
                      : "border-transparent font-semibold text-slate-500 hover:text-slate-200"
                  }`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <label className="group relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">
              search
            </span>
            <input
              className="w-full rounded-xl border border-primary/10 bg-slate-950/50 py-3 pl-12 pr-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by user, story title, contract ID, or template..."
              type="text"
              value={searchTerm}
            />
          </label>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/10 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:text-primary"
            to={adminContractTemplatesHref}
          >
            <span className="material-symbols-outlined text-base">description</span>
            Template Library
          </Link>
        </div>

        {contracts.length === 0 ? (
          <Reveal className="mt-5 rounded-[24px] border border-dashed border-primary/20 bg-slate-950/30 px-5 py-12 text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Contracts
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-100">
              No live contracts yet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              The seeded demo contracts are gone. Create your first real agreement or
              open the template library to build reusable company-approved starting points.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark"
                to={adminNewContractHref}
              >
                Create Contract
              </Link>
              <Link
                className="rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-bold text-primary"
                to={adminContractTemplatesHref}
              >
                Manage Templates
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal className="mt-5 hidden overflow-hidden rounded-[24px] border border-primary/10 bg-slate-950/30 md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-primary/10 bg-primary/5">
                    {["User", "Story Title", "Contract Type", "Status", "Date Created", "Actions"].map(
                      (label) => (
                        <th
                          className={`px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-primary ${
                            label === "Actions" ? "text-right" : ""
                          }`}
                          key={label}
                        >
                          {label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {visibleContracts.map((contract) => {
                    const status = statusClasses(contract.status);

                    return (
                      <tr className="transition-colors hover:bg-primary/5" key={contract.id}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-slate-900 text-xs font-black text-slate-200">
                              {contract.initials}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-100">
                                {contract.userName}
                              </p>
                              <p className="text-xs text-slate-500">{contract.partyRole}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-200">
                          <p>{contract.storyTitle}</p>
                          <p className="mt-1 text-xs text-slate-500">{contract.templateName}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${contractTypeClasses(contract.contractType)}`}
                          >
                            {contract.contractType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className={`size-2 rounded-full ${status.dot}`} />
                            <span className={`text-sm font-semibold ${status.text}`}>
                              {contract.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-400">
                          <p>{contract.createdAt}</p>
                          <p className="mt-1 text-xs text-slate-500">{contract.contractId}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/20 hover:text-primary"
                              onClick={() => handleView(contract)}
                              title="View details"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xl">
                                visibility
                              </span>
                            </button>
                            <button
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/20 hover:text-primary"
                              onClick={() => handleEdit(contract)}
                              title="Edit contract"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/20 hover:text-primary"
                              onClick={() => handleDownload(contract)}
                              title="Download PDF"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xl">download</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Reveal>

            <div className="mt-5 space-y-4 md:hidden">
              {visibleContracts.map((contract) => (
                <MobileContractCard
                  contract={contract}
                  key={contract.id}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))}
            </div>

            {visibleContracts.length ? null : (
              <div className="mt-5 rounded-[24px] border border-dashed border-primary/20 bg-slate-950/30 px-5 py-10 text-sm text-slate-400">
                No contracts match the current filters. Try a different status or search term.
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-300">
                  {filteredContracts.length ? startIndex + 1 : 0}-
                  {Math.min(startIndex + visibleContracts.length, filteredContracts.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-300">
                  {filteredContracts.length}
                </span>{" "}
                contracts
              </p>

              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      className={`flex size-9 items-center justify-center rounded-lg text-xs font-black transition-colors ${
                        pageNumber === page
                          ? "bg-primary text-background-dark"
                          : "bg-slate-900 text-slate-300 hover:text-primary"
                      }`}
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      type="button"
                    >
                      {pageNumber}
                    </button>
                  ),
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </AdminPageLayout>
  );
}
