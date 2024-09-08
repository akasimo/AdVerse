"use client"

import React from "react";
import {Wallet} from "./WalletProvider";
import QueryProvider from "./QueryProvider";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryProvider>
      <Wallet>
        {children}
        <Toaster
          toastOptions={{
            style: {
              backgroundColor: "InfoBackground",
              border: "2px dashed black",
              fontSize: "16px",
              fontWeight: "bold",
            },
          }}
        />
      </Wallet>
    </QueryProvider>
  );
};

export default Providers;