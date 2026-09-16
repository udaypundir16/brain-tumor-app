import { useState, useEffect } from 'react';

export default function ProbabilityBar({
  displayName,
  probability,
  isTopMatch,
}) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const targetPercent = Math.min(100, Math.max(0, probability * 100));
    const timer = setTimeout(() => {
      setAnimatedWidth(targetPercent);
    }, 60);
    return () => clearTimeout(timer);
  }, [probability]);

  const percentageString = (probability * 100).toFixed(1) + '%';

  return (
    <div className={`probability-bar-row ${isTopMatch ? 'is-top-match' : ''}`}>
      <div className="prob-row-header">
        <div className="prob-class-name-wrap">
          <span className="prob-class-name">{displayName}</span>
          {isTopMatch && <span className="top-match-badge">TOP MATCH</span>}
        </div>
        <span className="prob-percentage-val">{percentageString}</span>
      </div>

      <div className="prob-track">
        <div
          className={`prob-fill ${isTopMatch ? 'prob-fill-top' : ''}`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
}
