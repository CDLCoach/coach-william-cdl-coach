import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "coach-william-pro-unlocked";

/**
 * IDs of app sections that require Coach William PRO to open.
 * These sections remain visible to FREE users (with a lock icon)
 * but tapping them opens the PRO upgrade screen instead of the lesson.
 */
export const PRO_SECTION_IDS: ReadonlySet<string> = new Set([
  // Complete Outside Inspection
  "front",
  "passenger-side-engine",
  "engine",
  "driver-side",
  "back",
  "coupling",
  "trailer",
  // Light Operations
  "light-ops",
  // Complete Brake Testing
  "service-brake",
  "parking-brake-tug",
  // Complete Study System
  "practice",
  "pressure-challenge",
]);

/**
 * Returns true if the given section ID is a PRO-locked section.
 */
export function isProSection(id: string): boolean {
  return PRO_SECTION_IDS.has(id);
}

/**
 * PRO access state — persisted via AsyncStorage so a one-time purchase
 * survives app restarts. Defaults to false (FREE user).
 */
export const [ProAccessProvider, useProAccess] = createContextHook(() => {
  const [isPro, setIsPro] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw === "true") {
          setIsPro(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const unlock = useCallback(() => {
    setIsPro(true);
    AsyncStorage.setItem(STORAGE_KEY, "true").catch(() => {});
  }, []);

  const lock = useCallback(() => {
    setIsPro(false);
    AsyncStorage.setItem(STORAGE_KEY, "false").catch(() => {});
  }, []);

  return { isPro, loaded, unlock, lock };
});
