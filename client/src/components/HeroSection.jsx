const HeroSection = ({ onNavigate, isVisible }) => (
  <section id="home" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
    <div
      className={`mx-auto flex max-w-6xl flex-col items-center px-4 text-center md:px-8 transform transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <p className="mb-6 inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-sm font-semibold text-ieee-500 shadow-sm ring-1 ring-ieee-100">
        Building Community · Driving Innovation · Inspiring Leaders
      </p>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
        Innovate. Connect. Lead.
      </h1>
      <p className="mb-10 max-w-3xl text-lg text-slate-600 md:text-xl">
        IEEE York University empowers the next generation of engineers through workshops, industry mentorship, and collaborative projects fueled by student passion.
      </p>
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
        <button
          type="button"
          onClick={() => onNavigate("events")}
          className="rounded-full bg-ieee-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-ieee-700 hover:shadow-xl"
        >
          Upcoming Events
        </button>
        <button
          type="button"
          onClick={() => onNavigate("contact")}
          className="rounded-full border border-ieee-600 px-8 py-3 text-base font-semibold text-ieee-600 transition hover:bg-ieee-50"
        >
          Join Our Community
        </button>
      </div>
      <p className="mt-10 text-sm font-medium uppercase tracking-[0.35em] text-slate-400">Inspired by IEEE Global values</p>
    </div>
  </section>
);

export default HeroSection;
