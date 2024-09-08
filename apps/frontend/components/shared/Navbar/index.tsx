import { cn } from "@/lib/utils";
import React from "react";
import WalletSection from "./WalletSection";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full bg-primary/20 px-2 py-4 shadow-lg md:px-12">
      {/* Main Navbar */}
      <div className="flex h-[2rem] w-full items-center justify-end">
        <WalletSection />
      </div>
    </nav>
  );
};

export default Navbar;