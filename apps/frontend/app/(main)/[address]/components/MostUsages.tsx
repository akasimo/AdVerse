import GlassCard from "@/components/shared/GlassCard";
import React from "react";
import ScoreBar from "./ScoreBar";

interface MostUsagesProps {
  program: string | undefined;
  interaction: string | undefined;
}

const MostUsages = ({ interaction, program }: MostUsagesProps) => {
  return (
    <div className="ml-2 mt-4 flex flex-col items-center gap-2 self-start border">
      <GlassCard>
        <p className="text-primary-foreground/90">Favorite Program</p>
        <p className="font-bold">{program}</p>
      </GlassCard>
      <GlassCard>
        <p className="text-primary-foreground/90">Favorite Category</p>
        <p className="font-bold">{interaction}</p>
      </GlassCard>
    </div>
  );
};

export default MostUsages;
