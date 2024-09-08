"use client";

import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAnalyzedWallet } from "@/store";
import { toast } from "sonner";

const Searchbar = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { updateAnalyzedWallet } = useAnalyzedWallet();

  const handleSearch = async () => {
    const searchPromise = axios.post<UserActivity>(
      "http://207.154.208.36:3000/analyze-wallet",
      {
        walletAddress: searchRef.current?.value,
      },
    );
    toast.promise(searchPromise, {
      loading: "Wallet data is fetching",
      success: (result) => {
        updateAnalyzedWallet(result.data);
        router.push(`/${searchRef.current?.value}`);
        return "Your data is fetched";
      },
      error: "An error occured while fetching data",
    });
  };
  return (
    <div className="flex items-center gap-2">
      <div>
        <label htmlFor="">Wallet Address</label>
        <Input
          ref={searchRef}
          className="min-w-[300px] lg:max-w-md xl:max-w-lg"
        />
      </div>

      <Button onClick={handleSearch} className="self-end">
        Search
      </Button>
    </div>
  );
};

export default Searchbar;
