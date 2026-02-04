import PropTypes from "prop-types";

const HeroSection = ({ isVisible }) => (
  <section id="home" className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-0 pb-0 bg-gradient-to-br from-white via-ieee-50 to-slate-50">
    {/* Animated Geometric Background - Hidden on mobile for performance */}
    <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
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

    <div
      className={`relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 text-center md:px-8 transform transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mb-4 md:mb-6 inline-flex flex-col items-center">
        <p className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] text-ieee-600">York University</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 text-center">
          IEEE Student Branch
        </h1>
      </div>
      
      <p className="mb-4 max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-slate-700 font-medium text-center px-2">
        Where Lassonde Engineers Connect, Create, and Lead
      </p>

      {/* Impact Stats - Responsive sizing */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-16">
        <div className="flex flex-col items-center">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ieee-600 drop-shadow-sm">250+</p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">Members</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-yorku-red drop-shadow-sm">15+</p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">Industry Partners</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ieee-600 drop-shadow-sm">7</p>
          <p className="mt-1 md:mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">Years Strong</p>
        </div>
      </div>

      <p className="mt-8 md:mt-12 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500 text-center px-4">Part of IEEE - The World's Largest Technical Professional Organization</p>
    </div>
  </section>
);

HeroSection.propTypes = {
  isVisible: PropTypes.bool
};

HeroSection.defaultProps = {
  isVisible: true
};

export default HeroSection;
