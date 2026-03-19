import { useCallback, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import SponsorRibbon from "../components/SponsorRibbon.jsx";
import TeamCard from "../components/TeamCard.jsx";
import MessageModal from "../components/MessageModal.jsx";
import PastEventsCarousel from "../components/PastEventsCarousel.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import HardwareInviteModal from "../components/HardwareInviteModal.jsx";

const footerSocialLinks = [
  { label: "Instagram", href: "https://example.com/ieee-yorku-instagram" },
  { label: "LinkedIn", href: "https://example.com/ieee-yorku-linkedin" },
  { label: "GitHub", href: "https://example.com/ieee-yorku-github" }
];

const aboutTabItems = [
  {
    id: "workshops",
    label: "Workshops",
    summary: "Build-first sessions in hardware, software, and systems.",
    detail: "Members work through practical technical sessions that focus on applied engineering skills, not just theory."
  },
  {
    id: "industry-links",
    label: "Industry Links",
    summary: "Mentorship, career nights, and direct conversations with engineers.",
    detail: "We connect students with professionals through networking events and guided conversations about real roles and pathways."
  },
  {
    id: "community",
    label: "Community",
    summary: "A student-led space to test ideas, collaborate, and keep learning.",
    detail: "You join peers who prototype together, share feedback, and support each other across projects and semesters."
  }
];

const HomePage = ({
  pastEvents,
  team,
  sponsors,
  sponsorLoading,
  sponsorError,
  onRetrySponsors,
  mission,
  isLoading,
  error,
  onNavigate,
  currentSection,
  onSectionInView,
  activeGradient,
  modalMessage,
  onCloseModal
}) => {
  // State to track which sections have been revealed (for animation)
  const [visibleSections, setVisibleSections] = useState({ home: true });
  const [activeAboutTab, setActiveAboutTab] = useState(aboutTabItems[0].id);
  const [isHardwareInviteModalOpen, setIsHardwareInviteModalOpen] = useState(false);

  // Destructure the active section gradient colors
  const [
    start = "var(--color-surface-home-start)",
    mid = "var(--color-surface-home-mid)",
    end = "var(--color-surface-home-end)"
  ] = activeGradient ?? [];

  // Create the gradient string for the background (memoized)
  const gradientBackground = useMemo(
    () => `linear-gradient(135deg, ${start}, ${mid}, ${end})`,
    [start, mid, end]
  );

  const sectionRevealClass = useCallback(
    (id) => (visibleSections[id] ? "motion-safe:animate-section-enter" : ""),
    [visibleSections]
  );

  const activeAboutItem = aboutTabItems.find((item) => item.id === activeAboutTab) ?? aboutTabItems[0];

  // Effect to set up the IntersectionObserver for scroll detection
  useEffect(() => {
    // Select all major content regions with an ID
    const sections = Array.from(document.querySelectorAll("section[id], footer[id]"));

    if (!sections.length) {
      return undefined;
    }

    // Create an observer to watch for sections entering the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { id } = entry.target;
          if (!id) {
            return;
          }

          // If section is intersecting, mark it as visible (for reveal animation)
          if (entry.isIntersecting) {
            setVisibleSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
          }

          // If section takes up enough space, update the active navigation state
          if (entry.intersectionRatio >= 0.55 && typeof onSectionInView === "function") {
            onSectionInView(id);
          }
        });
      },
      { threshold: [0.18, 0.55], rootMargin: "0px 0px -8% 0px" } // Trigger reveal early, nav update at stronger visibility
    );

    // Start observing
    sections.forEach((section) => observer.observe(section));

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, [onSectionInView]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background gradient layer */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-80 transition-opacity duration-700 ease-out"
          style={{ background: gradientBackground, transition: "background 0.7s ease" }}
        />
      </div>

      {/* Navigation Header */}
      <Header
        onNavigate={onNavigate}
        currentSection={currentSection}
      />

      <main className="pt-16">
        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <p className="text-lg font-semibold text-red-600">Something went wrong</p>
              <p className="mt-2 text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content - only show when not loading */}
        {!isLoading && !error && (
          <>
            {/* Hero Section */}
            <HeroSection onNavigate={onNavigate} isVisible={Boolean(visibleSections.home)} />

            {/* About Section */}
            <section
              id="about"
              className={`relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-ieee-100/60 py-16 md:py-24 ${sectionRevealClass("about")}`}
            >
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ieee-400/90 to-transparent ${visibleSections.about ? "motion-safe:animate-divider-sweep" : ""}`} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className={`absolute -top-16 right-8 h-56 w-56 rounded-full bg-ieee-400/10 blur-3xl ${visibleSections.about ? "motion-safe:animate-ambient-drift" : ""}`} />
              </div>
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ieee-300/90 to-transparent ${visibleSections.about ? "motion-safe:animate-divider-sweep" : ""}`} />
              <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-6">
                <h2 className="border-b-4 border-ieee-600 pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  About IEEE YorkU
                </h2>
                <p className="mx-auto mt-8 max-w-3xl text-center text-lg text-slate-700">
                  {mission}
                </p>
                <div className="mt-10" role="tablist" aria-label="About IEEE YorkU highlights">
                  <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3 rounded-2xl border border-ieee-100 bg-white/90 p-3">
                    {aboutTabItems.map((item) => {
                      const isActive = activeAboutTab === item.id;

                      return (
                        <button
                          key={item.id}
                          id={`about-tab-${item.id}`}
                          role="tab"
                          type="button"
                          aria-selected={isActive}
                          aria-controls={`about-panel-${item.id}`}
                          onClick={() => setActiveAboutTab(item.id)}
                          className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold transition-[border-color,background-color,color,transform,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ieee-700 focus:ring-offset-2 ${
                            isActive
                              ? "border-ieee-700 bg-ieee-700 text-white shadow-sm shadow-ieee-900/15"
                              : "border-slate-300 bg-slate-50 text-slate-800 hover:border-ieee-500 hover:bg-ieee-50 hover:text-ieee-800"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    key={activeAboutItem.id}
                    id={`about-panel-${activeAboutItem.id}`}
                    role="tabpanel"
                    aria-labelledby={`about-tab-${activeAboutItem.id}`}
                    className={`mx-auto mt-6 max-w-3xl rounded-2xl border border-slate-300 bg-white p-6 text-center shadow-sm ${visibleSections.about ? "motion-safe:animate-card-enter" : ""}`}
                  >
                    <p className="text-lg font-bold text-ieee-800">{activeAboutItem.label}</p>
                    <p className="mt-3 text-base text-slate-800">{activeAboutItem.summary}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{activeAboutItem.detail}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hardware Design Club Section */}
            <section
              id="hardware-club"
              className={`relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-ieee-50 py-16 md:py-24 ${sectionRevealClass("hardware-club")}`}
            >
               <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ieee-300/90 to-transparent ${visibleSections["hardware-club"] ? "motion-safe:animate-divider-sweep" : ""}`} />
               {/* Decorative Background Elements */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className={`absolute top-10 left-10 h-64 w-64 rounded-full bg-ieee-400/5 blur-3xl ${visibleSections["hardware-club"] ? "motion-safe:animate-ambient-drift" : ""}`} />
                <div className={`absolute bottom-10 right-10 h-96 w-96 rounded-full bg-yorku-red/5 blur-3xl ${visibleSections["hardware-club"] ? "motion-safe:animate-ambient-drift-reverse" : ""}`} />
              </div>
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ieee-200/80 to-transparent ${visibleSections["hardware-club"] ? "motion-safe:animate-divider-sweep" : ""}`} />

              <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6 text-center">
                  
                  <h2 className="border-b-4 border-ieee-600 pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                    Hardware Design Club
                  </h2>

                  <p className="mx-auto mt-8 max-w-3xl text-center text-lg text-slate-700">
                    Learn by doing: from <span className="font-bold text-ieee-600">RTL and FPGA workflows</span> to <span className="font-bold text-yorku-red">review-ready engineering practice</span>.
                  </p>

                  <div className="mx-auto mt-8 mb-12 max-w-3xl space-y-4 text-center text-base text-slate-600 sm:text-lg">
                     <p>
                      The Hardware Design Club is an IEEE YorkU initiative for students who want deeper technical practice beyond coursework.
                      We focus on <strong className="text-slate-900">ASIC concepts</strong>, <strong className="text-slate-900">FPGA prototyping</strong>, <strong className="text-slate-900">RTL design</strong>, and <strong className="text-slate-900">computer architecture</strong>.
                     </p>
                     <p>
                      Weekly meetings combine guided technical sessions, collaborative project work, and practical reviews so members can build confidence with real engineering workflows.
                     </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button
                       type="button"
                       onClick={() => setIsHardwareInviteModalOpen(true)}
                       className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-ieee-600 px-8 py-3.5 text-base font-bold text-white transition-[background-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] hover:bg-ieee-700 hover:shadow-lg hover:shadow-ieee-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ieee-600 sm:w-auto"
                      aria-haspopup="dialog"
                     >
                       Join Hardware Team
                       <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                     </button>
                     
                     <a 
                       href="mailto:contact@ieee.yorku.ca" 
                       className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-bold text-slate-700 transition-[color,background-color,border-color,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] hover:border-ieee-300 hover:bg-slate-50 hover:text-ieee-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 sm:w-auto"
                     >
                      Talk to Us
                     </a>
                  </div>

               </div>
            </section>

            {/* Past Events Gallery Section */}
            <section
              id="past-events"
              className={`relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white py-16 md:py-24 ${sectionRevealClass("past-events")}`}
            >
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yorku-red/70 to-transparent ${visibleSections["past-events"] ? "motion-safe:animate-divider-sweep" : ""}`} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className={`absolute bottom-8 left-6 h-64 w-64 rounded-full bg-yorku-red/8 blur-3xl ${visibleSections["past-events"] ? "motion-safe:animate-ambient-drift" : ""}`} />
              </div>
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yorku-red/60 to-transparent ${visibleSections["past-events"] ? "motion-safe:animate-divider-sweep" : ""}`} />
              <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
                <h2 className="border-b-4 border-yorku-red pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  Past Events Gallery
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-700">
                  See what we built, hosted, and learned together.
                </p>
                <div className="mt-10">
                  <PastEventsCarousel pastEvents={pastEvents} />
                </div>
              </div>
            </section>

            {/* Sponsors Section */}
            <section
              id="sponsors"
              className={`relative scroll-mt-24 overflow-hidden border-y border-slate-100 bg-white py-16 md:py-24 ${sectionRevealClass("sponsors")}`}
            >
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ieee-300/90 to-transparent ${visibleSections.sponsors ? "motion-safe:animate-divider-sweep" : ""}`} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className={`absolute -top-16 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-ieee-300/10 blur-3xl ${visibleSections.sponsors ? "motion-safe:animate-ambient-drift-reverse" : ""}`} />
              </div>
              <div className="relative z-10">
                <div className="mx-auto mb-12 max-w-6xl px-4 text-center md:px-6">
                  <h2 className="border-b-4 border-ieee-600 pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                    Supported by Partners and Sponsors
                  </h2>
                </div>
                {sponsorLoading ? (
                  <div className="flex min-h-[12rem] items-center justify-center px-4">
                    <LoadingSpinner size="md" message="Loading sponsors..." />
                  </div>
                ) : sponsorError ? (
                  <div className="mx-auto max-w-3xl px-4 text-center" role="alert">
                    <p className="text-base font-semibold text-red-700">Unable to load sponsors right now.</p>
                    <p className="mt-2 text-sm text-slate-600 [overflow-wrap:anywhere]">{sponsorError}</p>
                    <button
                      type="button"
                      onClick={onRetrySponsors}
                      className="mt-5 min-h-11 rounded-md bg-ieee-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-ieee-700 focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2"
                    >
                      Retry loading sponsors
                    </button>
                  </div>
                ) : (
                  <SponsorRibbon sponsors={sponsors} />
                )}
              </div>
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ieee-200/80 to-transparent ${visibleSections.sponsors ? "motion-safe:animate-divider-sweep" : ""}`} />
            </section>

            {/* Team Section */}
            <section
              id="team"
              className={`relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-yorku-red/5 py-16 md:py-24 ${sectionRevealClass("team")}`}
            >
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yorku-red/70 to-transparent ${visibleSections.team ? "motion-safe:animate-divider-sweep" : ""}`} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className={`absolute top-10 right-8 h-72 w-72 rounded-full bg-yorku-red/8 blur-3xl ${visibleSections.team ? "motion-safe:animate-ambient-drift" : ""}`} />
              </div>
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yorku-red/60 to-transparent ${visibleSections.team ? "motion-safe:animate-divider-sweep" : ""}`} />
              <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
                <h2 className="border-b-4 border-yorku-red pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  Meet the Student Leadership Team
                </h2>
                
                {/* Org Chart Layout */}
                {team && team.length > 0 && (
                  <div className="mt-12 space-y-16">
                    
                    {/* Section A: Executive Team - Hierarchical Layout */}
                    <div className="flex flex-col items-center">
                      <div className="mb-8">
                        <span className="inline-block rounded-full bg-slate-800 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white">
                          Executive Team
                        </span>
                      </div>
                      
                      {/* Tier 1: Chair */}
                      {team.filter(m => m.role === "Chair").map((member) => (
                        <div key={member.id} className="mb-6 w-full max-w-[18rem]">
                          <TeamCard member={member} level="leadership" />
                        </div>
                      ))}

                      {/* Connection Line */}
                      <div className="h-8 w-1 bg-ieee-600 mb-6"></div>

                      {/* Tier 2: Vice-Chair */}
                      {team.filter(m => m.role === "Vice-Chair").map((member) => (
                        <div key={member.id} className="mb-6 w-full max-w-[18rem]">
                          <TeamCard member={member} />
                        </div>
                      ))}

                      {/* Connection Line */}
                      <div className="h-8 w-1 bg-ieee-600 mb-6"></div>

                      {/* Tier 3: Other Executives */}
                      <div className="flex max-w-5xl flex-wrap justify-center gap-8">
                        {team.filter((m) =>
                          m.group === "executive" &&
                          m.role !== "Chair" &&
                          m.role !== "Vice-Chair"
                        ).map((member) => (
                          <div key={member.id} className="w-full max-w-[18rem]">
                            <TeamCard member={member} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section B: Directors */}
                    <div className="flex flex-col items-center">
                      <div className="mb-8">
                        <span className="inline-block rounded-full bg-ieee-600 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white">
                          Directors
                        </span>
                      </div>
                      <div className="flex max-w-6xl flex-wrap justify-center gap-6">
                        {team.filter((member) => member.group === "director").map((member) => (
                          <div key={member.id} className="w-full max-w-[18rem]">
                            <TeamCard member={member} />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white py-10 text-slate-700 md:py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h3 className="text-xl font-bold text-slate-900 md:text-2xl">Contact IEEE YorkU</h3>

          <p className="mt-3 text-sm text-slate-600">
            Email:{" "}
            <a
              href="mailto:ieee@yorku.ca"
              className="font-semibold text-ieee-700 underline decoration-ieee-300 underline-offset-4 transition-colors hover:text-ieee-800 focus:outline-none focus:ring-2 focus:ring-ieee-600 focus:ring-offset-2"
            >
              ieee@yorku.ca
            </a>
          </p>

          <p className="mt-4 text-sm text-slate-600">Social links (placeholder URLs):</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {footerSocialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-ieee-700 focus:outline-none focus:ring-2 focus:ring-ieee-600 focus:ring-offset-2"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-500">&copy; {new Date().getFullYear()} IEEE York University Student Branch. All rights reserved.</p>
        </div>
      </footer>

      <HardwareInviteModal
        isOpen={isHardwareInviteModalOpen}
        onClose={() => setIsHardwareInviteModalOpen(false)}
      />
      <MessageModal message={modalMessage} onClose={onCloseModal} />
    </div>
  );
};

// PropTypes for type checking
HomePage.propTypes = {
  pastEvents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      images: PropTypes.array
    })
  ),
  team: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      role: PropTypes.string.isRequired
    })
  ),
  sponsors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      url: PropTypes.string,
      logo: PropTypes.string
    })
  ),
  sponsorLoading: PropTypes.bool,
  sponsorError: PropTypes.string,
  onRetrySponsors: PropTypes.func,
  mission: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  currentSection: PropTypes.string.isRequired,
  onSectionInView: PropTypes.func,
  activeGradient: PropTypes.arrayOf(PropTypes.string),
  modalMessage: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string
  }),
  onCloseModal: PropTypes.func.isRequired
};

HomePage.defaultProps = {
  pastEvents: [],
  team: [],
  sponsors: [],
  sponsorLoading: false,
  sponsorError: null,
  onRetrySponsors: () => {},
  mission: "",
  isLoading: false,
  error: null,
  onSectionInView: null,
  activeGradient: ["var(--color-surface-home-start)", "var(--color-surface-home-mid)", "var(--color-surface-home-end)"],
  modalMessage: null
};

export default HomePage;
