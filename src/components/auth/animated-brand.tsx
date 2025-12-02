export function AnimatedBrand() {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-secondary">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
          <defs>
            <pattern id="circuit" patternUnits="userSpaceOnUse" width="80" height="80">
              <path d="M 10 10 L 30 10 L 30 30 L 10 30 Z" fill="none" stroke="hsl(var(--accent))" strokeWidth="1"/>
              <path d="M 0 40 L 80 40 M 40 0 L 40 80" fill="none" stroke="hsl(var(--accent))" strokeWidth="0.5"/>
              <circle cx="10" cy="10" r="2" fill="hsl(var(--accent))">
                <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="70" r="2" fill="hsl(var(--accent))">
                 <animate attributeName="r" values="2;3;2" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
              </circle>
               <circle cx="30" cy="50" r="1.5" fill="hsl(var(--accent))">
                 <animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" begin="1s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>
    );
  }
  