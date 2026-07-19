import Link from "next/link";
import { getBorrowRequestsForAdmin } from "@/features/cms";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ["All", "Pending", "Approved", "Rejected", "Active", "Returned", "Cancelled"] as const;

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function AdminBorrowRequestsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; status?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const currentPage = Number(params.page) || 1;
  const currentStatus = (params.status as (typeof STATUS_OPTIONS)[number]) || "Pending";

  const { data, meta } = await getBorrowRequestsForAdmin({
    page: currentPage,
    status: currentStatus,
    limit: 10,
  });

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h2 className="text-2xl font-semibold">Borrow Requests</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Review equipment borrowing requests submitted by authorized users.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Link
              key={option}
              href={`?status=${option}&page=1`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                currentStatus === option
                  ? "bg-orange-600 text-white"
                  : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
            >
              {option}
            </Link>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-left">
            <thead className="bg-neutral-900/80">
              <tr className="border-b border-neutral-800">
                <th className="px-4 py-3 text-sm font-medium text-neutral-400">Borrower</th>
                <th className="px-4 py-3 text-sm font-medium text-neutral-400">Item</th>
                <th className="px-4 py-3 text-sm font-medium text-neutral-400">Dates</th>
                <th className="px-4 py-3 text-sm font-medium text-neutral-400">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-neutral-400">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data.map((request) => (
                <tr key={request.id} className="border-b border-neutral-800/80 bg-neutral-950/40">
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-white">{request.borrower_contact_name}</p>
                    <p className="text-xs text-neutral-400">{request.borrower_email}</p>
                    <p className="text-xs text-neutral-500">{request.organization_name}</p>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-neutral-300">
                    {request.requested_item ?? "—"}
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-neutral-300">
                    <p>{formatDate(request.requested_start_date)}</p>
                    <p className="text-neutral-500">to</p>
                    <p>{formatDate(request.requested_end_date)}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-200">
                      {request.status ?? "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-neutral-400">
                    {formatDate(request.created_at)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                    No borrow requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-neutral-400">
            <span>
              Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex gap-2">
              {meta.page > 1 && (
                <Link
                  href={`?status=${currentStatus}&page=${meta.page - 1}`}
                  className="rounded-md border border-neutral-700 px-3 py-1.5 hover:text-white"
                >
                  Previous
                </Link>
              )}
              {meta.page < meta.totalPages && (
                <Link
                  href={`?status=${currentStatus}&page=${meta.page + 1}`}
                  className="rounded-md border border-neutral-700 px-3 py-1.5 hover:text-white"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}

        {data.some((request) => request.letter_file_url) && (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
            <h3 className="mb-4 text-lg font-medium">Request letters</h3>
            <div className="space-y-2">
              {data
                .filter((request) => request.letter_file_url)
                .map((request) => (
                  <div key={`${request.id}-letter`} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-neutral-300">
                      {request.borrower_contact_name} · {request.requested_item}
                    </span>
                    <a
                      href={request.letter_file_url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-orange-300 hover:text-orange-200"
                    >
                      View letter
                    </a>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
