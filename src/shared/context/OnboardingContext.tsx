import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  ActivityLevelEnum,
  Gender,
  Goal,
  Obstacle,
  PastAttempt,
  UserInfo,
  WeeklyLossGoal,
} from "../../features/onboarding/screens/types";

interface OnboardingContextType {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  obstacles: Obstacle[];
  setObstacles: (obstacles: Obstacle[]) => void;
  pastAttempts: PastAttempt[];
  setPastAttempts: (pastAttempts: PastAttempt[]) => void;
  activityLevel: ActivityLevelEnum | null;
  setActivityLevel: (activityLevel: ActivityLevelEnum) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  weeklyLossGoal: WeeklyLossGoal | undefined;
  setWeeklyLossGoal: (weeklyLossGoal: WeeklyLossGoal) => void;
  result: any;
  setResult: (result: any) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider",
    );
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [pastAttempts, setPastAttempts] = useState<PastAttempt[]>([]);
  const [activityLevel, setActivityLevel] = useState<ActivityLevelEnum | null>(
    null,
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({
    height: "",
    gender: Gender.Male,
    age: "",
    currentWeight: "",
    desiredWeight: "",
  });
  const [weeklyLossGoal, setWeeklyLossGoal] = useState<WeeklyLossGoal>();
  const [result, setResult] = useState<any>(null);

  const value = {
    goals,
    setGoals,
    obstacles,
    setObstacles,
    pastAttempts,
    setPastAttempts,
    activityLevel,
    setActivityLevel,
    weeklyLossGoal,
    setWeeklyLossGoal,
    result,
    setResult,
    userInfo,
    setUserInfo,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
