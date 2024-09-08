import Searchbar from "@/components/shared/Searchbar";
import React from "react";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
const monsterrat = Montserrat({ subsets: ["latin"] });

const MainPage = () => {
  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <div className="absolute inset-0 left-[-15%] top-[50%] h-[30rem] w-[30rem] -translate-y-[50%] rounded-full bg-primary/90 blur-[100px]"></div>
      <div className={cn("z-[10] mb-8 text-center")}>
        <h1 className="mb-4">
          <span className="gradient-text rounded-lg bg-black/80 px-2 py-1 drop-shadow-lg backdrop-blur-lg">
            SolScout
          </span>
          : Get real-time wallet insights
        </h1>
        <h5 className="mb-4 opacity-50">
          Explore the advanced metrics of wallets for the Solana ecosystem!
        </h5>
      </div>

      <Searchbar />
    </div>
  );
};

export default MainPage;
