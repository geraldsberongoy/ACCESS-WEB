import { getEventForAdminById } from "@/features/events/services/events.admin.service";
import EditEventForm from "@/features/events/components/EditEventForm";
import { AdminPageHeader, AdminPageShell } from "../../../components/admin-ui";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventForAdminById(id);

  if (!event) notFound();

  return (
    <AdminPageShell width="narrow">
      <AdminPageHeader
        eyebrow="Operations"
        title="Edit Event"
        description="Update the details for this event."
      />
      <EditEventForm event={event} />
    </AdminPageShell>
  );
}
