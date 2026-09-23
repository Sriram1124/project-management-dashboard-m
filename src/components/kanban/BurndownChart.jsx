import React from 'react';

export default function BurndownChart({
  dataPoints = [24, 22, 19, 17, 14, 11, 8],
  dates = ['Dec 1', 'Dec 5', 'Dec 9', 'Dec 14']
}) {
  const width = 300;
  const height = 75;
  const paddingX = 15;
  const paddingY = 12;

  // Calculate coordinates for smooth descending line
  const points = dataPoints.map((val, idx) => {
    const x = paddingX + (idx / (dataPoints.length - 1)) * (width - paddingX * 2);
    // Value ranges from 24 down to 0
    const y = paddingY + ((24 - val) / 24) * (height - paddingY * 2);
    return [x, y];
  });

  const polylinePoints = points.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div className="w-full">
      <div className="h-20 w-full flex items-end">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Subtle Ideal Burn guideline */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#E2E8F0"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />

          {/* Actual Burndown Trajectory */}
          <polyline
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Circular Data Points */}
          {points.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="#7C3AED"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="transition-transform hover:scale-125 cursor-pointer"
            >
              <title>{`Day ${i + 1}: ${dataPoints[i]} SP remaining`}</title>
            </circle>
          ))}
        </svg>
      </div>

      {/* Dates along bottom */}
      <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1 mt-1">
        {dates.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </div>
  );
}

