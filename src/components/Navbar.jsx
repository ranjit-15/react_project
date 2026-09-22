// Navbar.jsx
// The top navigation bar that appears on every page.
// It shows the app logo/brand and links to the Home and Favorites pages.
// On mobile, links collapse behind a hamburger menu button.

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// Props:
//   favoritesCount — number of saved favorites, shown as a badge on the Favorites link
function Navbar({ favoritesCount }) {
  // Controls whether the mobile menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  // Close the menu when the user taps a link (good UX on mobile)
  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        {/* Brand logo */}
        <NavLink to="/" className="navbar__brand" onClick={handleLinkClick}>
          <span className="navbar__brand-icon">🍽️</span>
          Recipe<span>Finder</span>
        </NavLink>

        {/* Hamburger button — only visible on mobile */}
        <button
          className="navbar__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
        </button>

        {/* Navigation links */}
        <nav>
          <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
            <li>
              {/* NavLink automatically adds an "active" class when the route matches */}
              <NavLink to="/" end className="navbar__link" onClick={handleLinkClick}>
                🔍 Discover
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorites" className="navbar__link" onClick={handleLinkClick}>
                ❤️ Favorites
                {/* Show the badge only when the user has at least one favorite */}
                {favoritesCount > 0 && (
                  <span className="navbar__badge">{favoritesCount}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
