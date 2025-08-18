import React from 'react';

interface KafkasderLogoProps {
  className?: string;
}

const KafkasderLogo: React.FC<KafkasderLogoProps> = ({ className = "" }) => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mx-auto mb-8 ${className}`}
    >
      {/* Outer circle */}
      <circle
        cx="60"
        cy="60"
        r="55"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Inner geometric pattern */}
      <g className="text-blue-600 dark:text-blue-400">
        <path
          d="M30 60 L60 30 L90 60 L60 90 Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="15"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.1"
        />
      </g>
      
      {/* Text */}
      <text
        x="60"
        y="105"
        textAnchor="middle"
        className="text-sm font-bold fill-current text-gray-700 dark:text-gray-300"
      >
        KAFKASDER
      </text>
    </svg>
  );
};

export default KafkasderLogo;