const categoryStyles = {
  Technical: {
    badge: "bg-blue-100 text-blue-800",
    border: "border-blue-400"
  },
  Professional: {
    badge: "bg-purple-100 text-purple-800",
    border: "border-purple-400"
  },
  Project: {
    badge: "bg-green-100 text-green-800",
    border: "border-green-400"
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
      <div className="border-t border-slate-100 bg-slate-50/60 p-4">
        <button
          type="button"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          RSVP Now
        </button>
      </div>
    </article>
  );
};

export default EventCard;
