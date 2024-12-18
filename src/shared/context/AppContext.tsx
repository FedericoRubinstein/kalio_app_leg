import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import Purchases from "react-native-purchases";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import appsFlyer from "react-native-appsflyer";
import { getLocales } from "expo-localization";
import analytics from "../services/analytics";
import { FoodEntry, Intake, UnitSystem, WeightEntry } from "../utils/types";
import { calculateTotalFoodValues } from "../utils/utils";
import { LOCAL_STORAGE_KEYS } from "../utils/constants";

interface AppContextType {
  isSubscriptionActive: boolean | undefined;
  setIsSubscriptionActive: (value: boolean) => void;
  loadingAuth: boolean;
  hasSeenIntro: boolean;
  handleFinishOnboarding: () => void;
  currentIntake: Intake;
  setCurrentIntake: (value: Intake) => void;
  intakeGoal: Intake;
  setIntakeGoal: (values: Intake) => void;
  resetTodayData: () => void;
  weightHistory: WeightEntry[];
  addToWeightHistory: (value: WeightEntry) => void;
  deleteWeightEntry: (timestamp: string) => void;
  isFullyLoaded: boolean;
  todaysFoodEntries: FoodEntry[];
  addTodaysFoodEntry: (value: FoodEntry) => void;
  deleteTodaysFoodEntry: (date: number) => void;
  unitPreference: UnitSystem;
  toggleUnitSystem: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const defaultIntake: Intake = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
};

const defaultFoodEntry: FoodEntry[] = [];
const defaultUnitsByCountry =
  getLocales()[0].regionCode === "US" ? UnitSystem.IMPERIAL : UnitSystem.METRIC;

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isSubscriptionActive, setIsSubscriptionActive] = useState<boolean>();
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [intakeGoal, setIntakeGoal] = useState<Intake>(defaultIntake);
  const [currentIntake, setCurrentIntake] = useState<Intake>(defaultIntake);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [todaysFoodEntries, setTodaysFoodEntries] =
    useState<FoodEntry[]>(defaultFoodEntry);
  const [unitPreference, setUnitPreference] = useState<UnitSystem>(
    defaultUnitsByCountry,
  );

  const getEntitlements = useCallback(async () => {
    const setup = async () => {
      await Purchases.configure({
        apiKey: process.env.EXPO_PUBLIC_REV_CAT_KEY!,
      });
      // Setting up appsflyer stuff for ad tracking
      await Purchases.collectDeviceIdentifiers();
      await appsFlyer.getAppsFlyerUID((_, uid) => {
        Purchases.setAppsflyerID(uid);
      });

      const customer = await Purchases.getCustomerInfo();

      const isActive =
        customer.activeSubscriptions.length > 0 ||
        Object.keys(customer.allPurchaseDates).includes("lifetime_free");

      if (customer == null || customer.activeSubscriptions == null) {
        return;
      }

      await analytics.track("RevCatCustomer", {
        customer,
      });
      await analytics.track("SubscriptionStatus", {
        activeSubscriptions: customer.activeSubscriptions,
        isActive,
      });
      setIsSubscriptionActive(isActive);
    };
    setup().catch((e) =>
      analytics.track("ErrorFetchingEntitlements", { error: e }),
    );
  }, []);

  const fetchHasSeenOnboarding = useCallback(async () => {
    const fetchedValue = await AsyncStorage.getItem(
      LOCAL_STORAGE_KEYS.HAS_SEEN_ONBOARDING,
    );

    setHasSeenIntro(fetchedValue === "true");
    analytics.track("IntroStatusChecked", {
      hasSeenOnboarding: fetchedValue === "true",
    });
  }, []);

  const handleFinishOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.HAS_SEEN_ONBOARDING, "true");
    analytics.track("onboarding_completed");
    setHasSeenIntro(true);
  }, []);

  const updateIntakeGoal = useCallback(async (goal: Intake) => {
    setIntakeGoal(goal);
    await AsyncStorage.setItem(
      LOCAL_STORAGE_KEYS.INTAKE_GOAL,
      JSON.stringify(goal),
    );
    analytics.track("IntakeGoalSaved", { goal });
    analytics.identify({ ...goal });
  }, []);

  const loadIntakeGoalFromCache = useCallback(async () => {
    const cachedGoal = await AsyncStorage.getItem(
      LOCAL_STORAGE_KEYS.INTAKE_GOAL,
    );
    const goal = cachedGoal ? JSON.parse(cachedGoal) : defaultIntake;
    setIntakeGoal(goal);
    analytics.track("IntakeGoalLoaded", { goal });
  }, []);

  const updateCurrentIntake = useCallback(async (value: Intake) => {
    const today = format(new Date(), "yyyy-MM-dd");
    setCurrentIntake({ ...value });
    await AsyncStorage.setItem(
      `${LOCAL_STORAGE_KEYS.DAILY_DATA}_${today}`,
      JSON.stringify(value),
    );
    analytics.track("DailyDataSaved", { date: today, data: value });
  }, []);

  const updateWeightHistory = useCallback(
    async (newValue: WeightEntry) => {
      const newWeight = {
        date: newValue.date.split("T")[0],
        value: newValue.value,
      };

      const existingEntryIndex = weightHistory.findIndex(
        (entry) => entry.date === newWeight.date,
      );

      if (existingEntryIndex !== -1) {
        weightHistory[existingEntryIndex] = newWeight;
      } else {
        weightHistory.push(newWeight);
      }
      const sortedWeightHistory = weightHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setWeightHistory([...sortedWeightHistory]);

      await AsyncStorage.setItem(
        LOCAL_STORAGE_KEYS.WEIGHT_HISTORY,
        JSON.stringify(sortedWeightHistory),
      );
      analytics.track("WeightHistoryUpdated", newWeight);
    },
    [weightHistory],
  );

  const deleteWeightEntry = useCallback(async (date: string) => {
    setWeightHistory((prevHistory) => {
      const updatedWeightHistory = [...prevHistory].filter(
        (entry) => entry.date !== date.split("T")[0],
      );
      AsyncStorage.setItem(
        LOCAL_STORAGE_KEYS.WEIGHT_HISTORY,
        JSON.stringify([]),
      );
      setWeightHistory(updatedWeightHistory);
      AsyncStorage.setItem(
        LOCAL_STORAGE_KEYS.WEIGHT_HISTORY,
        JSON.stringify(updatedWeightHistory),
      );
      return updatedWeightHistory;
    });
    analytics.track("WeightEntryDeleted", { date });
  }, []);

  const loadWeightHistoryFromCache = useCallback(async () => {
    const cachedData = await AsyncStorage.getItem(
      LOCAL_STORAGE_KEYS.WEIGHT_HISTORY,
    );
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setWeightHistory(parsedData);
      analytics.track("WeightHistoryLoaded");
    }
  }, []);

  const loadDailyDataFromCache = useCallback(async () => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const today = format(todayStart, "yyyy-MM-dd");
    const cachedData = await AsyncStorage.getItem(
      `${LOCAL_STORAGE_KEYS.DAILY_DATA}_${today}`,
    );

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setCurrentIntake(parsedData ?? defaultIntake);
      analytics.track("DailyDataLoaded", { date: today, data: parsedData });
    }
  }, []);

  const resetTodayData = useCallback(async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    setCurrentIntake(defaultIntake);
    await AsyncStorage.removeItem(`${LOCAL_STORAGE_KEYS.DAILY_DATA}_${today}`);

    // Remove all entries for today from weight history
    const updatedWeightHistory = weightHistory.filter(
      (entry) => format(new Date(entry.date), "yyyy-MM-dd") !== today,
    );
    setWeightHistory(updatedWeightHistory);
    await AsyncStorage.setItem(
      LOCAL_STORAGE_KEYS.WEIGHT_HISTORY,
      JSON.stringify(updatedWeightHistory),
    );
    setTodaysFoodEntries([]);
    await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.TODAYS_FOOD_ENTRIES);
  }, [weightHistory]);

  const addTodaysFoodEntry = useCallback(
    async (value: FoodEntry) => {
      const updatedEntries = [value, ...todaysFoodEntries];
      setTodaysFoodEntries(updatedEntries);
      await AsyncStorage.setItem(
        LOCAL_STORAGE_KEYS.TODAYS_FOOD_ENTRIES,
        JSON.stringify(updatedEntries),
      );
    },
    [todaysFoodEntries],
  );

  const deleteTodaysFoodEntry = useCallback(
    async (date: number) => {
      const entry = todaysFoodEntries.find((entry) => entry.date === date);
      if (entry) {
        const totalFoodValues = calculateTotalFoodValues(entry.item);
        setCurrentIntake((prev) => ({
          calories: prev.calories - totalFoodValues.calories,
          protein: prev.protein - (totalFoodValues.protein ?? 0),
          carbohydrates:
            prev.carbohydrates - (totalFoodValues.carbohydrates ?? 0),
          fat: prev.fat - (totalFoodValues.fat ?? 0),
        }));
      }
      setTodaysFoodEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.date !== date),
      );
    },
    [todaysFoodEntries],
  );

  const loadTodaysFoodEntriesFromCache = useCallback(async () => {
    const cachedData = await AsyncStorage.getItem(
      LOCAL_STORAGE_KEYS.TODAYS_FOOD_ENTRIES,
    );
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const today = format(new Date(), "yyyy-MM-dd");

      // Check if entries are from today
      const hasOldEntries = parsedData?.some((entry: FoodEntry) => {
        const entryDate = format(new Date(entry.date), "yyyy-MM-dd");
        return entryDate !== today;
      });

      if (hasOldEntries) {
        // Clear old entries
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.TODAYS_FOOD_ENTRIES);
        setTodaysFoodEntries([]);
      } else {
        setTodaysFoodEntries(parsedData ?? []);
      }
    } else {
      setTodaysFoodEntries([]);
    }
  }, []);

  const loadUnitPreferenceFromCache = useCallback(async () => {
    const cachedPreference = await AsyncStorage.getItem(
      LOCAL_STORAGE_KEYS.UNIT_PREFERENCE,
    );

    setUnitPreference(
      (cachedPreference as UnitSystem) ?? defaultUnitsByCountry,
    );
  }, []);

  const toggleUnitSystem = useCallback(async () => {
    let newSystem;
    if (unitPreference === UnitSystem.IMPERIAL) {
      newSystem = UnitSystem.METRIC;
    } else {
      newSystem = UnitSystem.IMPERIAL;
    }
    setUnitPreference(newSystem);
    await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.UNIT_PREFERENCE, newSystem);
  }, [unitPreference]);

  const initialize = useCallback(async () => {
    await getEntitlements();
    await fetchHasSeenOnboarding();
    await loadIntakeGoalFromCache();
    await loadDailyDataFromCache();
    await loadWeightHistoryFromCache();
    await loadTodaysFoodEntriesFromCache();
    await loadUnitPreferenceFromCache();
    setIsFullyLoaded(true);
  }, [
    getEntitlements,
    fetchHasSeenOnboarding,
    loadIntakeGoalFromCache,
    loadDailyDataFromCache,
    loadWeightHistoryFromCache,
    loadTodaysFoodEntriesFromCache,
    loadUnitPreferenceFromCache,
  ]);

  useEffect(() => {
    initialize().then(() => setLoadingAuth(false));
  }, [initialize]);

  return (
    <AppContext.Provider
      value={{
        isSubscriptionActive,
        setIsSubscriptionActive,
        loadingAuth,
        hasSeenIntro,
        handleFinishOnboarding,
        currentIntake,
        setCurrentIntake: updateCurrentIntake,
        intakeGoal,
        setIntakeGoal: updateIntakeGoal,
        resetTodayData,
        weightHistory,
        addToWeightHistory: updateWeightHistory,
        deleteWeightEntry,
        isFullyLoaded,
        todaysFoodEntries,
        addTodaysFoodEntry,
        deleteTodaysFoodEntry,
        unitPreference,
        toggleUnitSystem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
