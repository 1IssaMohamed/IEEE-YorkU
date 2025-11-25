import { useState } from "react";

const navItemsConfig = [
  { name: "Home", path: "home" },
  { name: "Events", path: "events" },
  { name: "Team", path: "team" },
  { name: "Join Us", path: "contact" }
];

const Header = ({ onNavigate, currentSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur shadow transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center space-x-2 text-ieee-600">
          <img src="/ieee.png" alt="IEEE Logo" className="h-10 w-10 object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-slate-900">IEEE YorkU</span>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Student Branch</span>
          </div>
        </div>

        <nav className="hidden items-center space-x-6 md:flex">
          {navItemsConfig.map(({ name, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`border-b-2 border-transparent pb-1 text-sm font-semibold uppercase tracking-wide transition-colors
                ${currentSection === path ? "border-ieee-500 text-ieee-600" : "text-slate-600 hover:text-ieee-600"}`}
            >
              {name}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
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

export default Header;
