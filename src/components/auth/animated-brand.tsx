
export function AnimatedBrand() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-secondary">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            {`
              .particle {
                animation: move 45s linear infinite;
              }
              .particle-1 { animation-delay: -1s; }
              .particle-2 { animation-delay: -2s; }
              .particle-3 { animation-delay: -3s; }
              .particle-4 { animation-delay: -4s; }
              .particle-5 { animation-delay: -5s; }
              /* ... add more if needed */

              @keyframes move {
                0% { transform: translate(0, 0) rotate(0deg); }
                10% { transform: translate(10vw, -15vh) rotate(36deg); }
                20% { transform: translate(-5vw, 10vh) rotate(72deg); }
                30% { transform: translate(15vw, 5vh) rotate(108deg); }
                40% { transform: translate(5vw, -20vh) rotate(144deg); }
                50% { transform: translate(-10vw, 15vh) rotate(180deg); }
                60% { transform: translate(20vw, -10vh) rotate(216deg); }
                70% { transform: translate(-15vw, -5vh) rotate(252deg); }
                80% { transform: translate(10vw, 10vh) rotate(288deg); }
                90% { transform: translate(-20vw, 0vh) rotate(324deg); }
                100% { transform: translate(0, 0) rotate(360deg); }
              }
            `}
          </style>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'hsla(var(--accent), 0.25)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'hsla(var(--chart-2), 0.15)', stopOpacity: 0.7 }} />
            <stop offset="100%" style={{ stopColor: 'hsla(var(--chart-4), 0.05)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => {
          const size = Math.random() * 15 + 8;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const delay = Math.random() * -45;
          return (
            <rect
              key={i}
              className="particle"
              style={{ animationDelay: `${delay}s` }}
              x={`${x}%`}
              y={`${y}%`}
              width={size}
              height={size}
              rx="4"
              fill="url(#grad1)"
              opacity={Math.random() * 0.4 + 0.1}
            />
          );
        })}
      </svg>
    </div>
  );
}
