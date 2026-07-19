import { getEventForAdminById } from "@/features/events/services/events.admin.service";
import EditEventForm from "@/features/events/components/EditEventForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventForAdminById(id);

  if (!event) notFound();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Edit Event</h1>
      <p className="text-slate-500 mb-10">Update the details for this event.</p>
      <EditEventForm event={event} />
    </div>
  );
}