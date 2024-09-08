import React from "react";

const CircularProgress = ({ score }: { score: string | undefined }) => {
  // Ensure percentage is between 0 and 100

  const clampedScore = Math.min(
    Math.max(
      score?.toLowerCase() === "low"
        ? 10
        : score?.toLowerCase() === "medium"
          ? 50
          : score?.toLowerCase() === "high"
            ? 90
            : 0,
    ),
    100,
  );

  // Calculate the circumference of the circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="h-[14rem] w-[14rem] rotate-90 transform"
        viewBox="0 0 150 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
        />
        <circle
          className="text-green-500 transition-all duration-300"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={clampedScore < 50 ? "#00FF00" : "#FF0000"}
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{clampedScore}%</span>
        <span className="text-sm text-gray-600">High Spender</span>
      </div>
    </div>
  );
};

export default CircularProgress;
