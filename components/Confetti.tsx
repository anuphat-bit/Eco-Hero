
import React from 'react';

const CONFETTI_COUNT = 80;
const COLORS = ['#22c55e', '#facc15', '#38bdf8', '#a78bfa', '#f472b6'];

// Using a memoized component to prevent re-rendering of individual pieces
const ConfettiPiece = React.memo(({ style }: { style: React.CSSProperties }) => {
    return <div className="confetti-piece" style={style}></div>;
});

const Confetti: React.FC = () => {
    const pieces = React.useMemo(() => 
        Array.from({ length: CONFETTI_COUNT }).map((_, index) => {
            const style: React.CSSProperties = {
                left: `${Math.random() * 100}%`,
                backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
                animation: `confetti-fall ${Math.random() * 2 + 3}s ${Math.random() * 1}s ease-out forwards`,
                transform: `rotate(${Math.random() * 360}deg)` // Initial random rotation
            };
            return <ConfettiPiece key={index} style={style} />;
        }),
    []);

    return <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">{pieces}</div>;
};

export default Confetti;
