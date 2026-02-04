import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import EventCard from "../components/EventCard.jsx";
import SponsorRibbon from "../components/SponsorRibbon.jsx";
import TeamCard from "../components/TeamCard.jsx";
import MessageModal from "../components/MessageModal.jsx";
import PastEventsCarousel from "../components/PastEventsCarousel.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const sponsors = [
  { id: 'amd', name: "AMD", url: "https://www.amd.com", logo: "/images/sponsors/AMD-logo.png" },
  { id: 'pw', name: "Pratt & Whitney", url: "https://www.prattwhitney.com", logo: "/images/sponsors/pratt&whitney-logo.png" },
  { id: 'opg', name: "OPG", url: "https://www.opg.com", logo: "/images/sponsors/ontario power generation-lgoo.png" },
  { id: 'telus', name: "Telus", url: "https://www.telus.com", logo: "/images/sponsors/telus-logo.png" },
  { id: 'dell', name: "Dell", url: "https://www.dell.com", logo: "/images/sponsors/dell-logo.png" },
  { id: 'ttc', name: "TTC", url: "https://www.ttc.ca", logo: "/images/sponsors/ttc-logo.png" },
  { id: 'rbc', name: "RBC", url: "https://www.rbc.com", logo: "/images/sponsors/RBC_logo_PNG1.png" },
  { id: 'kpm', name: "KPM Power", url: "https://www.kpmpower.com", logo: "/images/sponsors/kpm_power-logo.jpg" },
  { id: 'quanser', name: "Quanser", url: "https://www.quanser.com", logo: "/images/sponsors/quanser-logo.jpg" },
  { id: 'alphawave', name: "AlphaWave Semi", url: "https://www.alphawavesemi.com", logo: "/images/sponsors/alphawave-semi-logo.png" },
  { id: 'pantheon', name: "Pantheon", url: "https://www.pantheonprototyping.com", logo: "/images/sponsors/Pantheon_Gold_Horizontal_Logo.png" },
  { id: 'protospace', name: "Protospace", url: "https://lassonde.yorku.ca/protospace", logo: "/images/sponsors/PROTOSPACE-logo.png" },
  { id: 'ulkasemi', name: "Ulkasemi", url: "https://www.ulkasemi.com", logo: "/images/sponsors/ULKASEMI_LOGO_EPS_V1-01_1_Converted-01.jpg" },
  { id: 'deadline', name: "Deadline", url: "https://deadlinecreative.com", logo: "/images/sponsors/DLC_LOGO.png" },
];

const HomePage = ({
  events,
  pastEvents,
  team,
  mission,
  isLoading,
  error,
  onNavigate,
  currentSection,
  onSectionInView,
  activeTheme,
  modalMessage,
  onCloseModal
}) => {
  // State to track which sections have been revealed (for animation)
  const [visibleSections, setVisibleSections] = useState({ home: true });

  // Destructure the active theme colors
  const [start = "#dbeafe", mid = "#f8fafc", end = "#ffffff"] = activeTheme ?? [];

  // Create the gradient string for the background (memoized)
  const gradientBackground = useMemo(
    () => `linear-gradient(135deg, ${start}, ${mid}, ${end})`,
    [start, mid, end]
  );

  // Effect to set up the IntersectionObserver for scroll detection
  useEffect(() => {
    if (!onSectionInView) {
      return undefined;
    }

    // Select all sections with an ID
    const sections = Array.from(document.querySelectorAll("section[id]"));

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
          if (entry.intersectionRatio >= 0.55) {
            onSectionInView(id);
          }
        });
      },
      { threshold: [0.25, 0.55] } // Trigger at 25% and 55% visibility
    );

    // Start observing
    sections.forEach((section) => observer.observe(section));

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, [onSectionInView]);

  // Helper to generate classes for reveal animations
  const revealClass = (id) => (
    visibleSections[id]
      ? "opacity-100 translate-y-0" // Visible state
      : "opacity-100 translate-y-0"   // Always visible - removed hidden state
  );

  return (
    <div className="relative min-h-screen">
      {/* Background gradient layer */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-80 transition-all duration-700 ease-out"
          style={{ background: gradientBackground, transition: "background 0.7s ease" }}
        />
      </div>

      {/* Navigation Header */}
      <Header onNavigate={onNavigate} currentSection={currentSection} />

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
            <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-ieee-50/30 backdrop-blur">
              <div className={`mx-auto max-w-5xl px-4 md:px-6 transform transition-all duration-700 ease-out ${revealClass("about")}`}>
                <h2 className="border-b-4 border-ieee-600 pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  About IEEE YorkU
                </h2>
                <p className="mx-auto mt-8 max-w-3xl text-center text-lg text-slate-700">
                  {mission}
                </p>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {[
                    { title: "Workshops", description: "Hands-on experience in emerging tech." },
                    { title: "Industry Links", description: "Networking events and career support." },
                    { title: "Community", description: "Collaborative projects and mentorship." }
                  ].map(({ title, description }) => (
                    <div key={title} className="rounded-2xl border-t-4 border-ieee-600 bg-white p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                      <h3 className="text-xl font-bold text-ieee-600">{title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Hardware Design Club Section */}
            <section id="hardware-club" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-ieee-50 relative overflow-hidden">
               {/* Decorative Background Elements */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute top-10 left-10 w-64 h-64 bg-ieee-400/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-10 right-10 w-96 h-96 bg-yorku-red/5 rounded-full blur-3xl" />
               </div>

               <div className={`relative mx-auto max-w-4xl px-4 md:px-6 text-center transform transition-all duration-700 ease-out ${revealClass("hardware-club")}`}>
                  
                  <h2 className="border-b-4 border-ieee-600 pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                    Hardware Design Club
                  </h2>

                  <p className="mx-auto mt-8 max-w-3xl text-center text-lg text-slate-700">
                    Building <span className="font-bold text-ieee-600">Real Projects</span> with <span className="font-bold text-yorku-red">Real World Standards</span>.
                  </p>

                  <div className="mx-auto mt-8 mb-12 max-w-3xl text-center text-lg text-slate-600 space-y-4">
                     <p>
                        This is an official extension of the IEEE YorkU club dedicated to bridging the gap between theory and practice. 
                        We focus on <strong className="text-slate-900">ASICs</strong>, <strong className="text-slate-900">FPGAs</strong>, <strong className="text-slate-900">RTL Design</strong>, and <strong className="text-slate-900">Computer Architecture</strong>.
                     </p>
                     <p>
                        Join us for our weekly meetings where we dive deep into technical documentation, collaborate on complex designs, and build hardware that matters.
                     </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <a 
                       href="#" 
                       className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-ieee-600 rounded-full hover:bg-ieee-700 hover:shadow-lg hover:shadow-ieee-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ieee-600 w-full sm:w-auto"
                     >
                       Join the Team
                       <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                     </a>
                     
                     <a 
                       href="mailto:contact@ieee.yorku.ca" 
                       className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-slate-700 transition-all duration-200 bg-white border-2 border-slate-200 rounded-full hover:border-ieee-300 hover:text-ieee-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 w-full sm:w-auto"
                     >
                        Contact Us
                     </a>
                  </div>

               </div>
            </section>

            {/* Past Events Gallery Section */}
            <section id="past-events" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-white backdrop-blur">
              <div className={`mx-auto max-w-6xl px-4 md:px-6 transform transition-all duration-700 ease-out ${revealClass("past-events")}`}>
                <h2 className="border-b-4 border-yorku-red pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  Past Events Gallery
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-700">
                  Relive the highlights from our recent events and workshops
                </p>
                <div className="mt-10">
                  <PastEventsCarousel pastEvents={pastEvents} />
                </div>
              </div>
            </section>

            {/* Upcoming Events Section */}
            <section id="events" className="py-16 md:py-24 bg-gradient-to-br from-ieee-50/40 via-white to-slate-50 backdrop-blur">
              <div className={`mx-auto max-w-6xl px-4 md:px-6 transform transition-all duration-700 ease-out ${revealClass("events")}`}>
                <h2 className="border-b-4 border-ieee-600 pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  Upcoming Events
                </h2>
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </section>

            {/* Sponsors Section */}
            <section className="py-16 md:py-24 bg-white border-y border-slate-100">
              <div className="mx-auto max-w-6xl px-4 md:px-6 mb-12 text-center">
                <h2 className="border-b-4 border-ieee-600 pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  Sponsored by:
                </h2>
              </div>
              <SponsorRibbon sponsors={sponsors} />
            </section>

            {/* Team Section */}
            <section id="team" className="py-16 md:py-24 bg-gradient-to-br from-white via-slate-50 to-yorku-red/5 backdrop-blur">
              <div className={`mx-auto max-w-7xl px-4 md:px-6 transform transition-all duration-700 ease-out ${revealClass("team")}`}>
                <h2 className="border-b-4 border-yorku-red pb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">
                  Meet the Executive Team
                </h2>
                
                {/* Org Chart Layout */}
                {team && team.length > 0 && (
                  <div className="mt-12 space-y-16">
                    
                    {/* Section A: Executive Team - Hierarchical Layout */}
                    <div className="flex flex-col items-center">
                      <div className="mb-8">
                        <span className="inline-block rounded-full bg-slate-800 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white">
                          Executives
                        </span>
                      </div>
                      
                      {/* Tier 1: Chair */}
                      {team.filter(m => m.role === 'Chair').map((member) => (
                        <div key={member.id} className="w-72 mb-6">
                          <TeamCard member={member} level="leadership" />
                        </div>
                      ))}

                      {/* Connection Line */}
                      <div className="h-8 w-1 bg-ieee-600 mb-6"></div>

                      {/* Tier 2: Vice-Chair */}
                      {team.filter(m => m.role === 'Vice-Chair').map((member) => (
                        <div key={member.id} className="w-72 mb-6">
                          <TeamCard member={member} />
                        </div>
                      ))}

                      {/* Connection Line */}
                      <div className="h-8 w-1 bg-ieee-600 mb-6"></div>

                      {/* Tier 3: Other Executives */}
                      <div className="flex flex-wrap justify-center gap-8 max-w-5xl">
                        {team.filter(m => 
                          m.group === 'executive' && 
                          m.role !== 'Chair' && 
                          m.role !== 'Vice-Chair'
                        ).map((member) => (
                          <div key={member.id} className="w-72">
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
                      <div className="flex flex-wrap justify-center gap-6 max-w-6xl">
                        {team.filter((member) => member.group === 'director').map((member) => (
                          <div key={member.id} className="w-72">
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

      <footer id="contact" className="bg-slate-900 py-12 text-center text-slate-300">
        <div className="mx-auto max-w-4xl px-4">
          <h3 className="mb-6 text-2xl font-bold text-white">CONTACT US</h3>
          
          <div className="mb-8">
            <p className="text-lg font-medium text-slate-400">Email</p>
            <a href="mailto:ieee@yorku.ca" className="text-xl text-ieee-100 hover:text-white transition-colors">
              ieee@yorku.ca
            </a>
          </div>

          <div className="flex justify-center space-x-8 mb-10">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group transition-transform hover:-translate-y-1" aria-label="Visit IEEE YorkU on Instagram">
              <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                {/* Instagram Icon */}
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08zm3.543 1.922c-1.163.032-2.85.032-4.013.032-1.163 0-2.85 0-4.013-.032-1.044-.03-1.621-.162-2.045-.327a3.001 3.001 0 00-1.12-.73c-.447-.176-.954-.367-1.93-.413-1.133-.053-1.48-.066-4.196-.066-.344 0-.688.002-1.03.007-2.567.043-2.912.056-3.968.102-.976.046-1.483.237-1.93.413a3.001 3.001 0 00-1.12.73 3.001 3.001 0 00-.73 1.12c-.165.424-.297 1.001-.327 2.045-.046 1.056-.059 1.401-.102 3.968-.005.342.007.686.007-1.03 0-2.716.013 3.063.066 4.196.046.976.237 1.483.413 1.93.176.447.43.836.73 1.12.284.3.673.554 1.12.73.447.176.954.367 1.93.413 1.133.053 1.48.066 4.196.066.344 0 .688-.002 1.03-.007 2.567-.043 2.912-.056 3.968-.102.976-.046 1.483-.237 1.93-.413a3.001 3.001 0 001.12-.73 3.001 3.001 0 00.73-1.12c.165-.424.297-1.001.327-2.045.046-1.056.059-1.401.102-3.968.005-.342.007-.686.007-1.03 0-2.716-.013-3.063-.066-4.196-.046-.976-.237-1.483-.413-1.93a3.001 3.001 0 00-.73-1.12 3.001 3.001 0 00-1.12-.73c-.447-.176-.954-.367-1.93-.413-1.133-.053-1.48-.066-4.196-.066zM12.315 7.063a4.937 4.937 0 110 9.874 4.937 4.937 0 010-9.874zm0 1.922a3.015 3.015 0 100 6.03 3.015 3.015 0 000-6.03zm5.338-3.205a1.281 1.281 0 110 2.562 1.281 1.281 0 010-2.562z" clipRule="evenodd" />
                </svg>
              </div>
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group transition-transform hover:-translate-y-1" aria-label="Connect with IEEE YorkU on LinkedIn">
              <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                {/* LinkedIn Icon */}
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </div>
            </a>

            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group transition-transform hover:-translate-y-1" aria-label="View IEEE YorkU projects on GitHub">
              <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                {/* GitHub Icon */}
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          </div>

          <div className="mt-10 border-t border-slate-700 pt-8">
            <p className="text-sm text-slate-400 mb-2">Affiliated with IEEE Region 7 | IEEE Toronto Section</p>
            <p className="text-xs text-slate-500">York University Lassonde School of Engineering</p>
          </div>

          <p className="mt-6 text-sm text-slate-500">&copy; {new Date().getFullYear()} IEEE York University Student Branch. All rights reserved.</p>
        </div>
      </footer>

      <MessageModal message={modalMessage} onClose={onCloseModal} />
    </div>
  );
};

// PropTypes for type checking
HomePage.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string,
      location: PropTypes.string,
      category: PropTypes.string,
      images: PropTypes.array
    })
  ),
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
  mission: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  currentSection: PropTypes.string.isRequired,
  onSectionInView: PropTypes.func,
  activeTheme: PropTypes.arrayOf(PropTypes.string),
  modalMessage: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string
  }),
  onCloseModal: PropTypes.func.isRequired
};

HomePage.defaultProps = {
  events: [],
  pastEvents: [],
  team: [],
  mission: "",
  isLoading: false,
  error: null,
  onSectionInView: null,
  activeTheme: ["#dbeafe", "#f8fafc", "#ffffff"],
  modalMessage: null
};

export default HomePage;
