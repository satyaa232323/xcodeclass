"use client";

import React from "react";

export default function XLoading({ size = 120 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* wrapper untuk efek rotasi + glow */}
      <div className="xloader-wrapper">
        {/* SVG X */}
        <svg
          viewBox="0 0 100 100"
          className="xloader-svg"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          {/* thicker soft background X */}
          <g className="x-bg">
            <line x1="25" y1="25" x2="75" y2="75" stroke="rgba(220,38,38,0.12)" strokeWidth="12" strokeLinecap="round" />
            <line x1="75" y1="25" x2="25" y2="75" stroke="rgba(220,38,38,0.12)" strokeWidth="12" strokeLinecap="round" />
          </g>

          {/* animated stroke X (foreground) */}
          <g className="x-fore">
            <line
              className="x-stroke x-stroke--a"
              x1="25"
              y1="25"
              x2="75"
              y2="75"
              stroke="#DC2626" /* red-600 */
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              className="x-stroke x-stroke--b"
              x1="75"
              y1="25"
              x2="25"
              y2="75"
              stroke="#DC2626"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* small orbiting dots */}
          <g className="x-dots" transform="translate(50,50)">
            <circle className="dot dot--1" r="2.6" cx="0" cy="-28" fill="#DC2626" />
            <circle className="dot dot--2" r="2.6" cx="20" cy="-20" fill="#F87171" />
            <circle className="dot dot--3" r="2.6" cx="-20" cy="-20" fill="#FB7185" />
          </g>
        </svg>
      </div>

      {/* visually hidden text for screen readers */}
      <span className="sr-only">Memuat…</span>
    </div>
  );
}
