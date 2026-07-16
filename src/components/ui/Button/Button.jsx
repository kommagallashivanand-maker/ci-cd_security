import PropTypes from "prop-types";
import clsx from "clsx";

import "./Button.css";

/**
 * Button
 *
 * Primary interactive element used across DeskFlow for actions and
 * form submissions. Visual style is driven entirely by design
 * tokens (see `styles/variables.css`) via the `variant` prop.
 *
 * @param {"primary"|"secondary"|"success"|"warning"|"danger"|"outline"} [variant="primary"]
 * @param {"sm"|"md"|"lg"} [size="md"]
 * @param {"button"|"submit"|"reset"} [type="button"]
 * @param {boolean} [fullWidth=false] - Stretch the button to fill its container.
 * @param {boolean} [disabled=false]
 * @param {() => void} [onClick]
 *
 * @example
 * <Button variant="primary" onClick={handleSave}>Save changes</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  const className = clsx(
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    {
      "btn--full-width": fullWidth,
    }
  );

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,

  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "outline",
  ]),

  size: PropTypes.oneOf([
    "sm",
    "md",
    "lg",
  ]),

  type: PropTypes.oneOf([
    "button",
    "submit",
    "reset",
  ]),

  fullWidth: PropTypes.bool,

  disabled: PropTypes.bool,

  onClick: PropTypes.func,
};
