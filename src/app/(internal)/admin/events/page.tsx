import { getEventsForAdmin } from "@/features/events/services/events.admin.service";
import EventsDashboard from "./EventsDashboard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page, status } = await searchParams;

  const currentPage = Number(page) || 1;
  const currentStatus = (status as "Published" | "Draft" | "All") || "All";

  const { data, meta } = await getEventsForAdmin({
    page: currentPage,
    status: currentStatus,
    limit: 10,
  });

  return (
    <EventsDashboard
      events={data || []}
      meta={meta}
      currentPage={currentPage}
      currentStatus={currentStatus}
    />
  );
}