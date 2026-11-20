import React from 'react';

/**
 * Connector 1 to 2:
 * Starts at the bottom boundary of Stage 1 (directly under the right-side image),
 * travels down into Stage 2 ("Choose your interview track"), and DIVIDES into two lines:
 *  - Line 1: connects to the middle of the "Technical Interview" card on the left.
 *  - Line 2: connects to the middle of the "Coding & Algorithmic Problem" card.
 */
export const Connector1To2: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 -my-2 sm:-my-3 z-20 pointer-events-none select-none">
      <svg
        viewBox="0 0 1000 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <filter id="glowDotted" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#b4532a" floodOpacity="0.45" />
          </filter>
          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7d3418" />
            <stop offset="60%" stopColor="#b4532a" />
            <stop offset="100%" stopColor="#dfa84c" />
          </linearGradient>
        </defs>

        {/* 1. Origin Node at the bottom boundary of Stage 1 (under the right-side picture) */}
        <circle cx="735" cy="4" r="7" fill="#b4532a" stroke="#fff4de" strokeWidth="2.5" />
        <circle cx="735" cy="4" r="14" fill="rgba(180, 83, 42, 0.2)" className="animate-pulse" />

        {/* 2. Main stem descending from the Stage 1 boundary to the fork point */}
        <path
          d="M 735 4 L 735 44"
          stroke="#b4532a"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          className="animate-flow-dots"
          filter="url(#glowDotted)"
        />

        {/* 3. Fork / Division Junction Node */}
        <circle cx="735" cy="44" r="6" fill="#7d3418" stroke="#fff4de" strokeWidth="2" />
        <circle cx="735" cy="44" r="11" fill="rgba(125, 52, 24, 0.25)" />

        {/* 4. Branch 1: Curves to the left and connects to the middle of Technical Interview Card */}
        <path
          d="M 735 44 C 735 90, 185 70, 185 146"
          stroke="url(#streamGrad)"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          className="animate-flow-dots"
          filter="url(#glowDotted)"
        />
        {/* Destination Node: Technical Interview Card connection */}
        <circle cx="185" cy="146" r="6.5" fill="#b4532a" stroke="#fff4de" strokeWidth="2" />
        <circle cx="185" cy="146" r="12" fill="rgba(180, 83, 42, 0.25)" className="animate-pulse" />

        {/* 5. Branch 2: Curves and connects to the middle of Coding & Algorithmic Problem Card */}
        <path
          d="M 735 44 C 735 85, 785 85, 785 146"
          stroke="url(#streamGrad)"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          className="animate-flow-dots"
          filter="url(#glowDotted)"
        />
        {/* Destination Node: Coding & Algorithmic Problem Card connection */}
        <circle cx="785" cy="146" r="6.5" fill="#b4532a" stroke="#fff4de" strokeWidth="2" />
        <circle cx="785" cy="146" r="12" fill="rgba(180, 83, 42, 0.25)" className="animate-pulse" />

        {/* Decorative Badge Labels */}
        <g className="hidden sm:inline">
          <rect x="360" y="58" width="168" height="22" rx="11" fill="#faf0d8" stroke="rgba(58, 35, 24, 0.2)" strokeWidth="1" />
          <text x="444" y="73" textAnchor="middle" fill="#7d3418" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            Flows to Track Options ↴
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * Standard Connector between sequential stages (e.g. 2->3, 3->4, 4->5, 5->6, 6->7):
 * Descends from the previous card's bottom boundary into the next card with an animated flowing dotted line.
 */
export const ConnectorBetweenStages: React.FC<{
  title?: string;
  sourceX?: number; // 0 to 1000, defaults to center (500)
  targetX?: number; // 0 to 1000, defaults to center (500)
}> = ({ title, sourceX = 500, targetX = 500 }) => {
  const cpx1 = sourceX;
  const cpx2 = targetX;

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 -my-2 sm:-my-3 z-20 pointer-events-none select-none">
      <svg
        viewBox="0 0 1000 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <filter id="glowSingleDotted" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#b4532a" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Top Origin Anchor Node */}
        <circle cx={sourceX} cy="4" r="6.5" fill="#b4532a" stroke="#fff4de" strokeWidth="2" />
        <circle cx={sourceX} cy="4" r="12" fill="rgba(180, 83, 42, 0.2)" className="animate-pulse" />

        {/* Flowing Curved Dotted Line */}
        <path
          d={`M ${sourceX} 4 C ${cpx1} 45, ${cpx2} 65, ${targetX} 106`}
          stroke="#b4532a"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          className="animate-flow-dots"
          filter="url(#glowSingleDotted)"
        />

        {/* Bottom Destination Node */}
        <circle cx={targetX} cy="106" r="6.5" fill="#b4532a" stroke="#fff4de" strokeWidth="2" />
        <circle cx={targetX} cy="106" r="12" fill="rgba(180, 83, 42, 0.2)" className="animate-pulse" />

        {/* Optional Label Badge */}
        {title && (
          <g className="hidden sm:inline">
            <rect
              x={(sourceX + targetX) / 2 - 70}
              y="42"
              width="140"
              height="22"
              rx="11"
              fill="#faf0d8"
              stroke="rgba(58, 35, 24, 0.2)"
              strokeWidth="1"
            />
            <text
              x={(sourceX + targetX) / 2}
              y="57"
              textAnchor="middle"
              fill="#7d3418"
              fontSize="10"
              fontWeight="600"
              fontFamily="sans-serif"
            >
              {title} ↴
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
