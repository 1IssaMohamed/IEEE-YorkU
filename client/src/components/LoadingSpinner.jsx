import PropTypes from "prop-types";

/**
 * Loading Spinner Component
 * Displays a spinning animation during loading states
 */
const LoadingSpinner = ({ size = "lg", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`animate-spin rounded-full border-ieee-600 border-t-transparent ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm font-medium text-slate-600">{message}</p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  message: PropTypes.string
};

LoadingSpinner.defaultProps = {
  size: "lg",
  message: "Loading..."
};

export default LoadingSpinner;
