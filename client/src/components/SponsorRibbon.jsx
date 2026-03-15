import { useMemo, useState } from "react";
import PropTypes from "prop-types";

const TICKER_MAX_ITEMS = 24;

const canUseExternalUrl = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Individual Sponsor Item
 */
const SponsorItem = ({ sponsor }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const hasLogo = Boolean(sponsor.logo) && !imageFailed;

  return (
    <div className="flex h-32 w-60 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-ieee-300 hover:bg-white hover:shadow-md">
      {hasLogo ? (
        <img
          src={sponsor.logo}
          alt={`${sponsor.name} logo`}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          dir="auto"
          className="line-clamp-3 text-sm font-semibold leading-snug text-slate-700 [overflow-wrap:anywhere]"
        >
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
  const normalizedSponsors = useMemo(() => {
    if (!Array.isArray(sponsors)) {
      return [];
    }

    return sponsors
      .filter(Boolean)
      .map((sponsor, index) => {
        const name =
          typeof sponsor.name === "string" && sponsor.name.trim().length > 0
            ? sponsor.name.trim()
            : `Sponsor ${index + 1}`;

        const logo =
          typeof sponsor.logo === "string" && sponsor.logo.trim().length > 0
            ? sponsor.logo.trim()
            : "";

        const url = canUseExternalUrl(sponsor.url) ? sponsor.url : "";

        return {
          id: sponsor.id ?? `${name}-${index}`,
          name,
          logo,
          url,
        };
      });
  }, [sponsors]);

  if (normalizedSponsors.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 text-center" role="status" aria-live="polite">
        <p className="text-base font-medium text-slate-700">No sponsors available right now.</p>
        <p className="mt-2 text-sm text-slate-600">
          Interested in supporting IEEE YorkU? Email
          {" "}
          <a
            href="mailto:ieee@yorku.ca"
            className="font-semibold text-ieee-700 underline decoration-ieee-300 underline-offset-2"
          >
            ieee@yorku.ca
          </a>
          .
        </p>
      </div>
    );
  }

  const useTicker = normalizedSponsors.length > 1 && normalizedSponsors.length <= TICKER_MAX_ITEMS;

  const duplicatedSponsors = useTicker
    ? [...normalizedSponsors, ...normalizedSponsors, ...normalizedSponsors]
    : normalizedSponsors;

  return (
    <div className="relative overflow-hidden bg-white py-8">
      {useTicker && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent md:w-24" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent md:w-24" />
        </>
      )}

      <div
        className={
          useTicker
            ? "flex w-max items-center animate-scroll-left"
            : "grid grid-cols-1 justify-items-center gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3"
        }
        role="list"
        aria-label="Sponsors"
        aria-live="off"
      >
        {duplicatedSponsors.map((sponsor, index) => {
          const key = useTicker ? `${sponsor.id}-${index}` : `${sponsor.id}`;

          const sponsorContent = <SponsorItem sponsor={sponsor} />;

          if (!sponsor.url) {
            return (
              <div key={key} role="listitem" className="no-underline">
                {sponsorContent}
              </div>
            );
          }

          return (
            <a
              key={key}
              role="listitem"
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block min-h-11 no-underline focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2"
            >
              {sponsorContent}
            </a>
          );
        })}
      </div>
    </div>
  );
};

SponsorRibbon.propTypes = {
  sponsors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      url: PropTypes.string,
      logo: PropTypes.string,
    })
  ),
};

SponsorRibbon.defaultProps = {
  sponsors: [],
};

export default SponsorRibbon;
