import { useCallback, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

import api from "./api/client.js";
import HomePage from "./pages/Home.jsx";

// Theme configuration for different sections
// Each array represents a gradient: [startColor, midColor, endColor]
const SECTION_THEMES = {
  home: ["#dbeafe", "#f8fafc", "#ffffff"],
  about: ["#e2e8f0", "#f8fafc", "#ffffff"],
  events: ["#fff7ed", "#fffbeb", "#ffffff"],
  team: ["#dbeafe", "#eef2ff", "#ffffff"],
  contact: ["#e0e7ff", "#f1f5f9", "#ffffff"],
  default: ["#dbeafe", "#f8fafc", "#ffffff"]
};

const App = () => {
  // State for data fetched from the API
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [team, setTeam] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [mission, setMission] = useState("");

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI control (navigation and forms)
  const [currentSection, setCurrentSection] = useState("home");
  const [modalMessage, setModalMessage] = useState(null);

  // Determine the active theme based on the current section (memoized)
  const activeTheme = useMemo(
    () => SECTION_THEMES[currentSection] ?? SECTION_THEMES.default,
    [currentSection]
  );

  // Effect to fetch initial data when the component mounts
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel for better performance
        const [eventsRes, pastEventsRes, teamRes, sponsorsRes, infoRes] = await Promise.all([
          api.get("/events", { signal: controller.signal }),
          api.get("/past-events", { signal: controller.signal }),
          api.get("/team", { signal: controller.signal }),
          api.get("/sponsors", { signal: controller.signal }),
          api.get("/info", { signal: controller.signal })
        ]);

        setEvents(eventsRes.data ?? []);
        setPastEvents(pastEventsRes.data ?? []);
        setTeam(teamRes.data ?? []);
        setSponsors(sponsorsRes.data ?? []);
        setMission(infoRes.data?.mission ?? "");
      } catch (err) {
        // Don't set error if request was cancelled
        if (err.name !== "CanceledError") {
          console.error("Failed to load initial data", err);
          setError(err.message || "Failed to load data");
          setModalMessage({
            title: "Network Error",
            content: "We could not load the latest data. Please try again later."
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup: abort pending requests on unmount
    return () => controller.abort();
  }, []);

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
      events={events}
      pastEvents={pastEvents}
      team={team}
      sponsors={sponsors}
      mission={mission}
      isLoading={isLoading}
      error={error}
      onNavigate={handleNavigate}
      currentSection={currentSection}
      onSectionInView={handleSectionInView}
      activeTheme={activeTheme}
      modalMessage={modalMessage}
      onCloseModal={handleCloseModal}
    />
  );
};

export default App;
