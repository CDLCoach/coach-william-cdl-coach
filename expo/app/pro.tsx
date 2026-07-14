import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Check,
  ChevronRight,
  Coffee,
  type LucideIcon,
  RotateCcw,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProAccess } from "@/constants/pro-access";
import { theme } from "@/constants/theme";

// ── Data ─────────────────────────────────────────────────────────────────────

type FeatureGroup = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

const INCLUDED_GROUPS: FeatureGroup[] = [
  {
    title: "Complete Outside Inspection",
    icon: Truck,
    items: [
      "Front of Tractor",
      "Passenger Side Engine",
      "Driver Side Engine",
      "Driver Side Inspection",
      "Rear of Tractor",
      "Coupling System",
      "Trailer Inspection",
    ],
  },
  {
    title: "Complete Brake Testing",
    icon: Check,
    items: [
      "Parking Brake (Tug) Test",
      "Service Brake Test",
    ],
  },
  {
    title: "Complete Study System",
    icon: Sparkles,
    items: [
      "Full Practice Test Library",
      "Full Pressure Challenge Library",
    ],
  },
];

const FUTURE_UPDATES: { label: string; icon: LucideIcon }[] = [
  { label: "Interactive Truck Photos", icon: Truck },
  { label: "Find the Part", icon: Zap },
  { label: "Coach William's Pairing Method", icon: Sparkles },
  { label: "Future learning enhancements", icon: Coffee },
];

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProUpgradeScreen() {
  const insets = useSafeAreaInsets();
  const { isPro, purchasePro, restorePurchases, proPackage } = useProAccess();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const navigateAfterUnlock = useCallback(() => {
    if (returnTo) {
      router.replace(returnTo as never);
    } else {
      router.back();
    }
  }, [returnTo]);

  const handlePurchase = useCallback(async () => {
    if (purchasing || isPro) return;
    setPurchasing(true);
    try {
      const success = await purchasePro();
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigateAfterUnlock();
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Purchase Failed",
        "We couldn't complete your purchase. Please try again or restore your previous purchase.",
      );
    } finally {
      setPurchasing(false);
    }
  }, [purchasing, isPro, purchasePro, navigateAfterUnlock]);

  const handleRestore = useCallback(async () => {
    if (restoring) return;
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigateAfterUnlock();
      } else {
        Alert.alert(
          "No Purchases Found",
          "No previous Coach William Pro purchase was found. If you believe this is an error, ensure you're signed in to the same store account used for your original purchase.",
        );
      }
    } catch {
      Alert.alert(
        "Restore Failed",
        "We couldn't restore your purchases. Please check your internet connection and try again.",
      );
    } finally {
      setRestoring(false);
    }
  }, [restoring, restorePurchases, navigateAfterUnlock]);

  const displayPrice = proPackage?.product?.priceString ?? "$9.99";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + theme.spacing.lg,
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Banner ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.truckBadge}>
            <Truck color={theme.colors.blue} size={34} strokeWidth={2.2} />
          </View>
          <Text style={styles.heroTitle}>Unlock Coach William PRO</Text>
          <Text style={styles.heroSubtitle}>
            Continue your CDL journey with Coach William's Focused Learning
            System™.
          </Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroBody}>Unlock the complete CDL training experience.</Text>
        </View>

        {/* ── Included Features ── */}
        <Text style={styles.sectionLabel}>INCLUDED WITH COACH WILLIAM PRO</Text>

        {INCLUDED_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <View key={group.title} style={styles.featureGroup}>
              <View style={styles.groupHeader}>
                <View style={styles.groupIconWrap}>
                  <GroupIcon color={theme.colors.blue} size={18} strokeWidth={2.4} />
                </View>
                <Text style={styles.groupTitle}>{group.title}</Text>
              </View>
              {group.items.map((item) => (
                <View key={item} style={styles.featureRow}>
                  <View style={styles.checkCircle}>
                    <Check color={theme.colors.background} size={13} strokeWidth={3.5} />
                  </View>
                  <Text style={styles.featureText}>{item}</Text>
                </View>
              ))}
            </View>
          );
        })}

        {/* ── Future Updates ── */}
        <View style={styles.futureCard}>
          <View style={styles.futureHeader}>
            <Sparkles color={theme.colors.amber} size={18} strokeWidth={2.2} />
            <Text style={styles.futureTitle}>Future PRO Updates Included</Text>
          </View>
          {FUTURE_UPDATES.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.label} style={styles.futureRow}>
                <View style={styles.futureIconWrap}>
                  <Icon color={theme.colors.amber} size={14} strokeWidth={2.2} />
                </View>
                <Text style={styles.futureText}>{item.label}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Pricing ── */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingBadge}>
            <Text style={styles.pricingBadgeText}>ONE-TIME PURCHASE</Text>
          </View>
          <Text style={styles.priceLarge}>{displayPrice}</Text>
          <Text style={styles.priceSub}>No Monthly Subscription</Text>
          <View style={styles.priceDivider} />
          <Text style={styles.priceTagline}>Pay Once. Own It Forever.</Text>
        </View>

        {/* ── Coach William Message ── */}
        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <Coffee color={theme.colors.amber} size={16} strokeWidth={2.2} />
            <Text style={styles.coachLabel}>Coach William</Text>
          </View>
          <Text style={styles.coachText}>
            Thank you for supporting Coach William CDL Inspection Coach.
          </Text>
          <Text style={styles.coachText}>
            Your purchase helps us continue developing new training tools and
            future updates to help CDL students succeed.
          </Text>
        </View>

        {/* ── Closing Message ── */}
        <View style={styles.closingCard}>
          <Text style={styles.closingLine}>Train Smart.</Text>
          <Text style={styles.closingLine}>Stay Confident.</Text>
          <Text style={styles.closingLine}>Pass Your CDL.</Text>
        </View>
      </ScrollView>

      {/* ── Sticky Bottom Buttons ── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + theme.spacing.md },
        ]}
      >
        {isPro ? (
          <>
            <View style={styles.proActiveBadge}>
              <Check color={theme.colors.green} size={18} strokeWidth={3} />
              <Text style={styles.proActiveText}>PRO Active</Text>
            </View>
            <Pressable
              onPress={navigateAfterUnlock}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.continueText}>Continue</Text>
              <ChevronRight color={theme.colors.background} size={20} strokeWidth={3} />
            </Pressable>
          </>
        ) : (
          <View style={styles.buttonStack}>
            <Pressable
              onPress={handlePurchase}
              disabled={purchasing}
              style={({ pressed }) => [
                styles.unlockButton,
                pressed && styles.buttonPressed,
                purchasing && styles.buttonDisabled,
              ]}
              testID="pro-unlock"
            >
              {purchasing ? (
                <>
                  <ActivityIndicator size="small" color={theme.colors.background} />
                  <Text style={styles.unlockText}>Processing…</Text>
                </>
              ) : (
                <>
                  <Truck color={theme.colors.background} size={20} strokeWidth={2.6} />
                  <Text style={styles.unlockText}>Unlock PRO · {displayPrice}</Text>
                  <ChevronRight color={theme.colors.background} size={20} strokeWidth={3} />
                </>
              )}
            </Pressable>
            <Pressable
              onPress={handleRestore}
              disabled={restoring}
              style={({ pressed }) => [
                styles.restoreButton,
                pressed && styles.buttonPressed,
                restoring && styles.buttonDisabled,
              ]}
              testID="restore-purchases"
            >
              {restoring ? (
                <>
                  <ActivityIndicator size="small" color={theme.colors.textMuted} />
                  <Text style={styles.restoreText}>Restoring…</Text>
                </>
              ) : (
                <>
                  <RotateCcw color={theme.colors.textMuted} size={17} strokeWidth={2.4} />
                  <Text style={styles.restoreText}>Restore Purchases</Text>
                </>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    paddingHorizontal: theme.spacing.md,
  },

  // ── Hero ──
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.blue,
    marginBottom: theme.spacing.lg,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: theme.colors.blue,
    opacity: 0.08,
  },
  truckBadge: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: theme.colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.blue,
    marginBottom: theme.spacing.md,
  },
  heroTitle: {
    color: theme.colors.blue,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  heroSubtitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.md,
    paddingHorizontal: 8,
  },
  heroDivider: {
    width: 50,
    height: 3,
    borderRadius: 999,
    backgroundColor: theme.colors.blue,
    marginBottom: theme.spacing.md,
  },
  heroBody: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },

  // ── Section Labels ──
  sectionLabel: {
    color: theme.colors.textFaint,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 4,
  },

  // ── Feature Groups ──
  featureGroup: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  groupHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 14,
  },
  groupIconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.blueSoft,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: theme.colors.blue,
  },
  groupTitle: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  featureRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 7,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: theme.colors.blue,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  featureText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Future Updates ──
  futureCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  futureHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 12,
  },
  futureTitle: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  futureRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 6,
  },
  futureIconWrap: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
  },
  futureText: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Pricing ──
  pricingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.blue,
    alignItems: "center" as const,
    marginBottom: theme.spacing.lg,
  },
  pricingBadge: {
    backgroundColor: theme.colors.blueSoft,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.blue,
    marginBottom: theme.spacing.md,
  },
  pricingBadgeText: {
    color: theme.colors.blue,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  priceLarge: {
    color: theme.colors.white,
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 4,
  },
  priceSub: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  priceDivider: {
    width: 40,
    height: 2,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  priceTagline: {
    color: theme.colors.blue,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  // ── Coach William Message ──
  coachCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginBottom: theme.spacing.lg,
  },
  coachHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 10,
  },
  coachLabel: {
    color: theme.colors.amber,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  coachText: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 8,
  },

  // ── Closing ──
  closingCard: {
    alignItems: "center" as const,
    paddingVertical: theme.spacing.lg,
    gap: 4,
  },
  closingLine: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  // ── Bottom Bar ──
  bottomBar: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...Platform.select({
      web: { shadowColor: "transparent" as const },
      default: {
        shadowColor: theme.colors.background,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 12,
      },
    }),
  },
  buttonStack: {
    gap: 10,
  },
  unlockButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.blue,
  },
  restoreButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  restoreText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  unlockText: {
    color: theme.colors.background,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // ── PRO Active State ──
  proActiveBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.greenSoft,
    borderWidth: 1.5,
    borderColor: theme.colors.green,
  },
  proActiveText: {
    color: theme.colors.green,
    fontSize: 16,
    fontWeight: "900",
  },
  continueButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.blue,
  },
  continueText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});
