import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
}

const GlassCard = ({ children }: GlassCardProps) => {
  return (
    <div className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-lg bg-primary text-center text-teal-200 shadow-lg backdrop-blur-md">
      {children}
    </div>
  );
};

export default GlassCard;
