import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AnalyzedWalletStore = {
  analyzedWallet: UserActivity | null;
  updateAnalyzedWallet: (payload: UserActivity) => void;
};

export const useAnalyzedWallet = create<AnalyzedWalletStore>()(
  persist(
    (set) => ({
      analyzedWallet: null,
      updateAnalyzedWallet: (payload: UserActivity) =>
        set(() => ({ analyzedWallet: payload })),
    }),
    {
      name: "analyzed-wallet-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
