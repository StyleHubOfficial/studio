export function AnimatedBrand() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-secondary">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            {`
              .particle {
                animation: move 25s linear infinite;
              }
              .particle-1 { animation-delay: -0.5s; }
              .particle-2 { animation-delay: -1s; }
              .particle-3 { animation-delay: -1.5s; }
              .particle-4 { animation-delay: -2s; }
              .particle-5 { animation-delay: -2.5s; }
              /* ... add more if needed */

              @keyframes move {
                0% { transform: translate(0, 0); }
                10% { transform: translate(10vw, -15vh); }
                20% { transform: translate(-5vw, 10vh); }
                30% { transform: translate(15vw, 5vh); }
                40% { transform: translate(5vw, -20vh); }
                50% { transform: translate(-10vw, 15vh); }
                60% { transform: translate(20vw, -10vh); }
                70% { transform: translate(-15vw, -5vh); }
                80% { transform: translate(10vw, 10vh); }
                90% { transform: translate(-20vw, 0vh); }
                100% { transform: translate(0, 0); }
              }
            `}
          </style>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'hsla(var(--accent), 0.3)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsla(var(--accent), 0)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 100 + 50;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const delay = Math.random() * -25;
          return (
            <circle
              key={i}
              className="particle"
              style={{ animationDelay: `${delay}s` }}
              cx={`${x}%`}
              cy={`${y}%`}
              r={size}
              fill="url(#grad1)"
              opacity={Math.random() * 0.1 + 0.05}
            />
          );
        })}
      </svg>
    </div>
  );
}
