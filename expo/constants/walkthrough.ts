import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "coach-william-walkthrough-seen";

/**
 * Getting Started walkthrough state. Tracks whether the user has already
 * completed or skipped the 3-step introduction so it is never forced on
 * repeat launches. The About section can always reopen it manually.
 */
export const [WalkthroughProvider, useWalkthrough] = createContextHook(() => {
  const [hasSeen, setHasSeen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => setHasSeen(value === "true"))
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  /** Marks the walkthrough as seen so it is not shown again automatically. */
  const markWalkthroughSeen = useCallback(() => {
    setHasSeen(true);
    AsyncStorage.setItem(STORAGE_KEY, "true").catch(() => undefined);
  }, []);

  return { hasSeenWalkthrough: hasSeen, loaded, markWalkthroughSeen };
});
