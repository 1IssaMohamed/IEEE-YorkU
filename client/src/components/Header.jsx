import { useState, useCallback } from "react";
import PropTypes from "prop-types";

const navItemsConfig = [
  { name: "Home", path: "home" },
  { name: "About", path: "about" },
  { name: "Hardware", path: "hardware-club" },
  { name: "Events", path: "past-events" },
  { name: "Team", path: "team" },
  { name: "Contact", path: "contact" }
];

const Header = ({ onNavigate, currentSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = useCallback((path) => {
    onNavigate(path);
    setIsOpen(false);
  }, [onNavigate]);

  const toggleMenu = useCallback(() => setIsOpen((open) => !open), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 transition-[background-color,border-color] duration-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 md:px-4 md:py-3 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="flex min-w-0 items-center space-x-2 text-ieee-700 transition-colors hover:text-ieee-800 focus:outline-none focus:ring-2 focus:ring-ieee-600 focus:ring-offset-2 md:space-x-3"
          aria-label="Go to home section"
        >
          <img src="/images/header/ieee.png" alt="IEEE Logo" loading="eager" className="h-8 w-8 object-contain md:h-10 md:w-10" />
          <div className="hidden h-6 w-px bg-slate-300 sm:block md:h-8"></div>
          <img src="/images/header/YorkU.png" alt="York University" loading="eager" className="hidden h-8 w-auto object-contain sm:block md:h-10" />
        </button>

        <nav className="hidden items-center space-x-6 md:flex" aria-label="Primary navigation">
          {navItemsConfig.map(({ name, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              aria-current={currentSection === path ? "page" : undefined}
              className={`min-h-11 border-b-2 border-transparent pb-1 text-sm font-semibold uppercase tracking-wide transition-[color,border-color,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ieee-600 focus:ring-offset-2
                ${currentSection === path ? "border-ieee-700 text-ieee-700" : "text-slate-700 hover:text-ieee-700"}`}
            >
              {name}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 transition-[background-color,transform] duration-200 hover:bg-slate-100 motion-safe:active:scale-95 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span className="text-2xl leading-none">{isOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      <div className={`md:hidden ${isOpen ? "max-h-96" : "max-h-0"} overflow-hidden border-t border-slate-200 bg-white transition-[max-height] duration-300`}>
        <nav id="mobile-navigation" className="flex flex-col space-y-1 px-4 py-4" aria-label="Mobile navigation">
          {navItemsConfig.map(({ name, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              aria-current={currentSection === path ? "page" : undefined}
              className={`min-h-11 rounded-lg px-3 py-2 text-left text-sm font-medium transition-[color,background-color,transform,border-color] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ieee-600 focus:ring-offset-2 ${
                currentSection === path ? "border border-ieee-200 bg-ieee-100 text-ieee-800" : "border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100"
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
