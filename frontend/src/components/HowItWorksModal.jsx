export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge">ARCHITECTURE</span>
            <h3 className="modal-title">How NeuroScan AI Works</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-lead">
            NeuroScan AI classifies magnetic resonance imaging (MRI) slices through a standardized deep convolutional pipeline.
          </p>

          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-num">01</div>
              <div className="step-content">
                <h4 className="step-heading">Standardized Tensor Normalization</h4>
                <p className="step-desc">
                  Uploaded image scans are decoded, transformed to 3-channel RGB, resized to an exact 224×224 resolution matrix, and normalized with floating point values in the range [0.0, 1.0].
                </p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-num">02</div>
              <div className="step-content">
                <h4 className="step-heading">Deep Convolutional Feature Extraction</h4>
                <p className="step-desc">
                  Pre-trained convolutional blocks extract multi-scale spatial representations: detecting edge anomalies, mass density, tissue symmetry, and morphological distortions.
                </p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-num">03</div>
              <div className="step-content">
                <h4 className="step-heading">Softmax Multi-Class Probability Distribution</h4>
                <p className="step-desc">
                  The dense output layer computes normalized exponential probabilities across Glioma, Meningioma, Pituitary, and No Tumor categories, highlighting the highest-ranking class.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-modal-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
