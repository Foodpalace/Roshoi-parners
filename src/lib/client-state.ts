import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppLanguage } from "@/lib/platform-config";
import { platformConfig } from "@/lib/platform-config";

type ClientState = {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  restaurantId: string | null;
  setRestaurantId: (id: string | null) => void;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
};

export const useClientState = create<ClientState>()(
  persist(
    (set) => ({
      lang: platformConfig.localization.defaultLanguage,
      setLang: (lang) => set({ lang }),
      restaurantId: null,
      setRestaurantId: (restaurantId) => set({ restaurantId }),
      soundOn: true,
      setSoundOn: (soundOn) => set({ soundOn }),
    }),
    { name: "roshoi-partner-ui" },
  ),
);
