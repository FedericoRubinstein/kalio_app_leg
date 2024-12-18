import { UnitSystem } from "./types";

export interface WeightUnits {
  value: number;
  unit: string;
}

export interface HeightUnits {
  primaryValue: number;
  primaryUnit: string;
  secondaryValue?: number;
  secondaryUnit?: string;
}

export const convertWeight = (
  weight: number,
  fromSystem: UnitSystem,
  toSystem: UnitSystem,
): WeightUnits => {
  if (fromSystem === toSystem) {
    return {
      value: weight,
      unit: fromSystem === UnitSystem.METRIC ? "kg" : "lbs",
    };
  }
  if (toSystem === UnitSystem.IMPERIAL) {
    const lbs = weight * 2.20462;
    return {
      value: Math.round(lbs * 10) / 10,
      unit: "lbs",
    };
  }
  // Converting from imperial to metric
  const kg = weight / 2.20462;
  return {
    value: Math.round(kg * 10) / 10,
    unit: "kg",
  };
};

export const convertGramsOrOz = (
  value: number,
  fromSystem: UnitSystem,
  toSystem: UnitSystem,
) => {
  if (fromSystem === toSystem) {
    return value;
  }
  if (toSystem === UnitSystem.IMPERIAL) {
    return value * 0.035274;
  }
  // Converting from imperial to metric
  const grams = value / 0.035274;
  return grams;
};

export const convertHeight = (
  heightCm: number,
  fromSystem: UnitSystem,
  toSystem: UnitSystem,
): HeightUnits => {
  if (fromSystem === toSystem) {
    return {
      primaryValue: heightCm,
      primaryUnit: fromSystem === UnitSystem.METRIC ? "cm" : "in",
    };
  }
  if (toSystem === UnitSystem.IMPERIAL) {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return {
      primaryValue: feet,
      primaryUnit: "ft",
      secondaryValue: inches,
      secondaryUnit: "in",
    };
  }
  // Converting from imperial to metric (assuming input is in inches)
  const cm = heightCm * 2.54;
  return {
    primaryValue: Math.round(cm),
    primaryUnit: "cm",
  };
};

export const formatWeight = (
  weight: number,
  fromSystem: UnitSystem,
  toSystem: UnitSystem = fromSystem, // Default to fromSystem if toSystem not provided
): string => {
  const converted = convertWeight(weight, fromSystem, toSystem);
  return `${converted.value} ${converted.unit}`;
};

export const formatHeight = (
  height: number,
  fromSystem: UnitSystem,
  toSystem: UnitSystem = fromSystem, // Default to fromSystem if toSystem not provided
): string => {
  const converted = convertHeight(height, fromSystem, toSystem);
  if (toSystem === UnitSystem.IMPERIAL) {
    return `${converted.primaryValue}${converted.primaryUnit} ${converted.secondaryValue}${converted.secondaryUnit}`;
  }
  return `${converted.primaryValue}${converted.primaryUnit}`;
};
