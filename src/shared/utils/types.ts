export interface FoodItem {
  name: string;
  portion_size: number;
  protein_per_100g: number;
  carbohydrates_per_100g: number;
  fat_per_100g: number;
  short_description: string;
  healthier_alternatives: string[];
  is_food_item: boolean;
  healthy_score: number;
}

export type Intake = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export enum NutrientEnum {
  CALORIES = "calories",
  PORTION_SIZE = "portion_size",
  PROTEIN = "protein",
  CARBOHYDRATES = "carbohydrates",
  FAT = "fat",
}

export type WeightEntry = {
  date: string;
  value: number;
};

export type Flags = {
  show_paywall: boolean;
  has_lifetime_free_offer: boolean;
};

export type FoodEntry = {
  date: number;
  item: FoodItem;
  image: string | null;
};

export enum UnitSystem {
  METRIC = "metric",
  IMPERIAL = "imperial",
}
