import Link from 'next/link';
import EventRow from './EventRow';
import { Tables } from '@/lib/supabase/database.types';

type Event = Pick<Tables<'Events'>, 'id' | 'title' | 'content_description' | 'event_date' | 'status' | 'image_url'>;

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

const STATUS_OPTIONS = ['All', 'Published', 'Draft'] as const;

export default function EventsDashboard({ events, meta, currentPage, currentStatus }: Props) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Events</h1>
          <p className="text-slate-500 mt-2">Manage your publication status.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          Add New Event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {STATUS_OPTIONS.map((option) => (
          <Link
            key={option}
            href={`?status=${option}&page=1`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStatus === option
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {option}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No events found. Start by creating one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * meta.limit + 1}–{Math.min(currentPage * meta.limit, meta.total)} of {meta.total} events
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`?status=${currentStatus}&page=${currentPage - 1}`}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Previous
              </Link>
            )}
            {currentPage < meta.totalPages && (
              <Link
                href={`?status=${currentStatus}&page=${currentPage + 1}`}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}