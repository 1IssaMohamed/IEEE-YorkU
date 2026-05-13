import { Component } from "react";
import PropTypes from "prop-types";

/**
 * Error Boundary Component
 *
 * Catches unhandled JavaScript errors anywhere in its child component tree and
 * renders a fallback UI instead of crashing the whole application to a white screen.
 *
 * Must be a class component — React hooks do not support error boundaries.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You could send this to an error reporting service in production
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-xl font-bold text-slate-900">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            An unexpected error occurred. Please refresh the page to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-11 rounded-lg bg-ieee-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-ieee-700 focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
