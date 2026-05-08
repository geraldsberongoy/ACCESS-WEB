import { EventCard } from "@/features/events"
import { getPublishedEvents } from "@/features/events/services/events.public.service";

export default async function EventsSection() {
  const { data: events } = await getPublishedEvents({ status: "all", limit: 9 });

  return (
    <div className="py-20 px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <h2 className="mb-10 text-center text-6xl font-extrabold tracking-widest title-header">
            Events
          </h2>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"></div>
          {events?.map((event) => (
            <EventCard
              key={event.id}
              title={event.title ?? ""}
              description={event.content_description ?? ""}
              date={event.event_date ? new Date(event.event_date).toLocaleDateString() : ""}
              image={event.image_url ?? "/BG-ACCESS.webp"}
              href={`/events/${event.id}`}
            />
          ))}
          {(!events || events.length === 0) && (
            <p className="col-span-3 text-center text-slate-400">No upcoming events.</p>
          )}
        </div>
      </div>
  )
}
