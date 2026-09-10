import ConfidenceGauge from './ConfidenceGauge';
import ProbabilityBar from './ProbabilityBar';

const CLASS_DISPLAY_NAMES = {
  glioma_tumor: 'Glioma Tumor',
  meningioma_tumor: 'Meningioma Tumor',
  no_tumor: 'No Tumor',
  pituitary_tumor: 'Pituitary Tumor',
};

const CLASS_DESCRIPTIONS = {
  glioma_tumor: 'Originated in glial supporting tissue; common primary brain neuroepithelial tumor.',
  meningioma_tumor: 'Arising from the meningeal coverings of the brain and spinal axis.',
  no_tumor: 'No evident abnormal tumor morphological features identified in this slice.',
  pituitary_tumor: 'Cellular growth localized at the sellar / pituitary region at the skull base.',
};

const CLASS_ORDER = [
  'glioma_tumor',
  'meningioma_tumor',
  'no_tumor',
  'pituitary_tumor',
];

export default function ResultsCard({
  result,
  loading,
  error,
  onClear,
  onRetry,
}) {
  const isHealthy = result && result.class === 'no_tumor';
  const predictedName = result ? CLASS_DISPLAY_NAMES[result.class] || result.class : '';
  const predictedDescription = result ? CLASS_DESCRIPTIONS[result.class] || '' : '';

  return (
    <div className="panel-card results-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Classification Results</h2>
          <p className="panel-subtitle">Neural network multi-class probability scoring</p>
        </div>
        <div className={`card-badge ${result ? 'badge-active' : ''}`}>
          {loading ? 'PROCESSING' : result ? 'COMPLETE' : 'AWAITING SCAN'}
        </div>
      </div>

      {/* Error state display */}
      {error && (
        <div className="error-card-wrapper" role="alert">
          <div className="error-icon-box">
            <svg className="error-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div className="error-content">
            <h4 className="error-title">Analysis Unsuccessful</h4>
            <p className="error-message">{error}</p>
            {onRetry && (
              <button type="button" className="btn-retry" onClick={onRetry}>
                Retry Analysis
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay / skeleton if analyzing */}
      {loading && (
        <div className="analyzing-state">
          <div className="radar-scanner">
            <div className="radar-circle circle-1" />
            <div className="radar-circle circle-2" />
            <div className="radar-circle circle-3" />
            <div className="radar-sweep" />
          </div>
          <h3 className="analyzing-title">Running Neural Inference</h3>
          <p className="analyzing-subtitle">Extracting deep spatial feature maps from MRI scan...</p>
        </div>
      )}

      {/* Empty State before prediction */}
      {!loading && !result && !error && (
        <div className="empty-results-state">
          <div className="empty-brain-icon-wrap">
            <svg className="empty-brain-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
            </svg>
          </div>
          <h3 className="empty-title">Ready for Analysis</h3>
          <p className="empty-description">
            Upload an MRI scan to begin classification. The model will output predictions across four tumor classes with relative confidence scores.
          </p>
          <div className="empty-categories-preview">
            <span className="cat-chip">Glioma</span>
            <span className="cat-chip">Meningioma</span>
            <span className="cat-chip">Pituitary</span>
            <span className="cat-chip">No Tumor</span>
          </div>
        </div>
      )}

      {/* Result State after prediction */}
      {!loading && result && (
        <div className="results-content-wrap">
          {/* Top Prediction Overview Banner */}
          <div className={`result-hero-box ${isHealthy ? 'box-healthy' : 'box-tumor'}`}>
            <div className="result-hero-text">
              <div className="result-eyebrow-row">
                <span className="result-eyebrow">AI PREDICTION</span>
                <span className={`result-tag ${isHealthy ? 'tag-healthy' : 'tag-tumor'}`}>
                  {isHealthy ? 'NON-PATHOLOGICAL SCAN' : 'CLASSIFIED PATHOLOGY'}
                </span>
              </div>
              <h3 className="result-class-name">
                {predictedName.toUpperCase()}
              </h3>
              <p className="result-class-desc">{predictedDescription}</p>
            </div>

            {/* Circular Confidence Meter */}
            <div className="result-gauge-wrap">
              <ConfidenceGauge confidence={result.confidence} />
            </div>
          </div>

          {/* Classification Probabilities Breakdown */}
          <div className="prob-breakdown-section">
            <div className="breakdown-header">
              <h4 className="breakdown-title">Classification Probabilities</h4>
              <span className="breakdown-meta">Softmax Output Distribution</span>
            </div>

            <div className="prob-bars-list">
              {CLASS_ORDER.map((classKey) => {
                const prob = result.all_probabilities[classKey] ?? 0;
                const isTop = classKey === result.class;
                const displayName = CLASS_DISPLAY_NAMES[classKey] || classKey;

                return (
                  <ProbabilityBar
                    key={classKey}
                    className={classKey}
                    displayName={displayName}
                    probability={prob}
                    isTopMatch={isTop}
                  />
                );
              })}
            </div>
          </div>

          {/* Clearly Visible Medical Advisory Callout */}
          <div className="advisory-callout" role="note">
            <svg className="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div className="advisory-text">
              <strong className="advisory-lead">Important:</strong> This AI prediction is experimental and should not be used to diagnose, treat, or make medical decisions. Always consult a qualified medical professional.
            </div>
          </div>

          {/* Action Row */}
          <div className="result-footer-actions">
            <button type="button" className="btn-reset" onClick={onClear}>
              <svg className="reset-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Clear & Analyze Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
