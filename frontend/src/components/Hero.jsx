export default function Hero({ modelStatus = 'online' }) {
  return (
    <section className="hero-section">
      {/* Background Animated Gradient Orbs */}
      <div className="hero-orb orb-primary" aria-hidden="true" />
      <div className="hero-orb orb-secondary" aria-hidden="true" />
      <div className="hero-orb orb-tertiary" aria-hidden="true" />

      <div className="hero-content">
        {/* Status Indicator */}
        <div className="status-pill-wrap">
          <div className="status-pill">
            <span
              className={`status-dot ${modelStatus === 'online' ? 'status-online' : 'status-offline'}`}
            />
            <span className="status-text">
              {modelStatus === 'online' ? 'AI MODEL ONLINE' : 'CHECKING MODEL STATUS'}
            </span>
          </div>
        </div>

        {/* Small Eyebrow Text */}
        <p className="hero-eyebrow">AI-POWERED BRAIN MRI ANALYSIS</p>

        {/* Main Heading */}
        <h1 className="hero-heading">
          Intelligent Brain MRI<br />
          <span className="heading-gradient">Classification</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Upload a brain MRI scan and explore an AI-powered classification across four categories.
        </p>

        {/* Tech Highlights */}
        <div className="hero-tags">
          <span className="hero-tag">
            <svg className="tag-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ResNet / CNN Architecture
          </span>
          <span className="hero-tag">
            <svg className="tag-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            224×224 High-Res Tensor Input
          </span>
          <span className="hero-tag">
            <svg className="tag-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            4-Class Softmax Probability
          </span>
        </div>
      </div>
    </section>
  );
}
