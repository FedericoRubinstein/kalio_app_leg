import { getLocales } from "expo-localization";
import i18n from "react-native-i18n";
import { I18nManager } from "react-native";
import en from "./en.json";
import pt from "./pt.json";
import es from "./es.json";
import fr from "./fr.json";
import ru from "./ru.json";
import de from "./de.json";

i18n.translations = {
  en,
  pt,
  es,
  fr,
  ru,
  de,
};

i18n.locale = getLocales()[0].languageCode ?? "en-US";
i18n.fallbacks = true;

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

export default i18n;
