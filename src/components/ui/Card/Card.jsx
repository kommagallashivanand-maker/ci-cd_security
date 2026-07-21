import PropTypes from "prop-types";
import clsx from "clsx";

import "./Card.css";

/**
 * Card
 *
 * Generic content container with an optional header title. Used to
 * group related information (stats, forms, tables) on a page.
 *
 * @param {string} [title] - Optional header title.
 * @param {"sm"|"md"|"lg"} [padding="md"] - Inner padding.
 * @param {"sm"|"md"|"lg"} [shadow="md"] - Elevation shadow.
 *
 * @example
 * <Card title="Team overview">
 *   <p>Content goes here.</p>
 * </Card>
 */
export default function Card({
  children,
  title = "",
  padding = "md",
  shadow = "md",
}) {
  return (
    <div
      className={clsx(
        "card",
        `card--padding-${padding}`,
        `card--shadow-${shadow}`
      )}
    >
      {title && (
        <div className="card__header">
          <h3 className="card__title">{title}</h3>
        </div>
      )}

      <div className="card__body">
        {children}
      </div>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  padding: PropTypes.oneOf(["sm", "md", "lg"]),
  shadow: PropTypes.oneOf(["sm", "md", "lg"]),
};
