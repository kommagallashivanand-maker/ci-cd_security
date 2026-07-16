import PropTypes from "prop-types";

import "./PublicLayout.css";

export default function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <main className="public-layout__content">
        {children}
      </main>
    </div>
  );
}

PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};