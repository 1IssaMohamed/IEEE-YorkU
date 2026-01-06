import { useCallback, useEffect, useState } from "react";
import axios from "axios";

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

  // State for UI control (navigation and forms)
  const [currentSection, setCurrentSection] = useState("home");
  const [modalMessage, setModalMessage] = useState(null);

  // Determine the active theme based on the current section
  const activeTheme = SECTION_THEMES[currentSection] ?? SECTION_THEMES.default;

  // Effect to fetch initial data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [eventsRes, pastEventsRes, teamRes, sponsorsRes, infoRes] = await Promise.all([
          axios.get("/api/events"),
          axios.get("/api/past-events"),
          axios.get("/api/team"),
          axios.get("/api/sponsors"),
          axios.get("/api/info")
        ]);

        setEvents(eventsRes.data ?? []);
        setPastEvents(pastEventsRes.data ?? []);
        setTeam(teamRes.data ?? []);
        setSponsors(sponsorsRes.data ?? []);
        setMission(infoRes.data?.mission ?? "");
      } catch (error) {
        console.error("Failed to load initial data", error);
        setModalMessage({
          title: "Network Error",
          content: "We could not load the latest data. Please try again later."
        });
      }
    };

    fetchData();
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

  return (
    <HomePage
      events={events}
      pastEvents={pastEvents}
      team={team}
      sponsors={sponsors}
      mission={mission}
      onNavigate={handleNavigate}
      currentSection={currentSection}
      onSectionInView={handleSectionInView}
      activeTheme={activeTheme}
      modalMessage={modalMessage}
      onCloseModal={() => setModalMessage(null)}
    />
  );
};

export default App;
