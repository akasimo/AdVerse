import { Wallet } from "lucide-react";
import React from "react";
import ScoreBar from "./ScoreBar";

interface WalletAndTagsProps {
  walletAddress: string | undefined;
  tags: string[] | undefined;
  riskLevel?: string | undefined;
}

const WalletAndTags = ({
  tags,
  walletAddress,
  riskLevel,
}: WalletAndTagsProps) => {
  return (
    <div className="flex items-center justify-between pr-12">
      <div className="m-2 ml-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-black bg-white/50 px-4 py-2">
        <Wallet size={30} />
        <p className="inline-block rounded bg-primary/90 px-2 py-1 text-white">
          {walletAddress}
        </p>
      </div>
      <div className="ml-4">
        <ul className="flex gap-2">
          {tags?.map((tag) => (
            <p
              key={tag}
              className="inline-block rounded-lg bg-primary/30 px-2 py-1 text-white"
            >
              {tag}
            </p>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WalletAndTags;
