import PropTypes from "prop-types";

const EventCard = ({ event }) => {
  return (
    <article className="flex h-full flex-col rounded-xl md:rounded-2xl border border-ieee-600 bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex-1 space-y-3 md:space-y-4 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 line-clamp-2">{event.title}</h3>
        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-slate-600">
          <p className="flex items-center gap-1 md:gap-2"><span aria-hidden="true">📅</span>{event.date} · {event.time}</p>
          <p className="flex items-center gap-1 md:gap-2"><span aria-hidden="true">📍</span><span className="line-clamp-1">{event.location}</span></p>
        </div>
      </div>
    </article>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    location: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        caption: PropTypes.string
      })
    )
  }).isRequired
};

export default EventCard;
