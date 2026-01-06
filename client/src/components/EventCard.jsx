import ImageCarousel from "./ImageCarousel.jsx";

const categoryStyles = {
  Technical: {
    badge: "bg-ieee-600 text-white",
    border: "border-ieee-600"
  },
  Professional: {
    badge: "bg-yorku-red text-white",
    border: "border-yorku-red"
  },
  Project: {
    badge: "bg-ieee-500 text-white",
    border: "border-ieee-500"
  }
};

const EventCard = ({ event }) => {
  const styles = categoryStyles[event.category] ?? categoryStyles.Technical;

  return (
    <article className={`flex h-full flex-col rounded-2xl border bg-white shadow transition hover:-translate-y-1 hover:shadow-lg ${styles.border}`}>
      <div className="flex-1 space-y-4 p-6">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${styles.badge}`}>
          {event.category}
        </span>
        <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2"><span aria-hidden="true">📅</span>{event.date} · {event.time}</p>
          <p className="flex items-center gap-2"><span aria-hidden="true">📍</span>{event.location}</p>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
