import { useRef, useState } from 'react';

export default function UploadCard({
  selectedFile,
  previewUrl,
  loading,
  onFileSelect,
  onClear,
  onPredict,
  onSelectSample,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="panel-card upload-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">MRI Scan Input</h2>
          <p className="panel-subtitle">Upload axial, sagittal, or coronal MRI slice</p>
        </div>
        <div className="card-badge">STEP 1</div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id="mri-image-input"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="visually-hidden"
        onChange={handleInputChange}
      />

      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragOver ? 'drop-zone-active' : ''} ${
          previewUrl ? 'drop-zone-has-file' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
      >
        {!previewUrl ? (
          /* Empty State: Upload Prompt */
          <div className="drop-zone-content">
            <div className="drop-zone-icon-ring">
              <svg className="upload-brain-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
              </svg>
            </div>

            <h3 className="drop-zone-title">Upload Brain MRI</h3>
            <p className="drop-zone-lead">Drag & drop your MRI image here</p>
            <span className="drop-zone-divider">or</span>

            <button
              type="button"
              className="btn-browse"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse files
            </button>

            <div className="drop-zone-format-badge">
              <span>Supported: JPG, JPEG, PNG, WEBP</span>
            </div>
          </div>
        ) : (
          /* Loaded State: Medical Image Viewport with PACS Crosshairs */
          <div className="preview-viewport-wrapper">
            <div className="pacs-viewport">
              {/* Corner crosshairs for clinical imaging feel */}
              <div className="corner-tick tick-tl" />
              <div className="corner-tick tick-tr" />
              <div className="corner-tick tick-bl" />
              <div className="corner-tick tick-br" />

              <div className="pacs-overlay-header">
                <span className="pacs-meta">SLICE: AXIAL T1/T2</span>
                <span className="pacs-meta">NORM: 224×224</span>
              </div>

              <img
                src={previewUrl}
                alt="Uploaded brain MRI preview"
                className="mri-preview-img"
              />

              <div className="pacs-overlay-footer">
                <span className="pacs-filename" title={selectedFile?.name}>
                  {selectedFile?.name}
                </span>
                <span className="pacs-size">
                  {formatFileSize(selectedFile?.size)}
                </span>
              </div>
            </div>

            {/* Preview Controls */}
            <div className="preview-actions-bar">
              <button
                type="button"
                className="btn-text-action"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <svg className="action-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Change Image
              </button>

              <button
                type="button"
                className="btn-text-action btn-text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
              >
                <svg className="action-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Sample Selector */}
      <div className="sample-scans-row">
        <span className="sample-label">Or try sample scan:</span>
        <div className="sample-buttons">
          <button
            type="button"
            className="btn-sample"
            disabled={loading}
            onClick={() => onSelectSample('/samples/sample_mri_glioma.jpg', 'sample_glioma_mri.jpg')}
          >
            Glioma Sample
          </button>
          <button
            type="button"
            className="btn-sample"
            disabled={loading}
            onClick={() => onSelectSample('/samples/sample_mri_meningioma.jpg', 'sample_meningioma_mri.jpg')}
          >
            Meningioma Sample
          </button>
          <button
            type="button"
            className="btn-sample"
            disabled={loading}
            onClick={() => onSelectSample('/samples/sample_mri_healthy.jpg', 'sample_healthy_mri.jpg')}
          >
            Healthy Sample
          </button>
        </div>
      </div>

      {/* Predict Button */}
      <div className="submit-action-wrapper">
        <button
          type="button"
          id="btn-analyze-mri"
          className="btn-analyze-primary"
          disabled={!selectedFile || loading}
          onClick={onPredict}
        >
          {loading ? (
            <>
              <span className="dual-ring-spinner" aria-hidden="true" />
              <span>Analyzing MRI...</span>
            </>
          ) : (
            <>
              <svg className="btn-spark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
              <span>Analyze MRI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
