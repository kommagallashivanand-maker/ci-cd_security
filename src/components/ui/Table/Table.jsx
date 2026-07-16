import PropTypes from "prop-types";

import "./Table.css";

/**
 * Table
 *
 * Generic, presentational data table. Columns declare how each field
 * should be rendered, so the same component can display tickets,
 * users, activity logs, etc. without modification.
 *
 * @param {{key: string, header: string, render?: (value, row) => React.ReactNode}[]} columns
 *   `key` must match a field on each row. `render` is optional and
 *   lets a column output custom content (e.g. a `StatusBadge`).
 * @param {object[]} data - Rows to display; each row should have a
 *   unique `id` field, used as the React key.
 * @param {string} [emptyMessage="No records found."]
 *
 * @example
 * <Table
 *   columns={[
 *     { key: "title", header: "Ticket" },
 *     { key: "status", header: "Status", render: (v) => <StatusBadge status={v} /> },
 *   ]}
 *   data={tickets}
 * />
 */
export default function Table({
  columns,
  data,
  emptyMessage = "No records found.",
}) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="table__empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(
                          row[column.key],
                          row
                        )
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,

  data: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,

  emptyMessage: PropTypes.string,
};