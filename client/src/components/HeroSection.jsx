import PropTypes from "prop-types";

const HeroSection = ({ isVisible, onNavigate }) => (
  <section id="home" className="relative overflow-hidden min-h-[100svh] flex flex-col justify-center pt-16 pb-12 md:pt-0 md:pb-0 bg-gradient-to-br from-white via-ieee-50 to-slate-50">
    {/* Animated Geometric Background - Desktop */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block">
      {/* Large floating geometric shapes with solid fills */}
      <div className="absolute top-20 -left-10 w-64 h-64 bg-ieee-600/20 border-4 border-ieee-600/40 rotate-45 animate-float-slow"></div>
      <div className="absolute top-32 right-10 w-40 h-80 bg-yorku-red/15 border-4 border-yorku-red/50 animate-float-delayed"></div>
      <div className="absolute bottom-20 left-1/4 w-72 h-32 bg-ieee-500/15 border-4 border-ieee-500/40 rotate-12 animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-96 bg-gradient-to-b from-ieee-600/20 to-transparent border-l-4 border-ieee-600/40 animate-float-slow"></div>
      <div className="absolute bottom-10 right-20 w-48 h-48 bg-yorku-red/20 border-4 border-yorku-red/50 -rotate-12 animate-float-delayed"></div>
      <div className="absolute top-1/2 left-10 w-56 h-20 bg-ieee-600/15 border-2 border-ieee-500/30 rotate-6 animate-float"></div>
      
      {/* Bold grid lines with gradients */}
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-ieee-600/30 to-transparent"></div>
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-yorku-red/30 to-transparent"></div>
      <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ieee-600/25 to-transparent"></div>
      <div className="absolute bottom-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yorku-red/25 to-transparent"></div>
    </div>

    {/* Mobile-optimized background accents */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden">
      <div className="absolute -top-10 right-6 h-36 w-36 rounded-full bg-ieee-600/12 blur-2xl motion-safe:animate-ambient-drift"></div>
      <div className="absolute bottom-10 left-6 h-44 w-44 rounded-full bg-yorku-red/12 blur-3xl motion-safe:animate-ambient-drift-reverse"></div>
      <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-ieee-600/25 to-transparent"></div>
    </div>

    <div
      className={`relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 text-center md:px-8 transform transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mb-4 md:mb-6 inline-flex flex-col items-center">
        <p className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] text-ieee-600">IEEE at York University</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 text-center">
          IEEE YorkU Student Branch
        </h1>
      </div>
      
      <p className="mb-4 max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-slate-700 font-medium text-center px-2">
        Build projects, share ideas, and grow with engineers who stay curious.
      </p>

      <p className="max-w-3xl text-sm sm:text-base md:text-lg text-slate-600 text-center px-2">
        From workshops and industry nights to hands-on hardware builds, we help students turn classroom knowledge into practical engineering experience.
      </p>

      <div className="mt-8 flex w-full max-w-xl flex-col gap-3 px-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => onNavigate("past-events")}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-ieee-600 px-6 py-3 text-sm font-bold text-white transition-[background-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] hover:bg-ieee-700 hover:shadow-lg hover:shadow-ieee-900/20 focus:outline-none focus:ring-2 focus:ring-ieee-600 focus:ring-offset-2"
        >
          Explore Events
        </button>
        <button
          type="button"
          onClick={() => onNavigate("team")}
          className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-[color,background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] hover:border-ieee-300 hover:bg-slate-50 hover:text-ieee-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
        >
          Meet the Team
        </button>
      </div>

      {/* Impact Stats - Responsive sizing */}
      <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8 lg:gap-12">
        <div className="flex flex-col items-center">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ieee-600 drop-shadow-sm">250+</p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">Active Members</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-yorku-red drop-shadow-sm">15+</p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">Partners and Sponsors</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ieee-600 drop-shadow-sm">7</p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">Years of Student Impact</p>
        </div>
      </div>

      <p className="mt-8 md:mt-12 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500 text-center px-4">Part of IEEE, the world&apos;s largest technical professional community</p>
    </div>
  </section>
);

HeroSection.propTypes = {
  isVisible: PropTypes.bool,
  onNavigate: PropTypes.func.isRequired
};

HeroSection.defaultProps = {
  isVisible: true
};

export default HeroSection;
