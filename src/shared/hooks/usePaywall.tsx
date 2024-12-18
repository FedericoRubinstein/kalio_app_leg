/* eslint-disable no-console */
import { useCallback } from "react";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import analytics from "../services/analytics";
import { useAppContext } from "../context/AppContext";
import { useFeatureFlags } from "../context/FeatureFlagsContext";

export const usePaywall = () => {
  const { flags } = useFeatureFlags();
  const { isSubscriptionActive, setIsSubscriptionActive } = useAppContext();

  const showPaywallIfNeeded = useCallback(async (): Promise<boolean> => {
    try {
      if (__DEV__) {
        return true;
      }
      if (!flags.show_paywall) {
        analytics.track("show_paywall_skipped");
        return true;
      }
      if (!isSubscriptionActive) {
        await analytics.track("show_paywall", {
          isSubscriptionActive,
        });
        const paywallResult: PAYWALL_RESULT =
          await RevenueCatUI.presentPaywallIfNeeded({
            requiredEntitlementIdentifier: "default",
          });

        if (paywallResult !== PAYWALL_RESULT.PURCHASED) {
          await analytics.track("paywall_dismissed");
          return false;
        }
        setIsSubscriptionActive?.(true);
        await analytics.track("paywall_purchased");
        return true;
      }
    } catch (error) {
      console.error("Error showing paywall", error);
      await analytics.track("error_showing_paywall", { error });
      return false;
    }
    return true;
  }, [flags.show_paywall, isSubscriptionActive, setIsSubscriptionActive]);

  const showFreePaywall = useCallback(async () => {
    await analytics.track("show_free_paywall");
    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "default",
        offering: (await Purchases.getOfferings()).all.lifetime_free,
      });
    if (paywallResult !== PAYWALL_RESULT.PURCHASED) {
      await analytics.track("free_paywall_dismissed");
      return false;
    }
    setIsSubscriptionActive?.(true);
    await analytics.track("free_paywall_purchased");
    return true;
  }, [setIsSubscriptionActive]);

  const showMainPaywall = useCallback(async () => {
    if (!flags.show_paywall) {
      analytics.track("show_main_paywall_skipped");
      return true;
    }
    try {
      await analytics.track("show_main_paywall", {
        isSubscriptionActive,
      });
      const paywallResult: PAYWALL_RESULT =
        await RevenueCatUI.presentPaywallIfNeeded({
          requiredEntitlementIdentifier: "default",
        });

      if (paywallResult !== PAYWALL_RESULT.PURCHASED) {
        await analytics.track("main_paywall_dismissed");
        return false;
      }
      setIsSubscriptionActive?.(true);
      await analytics.track("main_paywall_purchased");
      return true;
    } catch (error) {
      console.error("Error showing main paywall", error);
      await analytics.track("error_showing_main_paywall", { error });
      return false;
    }
  }, [flags.show_paywall, isSubscriptionActive, setIsSubscriptionActive]);

  const showOfferPaywall = useCallback(async () => {
    if (!flags.show_paywall) {
      analytics.track("show_offer_paywall_skipped");
      return true;
    }
    try {
      await analytics.track("show_offer_paywall");
      const offering = await (await Purchases.getOfferings()).all.offer;
      const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
        offering,
      });
      if (paywallResult !== PAYWALL_RESULT.PURCHASED) {
        await analytics.track("offer_paywall_dismissed");
        return false;
      }
      setIsSubscriptionActive?.(true);
      await analytics.track("offer_paywall_purchased");
      return true;
    } catch (error) {
      console.error("Error showing paywall", error);
      await analytics.track("error_showing_offer_paywall", { error });
      return false;
    }
  }, [flags.show_paywall, setIsSubscriptionActive]);

  return {
    showPaywallIfNeeded,
    showOfferPaywall,
    showMainPaywall,
    showFreePaywall,
  };
};
