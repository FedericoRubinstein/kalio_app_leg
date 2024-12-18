export enum Goal {
  LoseWeight = "lose_weight",
  GainWeight = "gain_weight",
  MaintainWeight = "maintain_weight",
  ImproveHealth = "improve_health",
  BuildMuscle = "build_muscle",
  ManageStress = "manage_stress",
  ImproveSleep = "improve_sleep",
  ChangeDiet = "change_diet",
}

export enum Obstacle {
  Hard = "hard",
  Food = "food",
  Support = "support",
  Motivation = "motivation",
  Progress = "progress",
  Cravings = "cravings",
  Hunger = "hunger",
  Other = "other",
}

export enum PastAttempt {
  CalorieCounting = "calorie_counting",
  KetoDiet = "keto_diet",
  IntermittentFasting = "intermittent_fasting",
  LowCarbDiet = "low_carb_diet",
  VegetarianVeganDiet = "vegetarian_vegan_diet",
  IncreasedPhysicalActivity = "increased_physical_activity",
  WeightLossSupplements = "weight_loss_supplements",
  MealReplacementShakes = "meal_replacement_shakes",
}

export type ActivityLevel = {
  id: string;
  label: string;
  description: string;
};

export enum ActivityLevelEnum {
  Sedentary = "sedentary",
  LightlyActive = "lightly_active",
  ModeratelyActive = "moderately_active",
  VeryActive = "very_active",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export type UserInfo = {
  height: string;
  gender: Gender;
  age: string;
  currentWeight: string;
  desiredWeight: string;
};

export enum WeeklyLossGoal {
  small = "small",
  medium = "medium",
  large = "large",
  xlarge = "xlarge",
}
