import { useState, useEffect } from "react";

const ImageCarousel = ({ images, autoPlayInterval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, images.length, autoPlayInterval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-slate-100">
        <p className="text-slate-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-lg bg-slate-900">
      {/* Main Image Display */}
      <div className="relative aspect-video w-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? "translate-x-0 opacity-100"
                : index < currentIndex
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.caption || `Slide ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-sm text-white">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-lg transition hover:bg-white group-hover:opacity-100"
            aria-label="Previous image"
          >
            <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 shadow-lg transition hover:bg-white group-hover:opacity-100"
            aria-label="Next image"
          >
            <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageCarousel;
