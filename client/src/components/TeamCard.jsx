const TeamCard = ({ member }) => (
  <article className="flex flex-col items-center rounded-2xl border border-ieee-100 bg-white p-6 text-center shadow transition hover:-translate-y-1 hover:shadow-lg">
    <div className="mb-4 grid h-24 w-24 place-content-center rounded-full bg-ieee-50 text-3xl">
      <span aria-hidden="true">👥</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
    <p className="mt-1 text-sm font-semibold text-ieee-600">{member.role}</p>
    <p className="mt-1 text-sm text-slate-500">{member.program}</p>
  </article>
);

export default TeamCard;
