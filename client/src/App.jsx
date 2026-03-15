import { useCallback, useEffect, useState, useMemo } from "react";

import api from "./api/client.js";
import HomePage from "./pages/Home.jsx";

// Gradient token configuration for different sections
// Each array represents semantic CSS variables: [start, mid, end]
const SECTION_GRADIENTS = {
  home: ["var(--color-surface-home-start)", "var(--color-surface-home-mid)", "var(--color-surface-home-end)"],
  about: ["var(--color-surface-about-start)", "var(--color-surface-about-mid)", "var(--color-surface-about-end)"],
  events: ["var(--color-surface-events-start)", "var(--color-surface-events-mid)", "var(--color-surface-events-end)"],
  team: ["var(--color-surface-team-start)", "var(--color-surface-team-mid)", "var(--color-surface-team-end)"],
  contact: ["var(--color-surface-contact-start)", "var(--color-surface-contact-mid)", "var(--color-surface-contact-end)"],
  default: ["var(--color-surface-home-start)", "var(--color-surface-home-mid)", "var(--color-surface-home-end)"]
};

const App = () => {
  // State for data fetched from the API
  const [pastEvents, setPastEvents] = useState([]);
  const [team, setTeam] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [mission, setMission] = useState("");
  const [sponsorLoading, setSponsorLoading] = useState(true);
  const [sponsorError, setSponsorError] = useState(null);

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI control (navigation and forms)
  const [currentSection, setCurrentSection] = useState("home");
  const [modalMessage, setModalMessage] = useState(null);

  // Determine the active gradient based on the current section (memoized)
  const activeGradient = useMemo(
    () => SECTION_GRADIENTS[currentSection] ?? SECTION_GRADIENTS.default,
    [currentSection]
  );

  const fetchSponsors = useCallback(async (signal) => {
    setSponsorLoading(true);
    setSponsorError(null);

    try {
      const response = await api.get("/sponsors", { signal });
      setSponsors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const requestCanceled = err?.name === "CanceledError" || err?.code === "ERR_CANCELED";
      if (!requestCanceled) {
        console.error("Failed to load sponsors", err);
        setSponsors([]);
        setSponsorError(err?.message || "Failed to load sponsors");
      }
    } finally {
      if (!signal?.aborted) {
        setSponsorLoading(false);
      }
    }
  }, []);

  // Effect to fetch initial data when the component mounts
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch core page data in parallel; sponsors are handled separately with their own retry path.
        const [pastEventsRes, teamRes, infoRes] = await Promise.all([
          api.get("/past-events", { signal: controller.signal }),
          api.get("/team", { signal: controller.signal }),
          api.get("/info", { signal: controller.signal })
        ]);

        setPastEvents(pastEventsRes.data ?? []);
        setTeam(teamRes.data ?? []);
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
    fetchSponsors(controller.signal);

    // Cleanup: abort pending requests on unmount
    return () => controller.abort();
  }, [fetchSponsors]);

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
  const handleRetrySponsors = useCallback(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  return (
    <HomePage
      pastEvents={pastEvents}
      team={team}
      sponsors={sponsors}
      sponsorLoading={sponsorLoading}
      sponsorError={sponsorError}
      onRetrySponsors={handleRetrySponsors}
      mission={mission}
      isLoading={isLoading}
      error={error}
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
