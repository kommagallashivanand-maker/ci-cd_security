import PropTypes from "prop-types";

import "./Container.css";

/**
 * Container
 *
 * Scrollable content area used inside `MainLayout` to wrap the
 * routed page content, keeping consistent page padding app-wide.
 *
 * @example
 * <Container>
 *   <Outlet />
 * </Container>
 */
export default function Container({ children }) {
  return (
    <main className="container">
      {children}
    </main>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};