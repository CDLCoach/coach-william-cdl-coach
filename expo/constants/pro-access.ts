import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Platform } from "react-native";
import Purchases, {
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "react-native-purchases";

const ENTITLEMENT_ID = "pro";

/**
 * Picks the correct RevenueCat public API key based on platform and build type.
 * Uses the Test Store key for web preview and dev builds, production keys for
 * signed iOS/Android builds.
 */
function getRCToken(): string | undefined {
  if (__DEV__ || Platform.OS === "web") {
    return process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
  }
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
    default: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY,
  });
}

// Configure RevenueCat at module level — not inside a component or useEffect.
const rcApiKey = getRCToken();
if (rcApiKey) {
  try {
    Purchases.configure({ apiKey: rcApiKey });
  } catch (error) {
    console.warn("[RevenueCat] Configuration failed:", error);
  }
}

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
 * PRO access state backed by RevenueCat entitlements.
 * The `pro` entitlement is granted after a successful one-time purchase
 * of the `coach_william_pro` product via the current offering.
 */
export const [ProAccessProvider, useProAccess] = createContextHook(() => {
  const queryClient = useQueryClient();

  const { data: customerInfo, isLoading: infoLoading } =
    useQuery<CustomerInfo>({
      queryKey: ["rc-customer-info"],
      queryFn: () => Purchases.getCustomerInfo(),
    });

  const { data: offeringsData } = useQuery<PurchasesOfferings>({
    queryKey: ["rc-offerings"],
    queryFn: () => Purchases.getOfferings(),
    staleTime: 1000 * 60 * 5,
  });

  const isPro = Boolean(customerInfo?.entitlements.active[ENTITLEMENT_ID]);
  const loaded = !infoLoading;

  const proPackage: PurchasesPackage | undefined =
    offeringsData?.current?.availablePackages?.[0] ??
    offeringsData?.current?.lifetime ??
    undefined;

  /** Attempts to purchase the PRO package. Returns true if the entitlement is active afterwards. */
  const purchasePro = useCallback(async (): Promise<boolean> => {
    if (!proPackage) {
      throw new Error("No purchase package available. Please try again later.");
    }
    try {
      const result = await Purchases.purchasePackage(proPackage);
      await queryClient.invalidateQueries({ queryKey: ["rc-customer-info"] });
      return Boolean(result.customerInfo.entitlements.active[ENTITLEMENT_ID]);
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return false;
      }
      throw error;
    }
  }, [proPackage, queryClient]);

  /** Restores previous purchases. Returns true if the pro entitlement is active afterwards. */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    const restoredInfo = await Purchases.restorePurchases();
    await queryClient.invalidateQueries({ queryKey: ["rc-customer-info"] });
    return Boolean(restoredInfo.entitlements.active[ENTITLEMENT_ID]);
  }, [queryClient]);

  return { isPro, loaded, purchasePro, restorePurchases, proPackage };
});
