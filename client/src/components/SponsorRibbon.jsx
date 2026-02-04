import PropTypes from "prop-types";

/**
 * Individual Sponsor Item - Supports Image or Text
 */
const SponsorItem = ({ sponsor }) => {
  return (
    <div className={`
      flex flex-shrink-0 items-center justify-center 
      w-60 h-32 mx-4 p-6
      bg-slate-50 rounded-lg border border-slate-200
      transition-all duration-300 hover:bg-white hover:shadow-md hover:border-ieee-300 hover:-translate-y-1
      ${sponsor.url ? 'cursor-pointer' : ''}
    `}
    onClick={() => sponsor.url && window.open(sponsor.url, '_blank')}
    >
       {sponsor.logo ? (
         <img 
           src={sponsor.logo} 
           alt={sponsor.name} 
           className="w-full h-full object-contain transition-all duration-300 transform hover:scale-105"
           loading="lazy"
         />
       ) : (
         <span className="text-lg font-bold text-center text-slate-600 hover:text-ieee-700 transition-colors break-words">
          {sponsor.name}
         </span>
       )}
    </div>
  );
};

SponsorItem.propTypes = {
  sponsor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    logo: PropTypes.string,
  }).isRequired,
};

/**
 * Infinite Scrolling Sponsor Ribbon
 * 
 * Continuously scrolls sponsor names from right to left
 * Duplicates items to create seamless infinite loop effect
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
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

      {/* Scrolling container */}
      <div className="flex w-max animate-scroll-left items-center hover:pause">
        {duplicatedSponsors.map((sponsor, index) => (
           sponsor.url ? (
            <a 
              key={`${sponsor.id}-${index}`} 
              href={sponsor.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block no-underline"
            >
              <SponsorItem sponsor={sponsor} />
            </a>
          ) : (
             <div key={`${sponsor.id}-${index}`}>
               <SponsorItem sponsor={sponsor} />
             </div>
          )
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
