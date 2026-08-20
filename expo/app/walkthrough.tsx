import { router } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { useWalkthrough } from "@/constants/walkthrough";

// ── Walkthrough Steps ─────────────────────────────────────────────────────────

type WalkthroughStep = {
  id: string;
  icon: LucideIcon;
  title: string;
  text: string;
  support: string;
};

const STEPS: WalkthroughStep[] = [
  {
    id: "learn",
    icon: BookOpen,
    title: "LEARN",
    text: "Learn each inspection section step-by-step with Coach William.",
    support: "Start by learning what to inspect, what to say, and why it matters.",
  },
  {
    id: "remember",
    icon: Brain,
    title: "REMEMBER",
    text: "Build recall by practicing the inspection in forward, reverse, and random order.",
    support:
      "Repetition helps you remember the inspection sequence without relying on prompts.",
  },
  {
    id: "test",
    icon: ClipboardCheck,
    title: "TEST",
    text: "Test yourself until you can perform the inspection confidently without help.",
    support: "Put everything together and find out what you know before test day.",
  },
];

// ── Walkthrough Screen ────────────────────────────────────────────────────────

export default function WalkthroughScreen() {
  const insets = useSafeAreaInsets();
  const { markWalkthroughSeen } = useWalkthrough();
  const [step, setStep] = useState(0);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  /** Exits the walkthrough and returns to where it was opened from. */
  const skip = useCallback(() => {
    markWalkthroughSeen();
    router.back();
  }, [markWalkthroughSeen]);

  /** Finishes the walkthrough and opens the existing In-Cab Inspection lesson. */
  const startTraining = useCallback(() => {
    markWalkthroughSeen();
    router.replace("/inspection/in-cab" as never);
  }, [markWalkthroughSeen]);

  /** Steps backwards between steps; on step 1, exits the walkthrough. */
  const goBack = useCallback((): boolean => {
    if (step > 0) {
      setStep(step - 1);
      return true;
    }
    markWalkthroughSeen();
    return false;
  }, [step, markWalkthroughSeen]);

  // Android hardware back steps backwards through the walkthrough.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", goBack);
    return () => sub.remove();
  }, [goBack]);

  return (
    <View style={styles.container}>
      {/* ── Top Bar: Step Dots + Skip ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + theme.spacing.lg }]}>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <View key={s.id} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <Pressable onPress={skip} style={styles.skipBtn} hitSlop={10} testID="walkthrough-skip">
          <Text style={styles.skipText}>SKIP</Text>
        </Pressable>
      </View>

      {/* ── Step Card ── */}
      <View style={styles.stepWrap}>
        <View style={styles.card} key={current.id}>
          <View style={styles.iconWrap}>
            <Icon color={theme.colors.amber} size={36} strokeWidth={2.2} />
          </View>
          <Text style={styles.stepTitle}>{current.title}</Text>
          <Text style={styles.stepText}>{current.text}</Text>
          <Text style={styles.stepSupport}>{current.support}</Text>
        </View>
      </View>

      {/* ── Bottom Bar: Back + Next / Start Training ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + theme.spacing.md }]}>
        <View style={styles.btnRow}>
          {step > 0 ? (
            <Pressable
              onPress={goBack}
              style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
              testID="walkthrough-back"
            >
              <ArrowLeft color={theme.colors.textMuted} size={19} strokeWidth={2.6} />
              <Text style={styles.backText}>BACK</Text>
            </Pressable>
          ) : (
            <View style={styles.backSpacer} />
          )}
          <Pressable
            onPress={isLast ? startTraining : () => setStep(step + 1)}
            style={({ pressed }) => [styles.nextBtn, pressed && styles.btnPressed]}
            testID={isLast ? "walkthrough-start" : "walkthrough-next"}
          >
            <Text style={styles.nextText}>{isLast ? "START TRAINING" : "NEXT"}</Text>
            <ArrowRight color={theme.colors.background} size={20} strokeWidth={2.8} />
          </Pressable>
        </View>
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

  // ── Top Bar ──
  topBar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  dots: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.amber,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  // ── Step Card ──
  stepWrap: {
    flex: 1,
    justifyContent: "center" as const,
    paddingHorizontal: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.amberDark,
    padding: theme.spacing.xl,
    alignItems: "center" as const,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.amberSoft,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 2,
    borderColor: theme.colors.amber,
    marginBottom: theme.spacing.md,
  },
  stepTitle: {
    color: theme.colors.amber,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  stepText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: theme.spacing.md,
  },
  stepSupport: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 23,
  },

  // ── Bottom Bar ──
  bottomBar: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  btnRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: theme.spacing.sm,
  },
  backBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    width: 104,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backSpacer: {
    width: 104,
  },
  backText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  nextBtn: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.amber,
  },
  nextText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
});
