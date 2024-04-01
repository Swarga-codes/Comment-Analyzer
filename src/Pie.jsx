import React from "react";

const cleanPercentage = (percentage) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Circle = ({ colour, pct }) => {
  const r = 35; // Adjusted radius
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 100;
  return (
    <circle
      r={r}
      cx={50} // Adjusted cx
      cy={50} // Adjusted cy
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""} // remove colour as 0% sets full circumference
      strokeWidth={2} // Adjusted stroke width
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
      strokeLinecap="round"
    ></circle>
  );
};

const Text = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1em"} // Adjusted font size
      fill="white"
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

const Pie = ({ percentage, colour,label }) => {
  const pct = cleanPercentage(percentage);
  return (
    <div className="Pie">
    <h4>{label} Comments</h4>
    <svg width={100} height={100}> 
      <g transform={`rotate(-90 ${"50 50"})`}> 
        <Circle colour="lightgrey" />
        <Circle colour={colour} pct={pct} />
      </g>
      <Text percentage={pct} />
    </svg>
    </div>
  );
};

export default Pie;
