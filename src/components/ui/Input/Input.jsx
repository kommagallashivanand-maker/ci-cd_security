import PropTypes from "prop-types";
import clsx from "clsx";

import "./Input.css";

/**
 * Input
 *
 * Labeled, controlled text input with built-in error and required
 * states. Intended for use inside forms alongside `Select`.
 *
 * @param {string} id - Required, used to associate the `<label>`.
 * @param {string} [label]
 * @param {"text"|"email"|"password"|"number"|"search"|"tel"} [type="text"]
 * @param {string} [placeholder]
 * @param {string|number} [value]
 * @param {(e: React.ChangeEvent) => void} [onChange]
 * @param {string} [error] - Validation message; renders red border + helper text.
 * @param {boolean} [required=false]
 * @param {boolean} [disabled=false]
 * @param {boolean} [fullWidth=true]
 *
 * @example
 * <Input
 *   id="subject"
 *   label="Subject"
 *   value={subject}
 *   onChange={(e) => setSubject(e.target.value)}
 *   required
 * />
 */
export default function Input({
  id,
  label = "",
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  error = "",
  required = false,
  disabled = false,
  fullWidth = true,
}) {
  return (
    <div
      className={clsx("input-group", {
        "input-group--full": fullWidth,
      })}
    >
      {label && (
        <label
          htmlFor={id}
          className="input-group__label"
        >
          {label}

          {required && (
            <span className="input-group__required">*</span>
          )}
        </label>
      )}

      <input
        id={id}
        className={clsx("input", {
          "input--error": error,
        })}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />

      {error && (
        <p className="input-group__error">
          {error}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,

  label: PropTypes.string,

  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "search",
    "tel",
  ]),

  placeholder: PropTypes.string,

  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  onChange: PropTypes.func,

  error: PropTypes.string,

  required: PropTypes.bool,

  disabled: PropTypes.bool,

  fullWidth: PropTypes.bool,
};
