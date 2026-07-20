import Link from "next/link";
import EventRow from "./EventRow";
import {
  AdminEmptyState,
  AdminFilterPills,
  AdminPageHeader,
  AdminPageShell,
  adminBtnPrimaryClass,
} from "../components/admin-ui";
import { Tables } from "@/lib/supabase/database.types";

type Event = Pick<
  Tables<"Events">,
  "id" | "title" | "content_description" | "event_date" | "status" | "image_url"
>;

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface Props {
  events: Event[];
  meta: Meta;
  currentPage: number;
  currentStatus: string;
}

const STATUS_OPTIONS = ["All", "Published", "Draft"] as const;

export default function EventsDashboard({ events, meta, currentPage, currentStatus }: Props) {
  return (
    <AdminPageShell width="wide">
      <AdminPageHeader
        eyebrow="Operations"
        title="Events"
        description="Manage publication status and event details."
        action={
          <Link href="/admin/events/new" className={adminBtnPrimaryClass}>
            Add new event
          </Link>
        }
      />

      <AdminFilterPills
        options={STATUS_OPTIONS}
        current={currentStatus}
        buildHref={(option) => `?status=${option}&page=1`}
      />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <AdminEmptyState>No events found. Start by creating one.</AdminEmptyState>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-white/45">
          <p>
            Showing {(currentPage - 1) * meta.limit + 1}–
            {Math.min(currentPage * meta.limit, meta.total)} of {meta.total} events
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`?status=${currentStatus}&page=${currentPage - 1}`}
                className="admin-btn admin-btn-secondary"
              >
                Previous
              </Link>
            )}
            {currentPage < meta.totalPages && (
              <Link
                href={`?status=${currentStatus}&page=${currentPage + 1}`}
                className="admin-btn admin-btn-primary"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}
