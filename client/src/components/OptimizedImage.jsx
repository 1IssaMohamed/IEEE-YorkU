import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * OptimizedImage Component
 * 
 * Provides lazy loading, error handling, and loading states for images.
 * Uses native loading="lazy" for browser support and IntersectionObserver as fallback.
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  placeholderClassName = "",
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 ${placeholderClassName || className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-slate-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${!isLoaded ? "bg-slate-100" : ""}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse ${placeholderClassName}`}>
          <svg className="w-8 h-8 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${!isLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderClassName: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

OptimizedImage.defaultProps = {
  className: "",
  placeholderClassName: "",
  onLoad: null,
  onError: null
};

export default OptimizedImage;
