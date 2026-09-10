export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge">OVERVIEW</span>
            <h3 className="modal-title">About NeuroScan AI</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-lead">
            NeuroScan AI is an educational deep learning demonstration evaluating the application of convolutional neural networks to medical brain imaging classification.
          </p>

          <h4 className="modal-section-title">Classification Categories</h4>
          <div className="category-cards-grid">
            <div className="category-info-card">
              <span className="cat-name">Glioma Tumor</span>
              <p className="cat-detail">
                Arises from glial cells (astrocytes, oligodendrocytes) within the brain parenchyma. Characterized by infiltrative growth patterns.
              </p>
            </div>

            <div className="category-info-card">
              <span className="cat-name">Meningioma Tumor</span>
              <p className="cat-detail">
                Originates in the meninges (membranes covering brain and spinal cord). Often extra-axial, benign, and slow-growing.
              </p>
            </div>

            <div className="category-info-card">
              <span className="cat-name">Pituitary Tumor</span>
              <p className="cat-detail">
                Develops in the pituitary gland at the base of the skull (sella turcica). Often pituitary adenomas impacting endocrine function.
              </p>
            </div>

            <div className="category-info-card">
              <span className="cat-name">No Tumor</span>
              <p className="cat-detail">
                Symmetric cerebral hemisphere contours, patent ventricles, and absence of mass effect or anomalous tissue hyperintensities.
              </p>
            </div>
          </div>

          <div className="modal-note-box">
            <p>
              <strong>Academic & Research Disclaimer:</strong> This interface is built strictly for scientific evaluation, academic coursework, and technology demonstrations. It must not be deployed as an approved clinical diagnostics software.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-modal-primary" onClick={onClose}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
