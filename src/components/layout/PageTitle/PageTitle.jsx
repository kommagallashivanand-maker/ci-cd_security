import PropTypes from "prop-types";

import "./PageTitle.css";

/**
 * PageTitle
 *
 * Consistent page heading used at the top of every dashboard/page,
 * pairing a title with an optional supporting subtitle.
 *
 * @param {string} title
 * @param {string} [subtitle]
 *
 * @example
 * <PageTitle title="Admin Dashboard" subtitle="Welcome to DeskFlow." />
 */
export default function PageTitle({ title, subtitle = "" }) {
  return (
    <div className="page-title">
      <h1 className="page-title__heading">{title}</h1>

      {subtitle && (
        <p className="page-title__subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};
