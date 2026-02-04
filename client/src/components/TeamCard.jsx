import PropTypes from "prop-types";

const TeamCard = ({ member, level = "default" }) => {
  const hasData = member.name && member.name.trim() !== "";
  const hasImage = member.image && member.image.trim() !== "";
  const hasLinkedin = member.linkedin && member.linkedin.trim() !== "";

  return (
    <article className={`flex flex-col items-center rounded-xl border-2 bg-white text-slate-900 border-ieee-500 p-4 md:p-6 shadow-md transition hover:shadow-lg ${!hasData ? 'opacity-60' : ''}`}>
      {/* Responsive placeholder for face images - Larger Circle */}
      <div className="mb-4 md:mb-5 h-40 w-40 md:h-56 md:w-56 overflow-hidden rounded-full bg-slate-100 shadow-sm">
        {hasImage ? (
          <img
            src={member.image}
            alt={hasData ? `${member.name} headshot` : "Team member headshot"}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{
              objectPosition: member.imagePosition || 'center',
              transform: `scale(${member.imageScale || 1})`,
              transformOrigin: member.imagePosition || 'center'
            }}
          />
        ) : (
          <div className="grid h-full w-full place-content-center text-3xl md:text-4xl">
            <span aria-hidden="true">👤</span>
          </div>
        )}
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 text-center">
        {hasData ? member.name : 'Open Position'}
      </h3>
      <p className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-ieee-600 text-center">
        {member.role}
      </p>

      {/* LinkedIn Icon Link */}
      {hasData && hasLinkedin && (
        <a 
          href={member.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:-translate-y-1 hover:bg-blue-700"
          aria-label={`${member.name}'s LinkedIn profile`}
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
      )}
    </article>
  );
};

TeamCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    role: PropTypes.string.isRequired,
    image: PropTypes.string,
    linkedin: PropTypes.string,
    imagePosition: PropTypes.string,
    imageScale: PropTypes.number
  }).isRequired,
  level: PropTypes.oneOf(["default", "leadership", "director"])
};

TeamCard.defaultProps = {
  level: "default"
};

export default TeamCard;
