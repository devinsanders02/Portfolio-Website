import React from 'react';

export default function TopographicBg({ className = '', opacity = 0.15 }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#2C3E50" strokeWidth="0.5">
          <path d="M0,400 Q150,350 300,380 T600,360 T900,390 T1200,370" />
          <path d="M0,420 Q150,370 300,400 T600,380 T900,410 T1200,390" />
          <path d="M0,440 Q150,390 300,420 T600,400 T900,430 T1200,410" />
          <path d="M0,460 Q150,410 300,440 T600,420 T900,450 T1200,430" />
          <path d="M0,480 Q150,430 300,460 T600,440 T900,470 T1200,450" />
          <path d="M0,300 Q200,270 400,290 T800,280 T1200,300" />
          <path d="M0,320 Q200,290 400,310 T800,300 T1200,320" />
          <path d="M0,340 Q200,310 400,330 T800,320 T1200,340" />
          <path d="M0,520 Q180,500 360,510 T720,500 T1080,520 T1200,510" />
          <path d="M0,540 Q180,520 360,530 T720,520 T1080,540 T1200,530" />
          <path d="M0,560 Q180,540 360,550 T720,540 T1080,560 T1200,550" />
          <path d="M0,200 Q300,180 600,200 T1200,190" />
          <path d="M0,220 Q300,200 600,220 T1200,210" />
          <path d="M0,600 Q250,580 500,595 T1000,585 T1200,600" />
          <path d="M0,620 Q250,600 500,615 T1000,605 T1200,620" />
        </g>
      </svg>
    </div>
  );
}
