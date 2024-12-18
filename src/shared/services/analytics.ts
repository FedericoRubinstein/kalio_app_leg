import {
  Identify,
  identify,
  init,
  logEvent,
} from "@amplitude/analytics-react-native";
import * as Localization from "expo-localization";
import { getUniqueId } from "react-native-device-info";
import appsFlyer from "react-native-appsflyer";
import Smartlook from "react-native-smartlook-analytics";

class AnalyticsService {
  constructor() {
    this.initialize();
  }

  async initialize() {
    const deviceId = await getUniqueId();
    const locales = Localization.getLocales();
    const primaryLocale = locales[0] || {};
    const language = primaryLocale.languageTag;

    appsFlyer.initSdk({
      devKey: "",
      appId: "",
      onInstallConversionDataListener: true,
    });

    appsFlyer.setCustomerUserId(deviceId);

    // Initialize Amplitude with API Key
    await init(process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY! || "", deviceId);
    const identifyObj = new Identify();
    identifyObj.set("deviceId", deviceId);
    identifyObj.set("language", language);
    identifyObj.set("appName", "Kalio");
    await identify(identifyObj);

    if (process.env.EXPO_PUBLIC_SMARTLOOK_PROJECT_KEY && !__DEV__) {
      Smartlook.instance.preferences.setProjectKey(
        process.env.EXPO_PUBLIC_SMARTLOOK_PROJECT_KEY,
      );
      Smartlook.instance.start();
    }
  }

  async track(eventName: string, properties = {}) {
    const deviceId = await getUniqueId();
    const eventProperties = {
      ...properties,
      deviceId,
    };
    console.log("track", eventName, eventProperties);
    await logEvent(`Kalio:${eventName}`, eventProperties);
  }

  async identify(properties: Record<string, any> = {}) {
    const identifyObj = new Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identifyObj.set(key, value);
    });
    await identify(identifyObj);
  }

  async trackNavigation(routeName: string) {
    await this.track(`NavigateTo:${routeName}`);
  }
}

const analytics = new AnalyticsService();

export default analytics;
