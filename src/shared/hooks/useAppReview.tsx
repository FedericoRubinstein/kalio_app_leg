import { Linking } from "react-native";
import * as StoreReview from "expo-store-review";
import analytics from "../services/analytics";

const itunesItemId = "ID";

export default function useAppReview() {
  const rateTheApp = async () => {
    analytics.track("rate_app_requested");
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
      return true;
    }
    return true;
  };

  const navigateToStore = async () => {
    await Linking.openURL(
      `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`,
    );
  };
  return { navigateToStore, rateTheApp };
}
