"use client";
import { useAnalyzedWallet } from "@/store";
import React, { useEffect, useState } from "react";
import CustomPieChart from "./components/CustomPieChart";
import SimpleBarChart from "./components/BarChart";
import ScoreBar from "./components/ScoreBar";
import MostUsages from "./components/MostUsages";
import { Wallet } from "lucide-react";
import WalletAndTags from "./components/WalletAndTags";
import CustomBarChart from "./components/BarChart";

interface AddressPageProps {
  params: {
    address: string;
  };
}

const AddressPage = ({ params: { address } }: AddressPageProps) => {
  const [programUsages, setProgramUsages] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const { analyzedWallet } = useAnalyzedWallet();

  useEffect(() => {
    if (analyzedWallet) {
      const programData = Object.entries(analyzedWallet?.programUsage).map(
        ([key, value]) => ({
          name: key.toLowerCase().includes("system")
            ? "system".toUpperCase()
            : key,
          value,
        }),
      );

      console.log(programData);

      const category_data = Object.entries(analyzedWallet?.categories).map(
        ([key, value]) => ({
          name: key,
          tx_amount: value,
        }),
      );

      setProgramUsages(programData);
      setCategories(category_data);
    }
  }, [analyzedWallet]);

  console.log(categories);

  return (
    <div>
      <WalletAndTags
        walletAddress={analyzedWallet?.walletAddress}
        tags={analyzedWallet?.userTags}
        riskLevel={analyzedWallet?.riskLevel}
      />
      <div className="mr-12 flex justify-between">
        <SimpleBarChart
          data={programUsages}
          title="Program Usages"
          dataKey="value"
        />
        <div className="mt-4">
          <div className="rounded-lg border-2 border-dashed border-black bg-white/50 p-4 backdrop-blur-md">
            <h5 className="mb-4 whitespace-nowrap font-bold">NFT Activity</h5>
            <p className="text-lg">
              Listing :{" "}
              <span className="rounded-lg bg-primary px-2 py-1 text-white">
                {analyzedWallet?.nftActivity.listings}
              </span>
            </p>
            <p className="mt-4 text-lg">
              Purchase :{" "}
              <span className="rounded-lg bg-primary px-2 py-1 text-white">
                {analyzedWallet?.nftActivity.purchases}
              </span>
            </p>
          </div>
          <br />
          <div className="rounded-lg border-2 border-gray-300 bg-primary p-4 text-center text-white backdrop-blur-md">
            <h5 className="mb-4 font-bold">Daily Average Transactions</h5>
            <p className="inline-block rounded border-2 border-dotted border-white px-2 py-1 text-2xl font-bold">
              {analyzedWallet
                ? Math.floor(analyzedWallet?.averageTransactionsPerDay)
                : 0}
            </p>
          </div>
          <ScoreBar score="high" />
        </div>

        <div>
          <div className="flex flex-col items-center">
            <SimpleBarChart
              data={categories}
              title="Interaction Categories"
              dataKey="tx_amount"
            />
          </div>
        </div>
        <MostUsages
          interaction={analyzedWallet?.mostFrequentInteraction}
          program={analyzedWallet?.mostUsedProgram}
        />
      </div>

      <div></div>
    </div>
  );
};

export default AddressPage;
