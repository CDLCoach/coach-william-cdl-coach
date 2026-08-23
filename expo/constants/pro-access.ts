import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Platform } from "react-native";
import Purchases, {
  PURCHASES_ERROR_CODE,
  PURCHASE_TYPE,
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "react-native-purchases";

const ENTITLEMENT_ID = "pro";

/**
 * Google Play one-time product ID for the lifetime Premium unlock.
 * Non-consumable — a single purchase permanently unlocks PRO, and is
 * restorable across reinstalls/devices on the same Google account.
 */
const PREMIUM_PRODUCT_ID = "premium_lifetime";

/**
 * Beta mode flag — when true, all PRO features are unlocked automatically
 * without a purchase. Set via `EXPO_PUBLIC_BETA_MODE=true` in the EAS build
 * profile for closed testing. Production builds omit this variable, so the
 * normal $9.99 purchase requirement is restored automatically.
 */
export const BETA_MODE: boolean = process.env.EXPO_PUBLIC_BETA_MODE === "true";

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
 * of the `premium_lifetime` Google Play product (via the current offering,
 * or a direct product purchase if no offering package is available).
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

  type PremiumStoreProduct = Awaited<
    ReturnType<typeof Purchases.getProducts>
  >[number];

  // Fallback product lookup (used when the offering has no package) so the
  // paywall can show Google Play's localized price for premium_lifetime.
  const { data: storeProduct } = useQuery<PremiumStoreProduct | null>({
    queryKey: ["rc-premium-product"],
    queryFn: async () => {
      try {
        const products = await Purchases.getProducts(
          [PREMIUM_PRODUCT_ID],
          PURCHASE_TYPE.INAPP,
        );
        return products[0] ?? null;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // In beta mode, PRO is always unlocked — no purchase required.
  const isPro = BETA_MODE || Boolean(customerInfo?.entitlements.active[ENTITLEMENT_ID]);
  const loaded = BETA_MODE || !infoLoading;

  const proPackage: PurchasesPackage | undefined =
    offeringsData?.current?.availablePackages?.[0] ??
    offeringsData?.current?.lifetime ??
    undefined;

  /** Localized price string for the Premium product from the store.
   *  Undefined until store data loads — callers fall back to "$9.99". */
  const premiumPrice: string | undefined =
    proPackage?.product?.priceString ?? storeProduct?.priceString ?? undefined;

  /** Attempts to purchase the PRO product. Returns true if the entitlement is active afterwards.
   *  In beta mode, returns true immediately without contacting RevenueCat.
   *  Uses the RevenueCat offering package when it maps to premium_lifetime;
   *  otherwise purchases the Google Play product directly as a one-time
   *  non-consumable (INAPP). */
  const purchasePro = useCallback(async (): Promise<boolean> => {
    if (BETA_MODE) return true;
    try {
      const result =
        proPackage && proPackage.product.identifier === PREMIUM_PRODUCT_ID
          ? await Purchases.purchasePackage(proPackage)
          : await Purchases.purchaseProduct(
              PREMIUM_PRODUCT_ID,
              null,
              PURCHASE_TYPE.INAPP,
            );
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

  /** Restores previous purchases. Returns true if the pro entitlement is active afterwards.
   *  In beta mode, returns true immediately without contacting RevenueCat. */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (BETA_MODE) return true;
    const restoredInfo = await Purchases.restorePurchases();
    await queryClient.invalidateQueries({ queryKey: ["rc-customer-info"] });
    return Boolean(restoredInfo.entitlements.active[ENTITLEMENT_ID]);
  }, [queryClient]);

  return {
    isPro,
    loaded,
    purchasePro,
    restorePurchases,
    proPackage,
    premiumPrice,
    betaMode: BETA_MODE,
  };
});
