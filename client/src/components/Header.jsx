import { useState, useCallback } from "react";
import PropTypes from "prop-types";

const navItemsConfig = [
  { name: "Home", path: "home" },
  { name: "Events", path: "past-events" },
  { name: "Team", path: "team" }
];

const Header = ({ onNavigate, currentSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = useCallback((path) => {
    onNavigate(path);
    setIsOpen(false);
  }, [onNavigate]);

  const toggleMenu = useCallback(() => setIsOpen((open) => !open), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur shadow transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 md:px-4 lg:px-8 py-2 md:py-3">
        <div className="flex items-center space-x-2 md:space-x-3 text-ieee-600">
          <img src="/images/header/ieee.png" alt="IEEE Logo" loading="eager" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
          <div className="h-6 md:h-8 w-px bg-slate-300 hidden sm:block"></div>
          <img src="/images/header/YorkU.png" alt="York University" loading="eager" className="h-8 md:h-10 w-auto object-contain hidden sm:block" />
          <div className="flex flex-col leading-tight">
            <span className="text-base md:text-lg font-bold text-slate-900">IEEE YorkU</span>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.15em] md:tracking-[0.25em] text-slate-500 hidden sm:block">Student Branch</span>
          </div>
        </div>

        <nav className="hidden items-center space-x-6 md:flex">
          {navItemsConfig.map(({ name, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`border-b-2 border-transparent pb-1 text-sm font-bold uppercase tracking-wide transition-colors
                ${currentSection === path ? "border-yorku-red text-yorku-red" : "text-slate-700 hover:text-ieee-600"}`}
            >
              {name}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span className="text-2xl leading-none">{isOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      <div className={`md:hidden ${isOpen ? "max-h-64" : "max-h-0"} overflow-hidden border-t border-slate-100 bg-white transition-all duration-300`}> 
        <nav className="flex flex-col space-y-1 px-4 py-4">
          {navItemsConfig.map(({ name, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                currentSection === path ? "bg-ieee-50 text-ieee-600" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  currentSection: PropTypes.string.isRequired
};

export default Header;
