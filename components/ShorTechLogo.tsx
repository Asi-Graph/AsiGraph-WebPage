"use client";

interface ShorTechLogoProps {
  className?: string;
}

export default function ShorTechLogo({ className = "h-5 w-auto" }: ShorTechLogoProps) {
  const blueColor = "oklch(0.573 0.193 253.5)";
  const emeraldColor = "oklch(0.642 0.159 163.8)";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 160" className={className}>
      <style>{`
        .switch, .switchAlt { transform-origin: 405px 90px; transform-box: fill-box; }
        .switch {
          animation: switchOut 6s ease-in-out infinite, jump 6s ease-in-out infinite;
        }
        .switchAlt {
          animation: switchIn 6s ease-in-out infinite, jump 6s ease-in-out infinite;
        }
        @keyframes switchOut {
          0%, 20% { opacity: 1; }
          25%, 70% { opacity: 0; }
          75%, 100% { opacity: 1; }
        }
        @keyframes switchIn {
          0%, 20% { opacity: 0; }
          25%, 70% { opacity: 1; }
          75%, 100% { opacity: 0; }
        }
        @keyframes jump {
          0%, 20%, 70%, 100% { transform: scale(1) rotate(0deg); }
          24% { transform: scale(1.3) rotate(-15deg); }
          26% { transform: scale(1.3) rotate(15deg); }
          28% { transform: scale(1) rotate(0deg); }
          74% { transform: scale(1.3) rotate(-15deg); }
          76% { transform: scale(1.3) rotate(15deg); }
          78% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
      <g fontFamily="Segoe UI, sans-serif" fontWeight="900" fontSize="126" dominantBaseline="middle" textAnchor="start">
        <text x="20" y="90" fill={blueColor}>
          SHOR
        </text>
        <g>
          <text x="380" y="90" fill={emeraldColor} fontWeight="700" className="switch">
            T
          </text>
          <text x="380" y="90" fill={emeraldColor} fontWeight="700" className="switchAlt">
            t
          </text>
        </g>
        <text x="435" y="100" fontSize="60" fontWeight="500" fill={blueColor} letterSpacing="-1">
          ech
        </text>
      </g>
    </svg>
  );
}
