const TeamCard = ({ member, level = "default" }) => {
  // Color scheme based on hierarchy level
  const levelStyles = {
    chair: "bg-gradient-to-br from-ieee-600 to-ieee-700 text-white border-ieee-700",
    vice: "bg-gradient-to-br from-yorku-red to-red-700 text-white border-yorku-red",
    director: "bg-white text-slate-900 border-ieee-500",
    default: "bg-white text-slate-900 border-slate-300"
  };

  const style = levelStyles[level] || levelStyles.default;
  const hasData = member.name && member.name.trim() !== "";

  return (
    <article className={`flex flex-col items-center rounded-xl border-2 ${style} p-4 shadow-md transition hover:shadow-lg ${!hasData ? 'opacity-60' : ''}`}>
      <div className={`mb-2 grid h-16 w-16 place-content-center rounded-full text-2xl ${
        level === 'chair' || level === 'vice' ? 'bg-white/20' : 'bg-slate-100'
      }`}>
        <span aria-hidden="true">
          {level === 'chair' ? '👑' : level === 'vice' ? '⭐' : '👤'}
        </span>
      </div>
      <h3 className={`text-base font-bold ${level === 'chair' || level === 'vice' ? 'text-white' : 'text-slate-900'}`}>
        {hasData ? member.name : 'Open Position'}
      </h3>
      <p className={`mt-1 text-sm font-semibold ${
        level === 'chair' || level === 'vice' ? 'text-white/90' : 'text-ieee-600'
      }`}>
        {member.role}
      </p>
      {hasData && member.program && (
        <p className={`mt-1 text-xs ${level === 'chair' || level === 'vice' ? 'text-white/75' : 'text-slate-500'}`}>
          {member.program}
        </p>
      )}
    </article>
  );
};

export default TeamCard;
