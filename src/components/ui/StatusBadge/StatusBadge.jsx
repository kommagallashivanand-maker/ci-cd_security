import PropTypes from "prop-types";
import clsx from "clsx";

import "./StatusBadge.css";

const STATUS_CLASS_MAP = {
  approved: "status-badge--success",
  active: "status-badge--success",
  resolved: "status-badge--success",

  pending: "status-badge--warning",
  "in progress": "status-badge--info",

  rejected: "status-badge--danger",
  closed: "status-badge--secondary",

  open: "status-badge--primary",

  high: "status-badge--danger",
  medium: "status-badge--warning",
  low: "status-badge--success",
};

/**
 * StatusBadge
 *
 * Small pill that renders a status/priority label with a semantic
 * color derived from `STATUS_CLASS_MAP`. Matching is case-insensitive;
 * unrecognized values fall back to a neutral "secondary" style so the
 * badge never breaks on unexpected data.
 *
 * @param {string} status - e.g. "Approved", "Pending", "High".
 *
 * @example
 * <StatusBadge status="Pending" />
 * <StatusBadge status="High" />
 */
export default function StatusBadge({ status }) {
  const normalizedStatus = status.toLowerCase();

  const badgeClass =
    STATUS_CLASS_MAP[normalizedStatus] ||
    "status-badge--secondary";

  return (
    <span
      className={clsx(
        "status-badge",
        badgeClass
      )}
    >
      {status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};