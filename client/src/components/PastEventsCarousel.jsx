import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * Unified Past Events Carousel
 * 
 * Displays all past event images in one continuous carousel.
 * The event information (title, date, location) updates dynamically
 * based on which event's images are currently being displayed.
 */
const PastEventsCarousel = ({ pastEvents }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Flatten all images from all events into a single array (memoized)
  // Keep track of which event each image belongs to
  const allSlides = useMemo(() => 
    pastEvents.flatMap((event) =>
      event.images.map((image) => ({
        ...image,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        eventCategory: event.category
      }))
    ),
    [pastEvents]
  );

  // Determine which event we're currently showing based on the image index
  const currentSlide = allSlides[currentIndex];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || allSlides.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSlides.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, allSlides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);
    setIsAutoPlaying(false);
  }, [allSlides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allSlides.length);
    setIsAutoPlaying(false);
  }, [allSlides.length]);

  if (!allSlides || allSlides.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-slate-100">
        <p className="text-slate-400">No past events available</p>
      </div>
    );
  }

  // Category styling
  const categoryStyles = {
    Technical: "bg-blue-100 text-blue-800 border-blue-400",
    Professional: "bg-purple-100 text-purple-800 border-purple-400",
    Project: "bg-green-100 text-green-800 border-green-400"
  };

  const categoryStyle = categoryStyles[currentSlide.eventCategory] || categoryStyles.Technical;

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-slate-900 shadow-xl md:shadow-2xl touch-pan-y">
        {/* Image Display - Responsive aspect ratio */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
          {allSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? "translate-x-0 opacity-100"
                  : index < currentIndex
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              }`}
            >
              <img
                src={slide.url}
                alt={slide.caption || `Event slide ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
              {/* Dark gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          ))}

          {/* Event Info Overlay - Changes dynamically */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
            <div className="mx-auto max-w-5xl">
              {/* Category Badge */}
              <span className={`inline-block rounded-full px-3 md:px-4 py-1 md:py-1.5 text-xs font-semibold uppercase tracking-widest ${categoryStyle}`}>
                {currentSlide.eventCategory}
              </span>
              
              {/* Event Title */}
              <h3 className="mt-2 md:mt-3 text-xl md:text-3xl lg:text-4xl font-bold line-clamp-2">
                {currentSlide.eventTitle}
              </h3>
              
              {/* Event Details */}
              <div className="mt-2 md:mt-3 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm lg:text-base">
                <p className="flex items-center gap-1 md:gap-2">
                  <span aria-hidden="true">📅</span>
                  {currentSlide.eventDate}
                </p>
                <p className="flex items-center gap-1 md:gap-2">
                  <span aria-hidden="true">📍</span>
                  <span className="line-clamp-1">{currentSlide.eventLocation}</span>
                </p>
              </div>

              {/* Image Caption - Hidden on small mobile */}
              {currentSlide.caption && (
                <p className="mt-2 text-xs md:text-sm text-slate-300 hidden sm:block">
                  {currentSlide.caption}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Always visible on mobile */}
        {allSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 md:p-3 opacity-100 md:opacity-0 shadow-lg transition hover:bg-white hover:scale-110 md:group-hover:opacity-100 touch-manipulation"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 md:p-3 opacity-100 md:opacity-0 shadow-lg transition hover:bg-white hover:scale-110 md:group-hover:opacity-100 touch-manipulation"
              aria-label="Next image"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-ieee-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / allSlides.length) * 100}%` }}
          />
        </div>

        {/* Counter */}
        <div className="absolute right-3 md:right-6 top-3 md:top-6 rounded-full bg-black/60 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold text-white backdrop-blur">
          {currentIndex + 1} / {allSlides.length}
        </div>
      </div>

      {/* Dots Navigation - Hidden on mobile, shown on tablet+ */}
      {allSlides.length > 1 && allSlides.length <= 20 && (
        <div className="mt-4 md:mt-6 hidden sm:flex flex-wrap justify-center gap-1 md:gap-2">
          {allSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-ieee-500"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

PastEventsCarousel.propTypes = {
  pastEvents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string.isRequired,
      date: PropTypes.string,
      location: PropTypes.string,
      category: PropTypes.string,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
          caption: PropTypes.string
        })
      ).isRequired
    })
  ).isRequired
};

export default PastEventsCarousel;
