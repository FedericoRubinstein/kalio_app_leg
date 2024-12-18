import i18n from "../../i18n/i18n";
import {
  ActivityLevelEnum,
  Gender,
  WeeklyLossGoal,
} from "../../features/onboarding/screens/types";
import { UnitSystem, FoodItem } from "./types";

export const getCurrentGreeting = () => {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return i18n.t("common.good_morning");
  }
  if (hours >= 12 && hours < 18) {
    return i18n.t("common.good_afternoon");
  }
  return i18n.t("common.good_evening");
};
export const calculateDailyIntake = ({
  age,
  gender,
  height,
  weight,
  activityLevel,
  weeklyLossGoal,
}: {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevelEnum;
  weeklyLossGoal: WeeklyLossGoal;
}) => {
  // Base Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  let bmr;
  if (gender === Gender.Male) {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Total Daily Energy Expenditure (TDEE)
  const activityMultipliers = {
    [ActivityLevelEnum.Sedentary]: 1.2,
    [ActivityLevelEnum.LightlyActive]: 1.375,
    [ActivityLevelEnum.ModeratelyActive]: 1.55,
    [ActivityLevelEnum.VeryActive]: 1.725,
  };
  const tdee = bmr * activityMultipliers[activityLevel];

  // Map weekly loss goals to numeric values (kg per week)
  const weeklyLossGoals = {
    small: 0.2,
    medium: 0.5,
    large: 0.8,
    xlarge: 1.0,
  };
  const weeklyLossKg = weeklyLossGoals[weeklyLossGoal];

  // Calorie deficit based on weekly loss goal
  const calorieDeficit = (weeklyLossKg * 7700) / 7; // kcal per day

  // Ensure calorie deficit doesn't exceed TDEE
  const adjustedDeficit = Math.min(calorieDeficit, tdee * 0.3); // Limit deficit to 30% of TDEE

  // Calculate daily calorie intake
  const dailyIntake = Math.round(tdee - adjustedDeficit);

  // Calculate macronutrient intake
  const proteinIntake = Math.round(weight * 2); // 2g per kg of body weight
  const fatIntake = Math.round((dailyIntake * 0.25) / 9); // 25% of calories from fat
  const carbIntake = Math.round(
    (dailyIntake - (proteinIntake * 4 + fatIntake * 9)) / 4,
  ); // Remaining calories from carbs

  return {
    calories: dailyIntake,
    protein: proteinIntake,
    carbohydrates: carbIntake,
    fat: fatIntake,
  };
};

export const getWeightPickerItems = (system: UnitSystem) => {
  if (system === UnitSystem.METRIC) {
    const values = [];
    for (let i = 2; i <= 300; i += 0.1) {
      values.push(Number(i.toFixed(1)));
    }
    return values;
  }
  const values = [];
  for (let i = 5; i <= 660; i += 0.5) {
    values.push(Number(i.toFixed(1)));
  }
  return values;
};

export const getHeightPickerItems = (system: UnitSystem) => {
  if (system === UnitSystem.METRIC) {
    const values = [];
    for (let i = 50; i <= 230; i += 1) {
      values.push(Number(i.toFixed(1)));
    }
    return values;
  }
  const values = [];
  for (let i = 12; i <= 90; i += 0.5) {
    values.push(Number(i.toFixed(1)));
  }
  return values;
};

export const calculateTotalFoodValues = (analysisResult: FoodItem) => {
  const {
    portion_size,
    protein_per_100g,
    carbohydrates_per_100g,
    fat_per_100g,
  } = analysisResult;

  const sizeMultiplier = portion_size / 100 || 1;
  const protein = Math.floor((protein_per_100g ?? 0) * sizeMultiplier);
  const carbohydrates = Math.floor(
    (carbohydrates_per_100g ?? 0) * sizeMultiplier,
  );
  const fat = Math.floor((fat_per_100g ?? 0) * sizeMultiplier);
  const calories = Math.floor(protein * 4 + carbohydrates * 4 + fat * 9);

  return {
    protein,
    carbohydrates,
    fat,
    calories,
  };
};
