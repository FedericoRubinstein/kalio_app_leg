import { UnitSystem } from "../../../shared/utils/types";
import { WeeklyLossGoal } from "../screens/types";

export const lossCopy = (goal: WeeklyLossGoal, unitPreference: UnitSystem) => {
  switch (goal) {
    case WeeklyLossGoal.small:
      return unitPreference === UnitSystem.IMPERIAL ? "0.2lbs" : "0.1kg";
    case WeeklyLossGoal.medium:
      return unitPreference === UnitSystem.IMPERIAL ? "0.4lbs" : "0.2kg";
    case WeeklyLossGoal.large:
      return unitPreference === UnitSystem.IMPERIAL ? "0.8lbs" : "0.4kg";
    case WeeklyLossGoal.xlarge:
      return unitPreference === UnitSystem.IMPERIAL ? "1.6lbs" : "0.8kg";
    default:
      return "0";
  }
};
