import PropTypes from "prop-types";

/**
 * Infinite Scrolling Sponsor Ribbon
 * 
 * Continuously scrolls sponsor logos from right to left
 * Duplicates logos to create seamless infinite loop effect
 */
const SponsorRibbon = ({ sponsors }) => {
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  // Duplicate sponsors array to create seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div className="relative overflow-hidden bg-white py-8">
      {/* Fade edges for smooth appearance */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent" />

      {/* Scrolling container */}
      <div className="flex animate-scroll-left space-x-16">
        {duplicatedSponsors.map((sponsor, index) => (
          <div
            key={`${sponsor.id}-${index}`}
            className="flex flex-shrink-0 items-center justify-center"
          >
            {sponsor.logo ? (
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                loading="lazy"
                decoding="async"
                className="h-16 w-auto object-contain grayscale opacity-60 transition hover:grayscale-0 hover:opacity-100"
              />
            ) : (
              <div className="flex h-16 items-center justify-center rounded-lg bg-slate-100 px-8">
                <span className="text-xl font-bold text-slate-400">{sponsor.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

SponsorRibbon.propTypes = {
  sponsors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string
    })
  )
};

SponsorRibbon.defaultProps = {
  sponsors: []
};

export default SponsorRibbon;
