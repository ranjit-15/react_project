// LoadingSpinner.jsx
// A simple animated loading indicator shown while the app is fetching data from the API.
// Giving users visual feedback (instead of a blank screen) is essential for good UX.

import './LoadingSpinner.css';

// Props:
//   message — optional text to display below the spinner (defaults to "Loading…")
function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      {/* The spinning ring */}
      <div className="loading-spinner__ring" aria-hidden="true" />
      {/* Screen-reader-friendly label */}
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
