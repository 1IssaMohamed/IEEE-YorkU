import PropTypes from "prop-types";

const TeamCard = ({ member, level = "default" }) => {
  const hasData = member.name && member.name.trim() !== "";

  return (
    <article className={`flex flex-col items-center rounded-xl border-2 bg-white text-slate-900 border-ieee-500 p-4 md:p-6 shadow-md transition hover:shadow-lg ${!hasData ? 'opacity-60' : ''}`}>
      {/* Responsive placeholder for face images */}
      <div className="mb-3 md:mb-4 grid h-24 w-24 md:h-32 md:w-32 place-content-center rounded-full bg-slate-100 text-3xl md:text-4xl">
        <span aria-hidden="true">👤</span>
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 text-center">
        {hasData ? member.name : 'Open Position'}
      </h3>
      <p className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-ieee-600 text-center">
        {member.role}
      </p>
      {hasData && member.program && (
        <p className="mt-1 text-[10px] md:text-xs text-slate-500 text-center">
          {member.program}
        </p>
      )}
    </article>
  );
};

TeamCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    role: PropTypes.string.isRequired,
    program: PropTypes.string
  }).isRequired,
  level: PropTypes.oneOf(["default", "leadership", "director"])
};

TeamCard.defaultProps = {
  level: "default"
};

export default TeamCard;
