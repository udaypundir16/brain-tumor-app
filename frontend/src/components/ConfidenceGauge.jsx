import { useState, useEffect } from 'react';

export default function ConfidenceGauge({ confidence }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const target = Math.min(100, Math.max(0, confidence * 100));
    
    const duration = 900; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(easedProgress * target);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [confidence]);

  const size = 136;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="confidence-gauge-container">
      <div className="gauge-svg-wrapper">
        <svg className="gauge-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Background track */}
          <circle
            className="gauge-bg-track"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated active circle */}
          <circle
            className="gauge-active-track"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            style={{ stroke: 'url(#gaugeGradient)' }}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>

        <div className="gauge-content">
          <span className="gauge-percentage">{animatedValue.toFixed(1)}%</span>
          <span className="gauge-label">Confidence</span>
        </div>
      </div>
    </div>
  );
}
