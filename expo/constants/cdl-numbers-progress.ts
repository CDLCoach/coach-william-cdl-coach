import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cdl-numbers-progress";

/**
 * Persistent progress tracking for the CDL Numbers to Remember screen.
 * Mastered items persist across app sessions via AsyncStorage.
 */
export const [CdlNumbersProgressProvider, useCdlNumbersProgress] =
  createContextHook(() => {
    const [mastered, setMastered] = useState<Record<string, boolean>>({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((raw) => {
          if (raw) {
            setMastered(JSON.parse(raw) as Record<string, boolean>);
          }
        })
        .catch(() => {})
        .finally(() => setLoaded(true));
    }, []);

    const toggle = useCallback((id: string) => {
      setMastered((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    }, []);

    const reset = useCallback(() => {
      setMastered({});
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({})).catch(() => {});
    }, []);

    return { mastered, toggle, reset, loaded };
  });
