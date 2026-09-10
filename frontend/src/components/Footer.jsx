export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Disclaimer Banner */}
      <div className="disclaimer-banner">
        <div className="disclaimer-icon-wrap">
          <span className="caduceus-icon" aria-hidden="true">⚕️</span>
        </div>
        <div className="disclaimer-text-group">
          <h4 className="disclaimer-heading">Educational & Research Use Only</h4>
          <p className="disclaimer-body">
            These AI predictions are experimental and should not be used to diagnose, treat, or make medical decisions. Always consult a qualified medical professional.
          </p>
        </div>
      </div>

      {/* Footer Bottom Credentials */}
      <div className="footer-meta-row">
        <div className="footer-brand">
          <span className="footer-logo">NeuroScan AI</span>
          <span className="footer-separator">•</span>
          <span className="footer-tagline">Brain MRI Classification • Educational Project</span>
        </div>

        <div className="footer-tech-stack">
          <span>Built with React + FastAPI + TensorFlow</span>
        </div>
      </div>
    </footer>
  );
}
