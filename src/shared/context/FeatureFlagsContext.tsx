import React, { createContext, useEffect, useState, ReactNode } from "react";
import { apiService } from "../services/api";
import { Flags } from "../utils/types";

interface FeatureFlagsContextType {
  flags: Flags;
  isLoading: boolean;
}

export const FeatureFlagsContext = createContext<
  FeatureFlagsContextType | undefined
>(undefined);

interface FeatureFlagsProviderProps {
  children: ReactNode;
}

export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({
  children,
}) => {
  const [flags, setFlags] = useState<Flags>({
    show_paywall: false,
    has_lifetime_free_offer: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      const fetchedFlags = await apiService.fetchFlags();
      setFlags(fetchedFlags);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching feature flags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  return (
    <FeatureFlagsContext.Provider value={{ flags, isLoading }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = React.useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider",
    );
  }
  return context;
};
