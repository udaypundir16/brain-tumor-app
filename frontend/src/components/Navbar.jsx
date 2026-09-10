import { useState } from 'react';

export default function Navbar({
  theme,
  toggleTheme,
  onOpenHowItWorks,
  onOpenAbout,
  onScrollToAnalysis,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (action) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={onScrollToAnalysis} role="button" tabIndex={0}>
          <div className="brand-icon-wrapper">
            <svg
              className="brain-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Modern stylized brain / neural network */}
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
            </svg>
          </div>
          <span className="brand-title">
            NeuroScan <span className="brand-ai">AI</span>
          </span>
          <span className="brand-badge">RESEARCH</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick(onScrollToAnalysis)}
          >
            Analysis
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick(onOpenHowItWorks)}
          >
            How It Works
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavClick(onOpenAbout)}
          >
            About
          </button>
        </nav>

        {/* Header Right: Theme Toggle + Mobile Menu Button */}
        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              // Sun icon for switching to light
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              // Moon icon for switching to dark
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
              </svg>
            )}
            <span className="theme-label-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation">
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleNavClick(onScrollToAnalysis)}
          >
            Analysis
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleNavClick(onOpenHowItWorks)}
          >
            How It Works
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleNavClick(onOpenAbout)}
          >
            About
          </button>
        </div>
      )}
    </header>
  );
}
