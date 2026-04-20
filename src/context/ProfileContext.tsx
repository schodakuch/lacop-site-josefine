"use client";

import { createContext, useContext } from "react";
import type { Category, Profile } from "@/lib/types";

type ProfileContextValue = { profile: Profile; categories: Category[] };

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  profile,
  categories,
  children,
}: {
  profile: Profile;
  categories: Category[];
  children: React.ReactNode;
}) {
  return (
    <ProfileContext.Provider value={{ profile, categories }}>
      {children}
    </ProfileContext.Provider>
  );
}

function useCtx(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}

export function useProfile(): Profile {
  return useCtx().profile;
}

export function useCategories(): Category[] {
  return useCtx().categories;
}
