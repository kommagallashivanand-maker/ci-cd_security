import PropTypes from "prop-types";
import clsx from "clsx";

import "./Select.css";

/**
 * Select
 *
 * Labeled, controlled dropdown built on the native `<select>` for
 * full accessibility support. Pairs with `Input` inside forms.
 *
 * @param {string} id - Required, used to associate the `<label>`.
 * @param {string} [label]
 * @param {string} [value]
 * @param {(e: React.ChangeEvent) => void} [onChange]
 * @param {{value: string, label: string}[]} options - Required.
 * @param {string} [placeholder="Select an option"]
 * @param {string} [error]
 * @param {boolean} [required=false]
 * @param {boolean} [disabled=false]
 * @param {boolean} [fullWidth=true]
 *
 * @example
 * <Select
 *   id="priority"
 *   label="Priority"
 *   value={priority}
 *   onChange={(e) => setPriority(e.target.value)}
 *   options={[
 *     { value: "low", label: "Low" },
 *     { value: "high", label: "High" },
 *   ]}
 * />
 */
export default function Select({
  id,
  label = "",
  value = "",
  onChange,
  options,
  placeholder = "Select an option",
  error = "",
  required = false,
  disabled = false,
  fullWidth = true,
  ...selectProps
}) {
  return (
    <div
      className={clsx("select-group", {
        "select-group--full": fullWidth,
      })}
    >
      {label && (
        <label
          htmlFor={id}
          className="select-group__label"
        >
          {label}

          {required && (
            <span className="select-group__required">*</span>
          )}
        </label>
      )}

      <select
        id={id}
        className={clsx("select", {
          "select--error": error,
        })}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...selectProps}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="select-group__error">
          {error}
        </p>
      )}
    </div>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,

  label: PropTypes.string,

  value: PropTypes.string,

  onChange: PropTypes.func,

  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,

  placeholder: PropTypes.string,

  error: PropTypes.string,

  required: PropTypes.bool,

  disabled: PropTypes.bool,

  fullWidth: PropTypes.bool,
};
