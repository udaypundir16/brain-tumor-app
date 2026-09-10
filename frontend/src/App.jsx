import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadCard from './components/UploadCard';
import ResultsCard from './components/ResultsCard';
import HowItWorksModal from './components/HowItWorksModal';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  // Theme state: dark | light (default from localStorage or system preference)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('neuroscan_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Sync theme to document element and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('neuroscan_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Backend model status check
  const [modelStatus, setModelStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:8000/health');
        if (res.ok && isMounted) {
          setModelStatus('online');
        } else if (isMounted) {
          setModelStatus('offline');
        }
      } catch {
        if (isMounted) setModelStatus('offline');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Analysis workflow state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Modals state
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const analysisSectionRef = useRef(null);

  const scrollToAnalysis = () => {
    analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('data:') && !previewUrl.startsWith('/')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, or WEBP).');
      return;
    }

    if (previewUrl && !previewUrl.startsWith('/')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    if (previewUrl && !previewUrl.startsWith('/')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  // Sample Scan Quick-Load
  const handleSelectSample = async (samplePath, filename) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(samplePath);
      if (!res.ok) throw new Error('Failed to load sample image');
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      handleFileSelect(file);
    } catch (err) {
      setError(`Error loading sample scan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Run Inference / Prediction
  const handlePredict = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Unable to parse server response. Invalid JSON format.');
      }

      if (!response.ok) {
        let message = 'Server error occurred.';
        if (data && data.detail) {
          if (typeof data.detail === 'string') {
            message = data.detail;
          } else if (Array.isArray(data.detail)) {
            message = data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
          } else {
            message = JSON.stringify(data.detail);
          }
        }
        throw new Error(message);
      }

      // Validate required response fields
      if (!data || !data.class || data.confidence === undefined || !data.all_probabilities) {
        throw new Error('Unexpected API response structure received from backend.');
      }

      setResult(data);
    } catch (err) {
      if (err.name === 'TypeError' && err.message.toLowerCase().includes('fetch')) {
        setError(
          'Unable to connect to the AI server. Please make sure the FastAPI backend is running on http://localhost:8000.'
        );
      } else {
        setError(err.message || 'An unexpected error occurred during prediction.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout" data-theme={theme}>
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onScrollToAnalysis={scrollToAnalysis}
      />

      {/* Main Content Area */}
      <div className="main-content-container">
        {/* Hero Section */}
        <Hero
          modelStatus={modelStatus}
          onStartAnalysis={scrollToAnalysis}
        />

        {/* Two-Column Analysis Dashboard */}
        <main
          ref={analysisSectionRef}
          id="analysis-section"
          className="analysis-grid-container"
        >
          {/* Left Column: MRI Upload Card */}
          <UploadCard
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            loading={loading}
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            onPredict={handlePredict}
            onSelectSample={handleSelectSample}
          />

          {/* Right Column: Prediction Results Card */}
          <ResultsCard
            result={result}
            loading={loading}
            error={error}
            onClear={handleClear}
            onRetry={handlePredict}
          />
        </main>
      </div>

      {/* Footer & Disclaimer */}
      <Footer />

      {/* Informational Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
