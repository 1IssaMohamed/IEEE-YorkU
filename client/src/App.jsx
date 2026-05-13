import { useCallback, useState, useMemo } from "react";

import { clubMission, pastEvents, team, sponsors } from "./data/siteData.js";
import HomePage from "./pages/Home.jsx";

// Gradient token configuration for different sections
// Each array represents semantic CSS variables: [start, mid, end]
const SECTION_GRADIENTS = {
  home: ["var(--color-surface-home-start)", "var(--color-surface-home-mid)", "var(--color-surface-home-end)"],
  about: ["var(--color-surface-about-start)", "var(--color-surface-about-mid)", "var(--color-surface-about-end)"],
  "past-events": ["var(--color-surface-events-start)", "var(--color-surface-events-mid)", "var(--color-surface-events-end)"],
  team: ["var(--color-surface-team-start)", "var(--color-surface-team-mid)", "var(--color-surface-team-end)"],
  contact: ["var(--color-surface-contact-start)", "var(--color-surface-contact-mid)", "var(--color-surface-contact-end)"],
  default: ["var(--color-surface-home-start)", "var(--color-surface-home-mid)", "var(--color-surface-home-end)"]
};

const App = () => {
  // State for UI control (navigation and forms)
  const [currentSection, setCurrentSection] = useState("home");
  const [modalMessage, setModalMessage] = useState(null);

  // Determine the active gradient based on the current section (memoized)
  const activeGradient = useMemo(
    () => SECTION_GRADIENTS[currentSection] ?? SECTION_GRADIENTS.default,
    [currentSection]
  );

  // Handler for manual navigation (clicking links)
  const handleNavigate = (section) => {
    setCurrentSection(section);
    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handler for scroll spy (updating active section as user scrolls)
  const handleSectionInView = useCallback((sectionId) => {
    setCurrentSection((prev) => (prev === sectionId ? prev : sectionId));
  }, []);

  // Memoize the close modal handler
  const handleCloseModal = useCallback(() => setModalMessage(null), []);

  return (
    <HomePage
      pastEvents={pastEvents}
      team={team}
      sponsors={sponsors}
      mission={clubMission}
      onNavigate={handleNavigate}
      currentSection={currentSection}
      onSectionInView={handleSectionInView}
      activeGradient={activeGradient}
      modalMessage={modalMessage}
      onCloseModal={handleCloseModal}
    />
  );
};

export default App;
