import PropTypes from "prop-types";
import clsx from "clsx";

import "./Loader.css";

/**
 * Loader
 *
 * A small animated spinner used to indicate an in-progress
 * async operation (data fetch, form submission, etc).
 *
 * @param {"sm"|"md"|"lg"} [size="md"] - Visual size of the spinner.
 * @param {string} [label] - Optional text shown next to the spinner.
 * @param {boolean} [fullPage=false] - Center the loader within its
 *   nearest positioned ancestor and take up the full available space.
 *   Useful for page-level or section-level loading states.
 *
 * @example
 * <Loader />
 * <Loader size="sm" label="Loading tickets..." />
 * <Loader fullPage label="Loading dashboard..." />
 */
export default function Loader({ size = "md", label = "", fullPage = false }) {
  return (
    <div
      className={clsx("loader", `loader--${size}`, {
        "loader--full-page": fullPage,
      })}
      role="status"
      aria-live="polite"
    >
      <span className="loader__spinner" />
      {label && <span className="loader__label">{label}</span>}
      <span className="loader__sr-only">Loading</span>
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  label: PropTypes.string,
  fullPage: PropTypes.bool,
};
