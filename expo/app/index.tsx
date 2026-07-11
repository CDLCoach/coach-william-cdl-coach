import { useRouter } from "expo-router";
import {
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  Coffee,
  Info,
  Lock,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  appBrand,
  appSubtitle,
  randomCornerMessage,
} from "@/constants/coach-william";
import {
  airBrakeMeta,
  inspectionSections,
  practiceMeta,
  pressureChallengeMeta,
} from "@/constants/inspections";
import { isProSection, useProAccess } from "@/constants/pro-access";
import { theme } from "@/constants/theme";

// ── Types ────────────────────────────────────────────────────────────────────

type MenuEntry = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  route: string;
  accent: string;
  isPro: boolean;
};

// ── Section lookup helpers ────────────────────────────────────────────────────

function findSection(id: string) {
  return inspectionSections.find((s) => s.id === id);
}

function inspectionEntry(id: string, accent: string): MenuEntry | null {
  const s = findSection(id);
  if (!s) return null;
  return {
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    icon: s.icon,
    route: `/inspection/${s.id}`,
    accent,
    isPro: isProSection(s.id),
  };
}

// ── FREE sections — START HERE ────────────────────────────────────────────────

function buildFreeEntries(): MenuEntry[] {
  const entries: MenuEntry[] = [];

  // 1. In-Cab Inspection
  const inCab = inspectionEntry("in-cab", theme.colors.amber);
  if (inCab) entries.push(inCab);

  // 2. Air Brake Test
  entries.push({
    id: airBrakeMeta.id,
    title: "Air Brake Test",
    subtitle: airBrakeMeta.subtitle,
    icon: airBrakeMeta.icon,
    route: "/air-brake",
    accent: theme.colors.blue,
    isPro: false,
  });

  // 3. CDL Numbers to Remember
  const cdlNumbers = inspectionEntry("cdl-numbers", theme.colors.green);
  if (cdlNumbers) entries.push(cdlNumbers);

  // 4. Mock Test
  entries.push({
    id: "mock-test",
    title: "Mock Test",
    subtitle: "Full simulated air brake check",
    icon: ClipboardCheck,
    route: "/air-brake?mode=mock",
    accent: theme.colors.blue,
    isPro: false,
  });

  return entries;
}

// ── PRO sections — UNLOCK COACH WILLIAM PRO ───────────────────────────────────
// Ordered to match the real CDL Pre-Trip Inspection sequence.

function buildProEntries(): MenuEntry[] {
  const entries: MenuEntry[] = [];

  const proIds = [
    "front",
    "passenger-side-engine",
    "engine",
    "driver-side",
    "back",
    "coupling",
    "trailer",
    "light-ops",
    "parking-brake-tug",
    "service-brake",
  ];

  for (const id of proIds) {
    const entry = inspectionEntry(id, theme.colors.amber);
    if (entry) entries.push(entry);
  }

  // Practice Test
  entries.push({
    id: practiceMeta.id,
    title: practiceMeta.title,
    subtitle: practiceMeta.subtitle,
    icon: practiceMeta.icon,
    route: "/practice",
    accent: theme.colors.green,
    isPro: isProSection(practiceMeta.id),
  });

  // Pressure Challenge
  entries.push({
    id: pressureChallengeMeta.id,
    title: pressureChallengeMeta.title,
    subtitle: pressureChallengeMeta.subtitle,
    icon: pressureChallengeMeta.icon,
    route: "/pressure-challenge",
    accent: theme.colors.red,
    isPro: isProSection(pressureChallengeMeta.id),
  });

  return entries;
}

const FREE_ENTRIES = buildFreeEntries();
const PRO_ENTRIES = buildProEntries();

// ── Menu Card Component ───────────────────────────────────────────────────────

function MenuCard({ entry, isPro }: { entry: MenuEntry; isPro: boolean }) {
  const router = useRouter();
  const Icon = entry.icon;
  const locked = entry.isPro && !isPro;
  const onPress = useCallback(() => {
    if (locked) {
      router.push(`/pro?returnTo=${encodeURIComponent(entry.route)}` as never);
      return;
    }
    router.push(entry.route as never);
  }, [router, entry.route, locked]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        locked && styles.cardLocked,
        pressed && styles.cardPressed,
      ]}
      testID={`menu-${entry.id}`}
    >
      <View
        style={[styles.iconWrap, { backgroundColor: entry.accent + "22" }]}
      >
        <Icon color={entry.accent} size={26} strokeWidth={2.2} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>
          {entry.title}
          {locked ? " 🔒" : ""}
        </Text>
        <Text style={styles.cardSubtitle}>{entry.subtitle}</Text>
      </View>
      {locked ? (
        <View style={styles.lockBadge}>
          <Lock color={theme.colors.blue} size={16} strokeWidth={2.5} />
        </View>
      ) : (
        <ChevronRight color={theme.colors.textFaint} size={22} />
      )}
    </Pressable>
  );
}

// ── Section Header Component ──────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: iconBg }]}>
        <Icon color={iconColor} size={22} strokeWidth={2.4} />
      </View>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPro } = useProAccess();
  const [showWelcome, setShowWelcome] = useState(true);
  const cornerMsg = useMemo(() => randomCornerMessage(), []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + theme.spacing.lg,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Welcome Banner ── */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeIconRow}>
            <View style={styles.welcomeIconWrap}>
              <Truck color={theme.colors.amber} size={28} strokeWidth={2.2} />
            </View>
          </View>
          <Text style={styles.welcomeBannerTitle}>
            🚛 Your Journey Begins Here
          </Text>
          <Text style={styles.welcomeBannerSlogan}>
            Train Smart. Stay Confident. Pass Your CDL.
          </Text>
          <Text style={styles.welcomeBannerSystem}>
            Built on Coach William&apos;s Focused Learning System™
          </Text>

          {showWelcome && (
            <Pressable
              onPress={() => setShowWelcome(false)}
              style={({ pressed }) => [
                styles.welcomeBeginBtn,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.welcomeBeginText}>Let&apos;s Get Started</Text>
              <ArrowRight
                color={theme.colors.background}
                size={20}
                strokeWidth={2.5}
              />
            </Pressable>
          )}
        </View>

        {/* ── Brand Header ── */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <ShieldCheck
              color={theme.colors.amber}
              size={18}
              strokeWidth={2.4}
            />
            <Text style={styles.badgeText}>CDL PREP</Text>
          </View>
          <Text style={styles.title}>{appBrand}</Text>
          <Text style={styles.subtitle}>{appSubtitle}</Text>
        </View>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── SECTION 1: START HERE (FREE) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <View style={styles.freeSection}>
          <SectionHeader
            icon={Truck}
            iconColor={theme.colors.amber}
            iconBg={theme.colors.amberSoft}
            title="🚛 START HERE"
            subtitle="Master the fundamentals before moving on to the complete CDL inspection."
          />
          <View style={styles.list}>
            {FREE_ENTRIES.map((entry) => (
              <MenuCard key={entry.id} entry={entry} isPro={isPro} />
            ))}
          </View>
          <View style={styles.freeBadgeRow}>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE LESSONS</Text>
            </View>
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── SECTION 2: UNLOCK COACH WILLIAM PRO ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <View style={styles.proSection}>
          <SectionHeader
            icon={Star}
            iconColor={theme.colors.blue}
            iconBg={theme.colors.blueSoft}
            title="⭐ UNLOCK COACH WILLIAM PRO"
            subtitle="Continue your CDL journey with the complete inspection training system."
          />

          {/* PRO Upgrade Card */}
          <Pressable
            onPress={() => router.push("/pro")}
            style={({ pressed }) => [styles.proUpgradeCard, pressed && styles.cardPressed]}
            testID="menu-pro"
          >
            <View style={styles.proUpgradeIconWrap}>
              <Sparkles
                color={theme.colors.blue}
                size={20}
                strokeWidth={2.5}
              />
            </View>
            <View style={styles.proUpgradeTextWrap}>
              <Text style={styles.proUpgradeTitle}>
                {isPro ? "Coach William PRO Active" : "Unlock Coach William PRO"}
              </Text>
              <Text style={styles.proUpgradeSubtitle}>
                {isPro
                  ? "All lessons unlocked — enjoy!"
                  : "One-time purchase · $9.99 · Own it forever"}
              </Text>
            </View>
            {!isPro && (
              <View style={styles.proPriceTag}>
                <Text style={styles.proPriceText}>$9.99</Text>
              </View>
            )}
          </Pressable>

          {/* PRO Lesson Cards */}
          <View style={styles.list}>
            {PRO_ENTRIES.map((entry) => (
              <MenuCard key={entry.id} entry={entry} isPro={isPro} />
            ))}
          </View>

          <View style={styles.proBadgeRow}>
            <View style={styles.proBadge}>
              <Lock color={theme.colors.blue} size={12} strokeWidth={2.5} />
              <Text style={styles.proBadgeText}>PRO LESSONS</Text>
            </View>
          </View>
        </View>

        {/* ── About ── */}
        <Pressable
          onPress={() => router.push("/about")}
          style={({ pressed }) => [styles.aboutRow, pressed && styles.cardPressed]}
          testID="menu-about"
        >
          <Info color={theme.colors.textMuted} size={20} />
          <Text style={styles.aboutText}>About this app</Text>
          <ChevronRight color={theme.colors.textFaint} size={20} />
        </Pressable>

        {/* ── Coach William's Corner ── */}
        <View style={styles.cornerCard}>
          <View style={styles.cornerHeader}>
            <Coffee color={theme.colors.amber} size={16} strokeWidth={2.2} />
            <Text style={styles.cornerBadge}>Coach William&apos;s Corner</Text>
          </View>
          <Text style={styles.cornerText}>"{cornerMsg}"</Text>
        </View>

        <Text style={styles.footerText}>
          Helping students build confidence one step at a time.
        </Text>
      </ScrollView>
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

  // ── Welcome Banner ──
  welcomeBanner: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.amberDark,
    marginBottom: theme.spacing.lg,
    alignItems: "center",
  },
  welcomeIconRow: {
    marginBottom: theme.spacing.md,
  },
  welcomeIconWrap: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.amberSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.amber,
  },
  welcomeBannerTitle: {
    color: theme.colors.amber,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  welcomeBannerSlogan: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  welcomeBannerSystem: {
    color: theme.colors.amber,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
    marginBottom: theme.spacing.md,
  },
  welcomeBeginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.colors.amber,
    borderRadius: theme.radius.md,
    paddingVertical: 15,
    paddingHorizontal: 32,
    width: "100%",
    marginTop: theme.spacing.sm,
  },
  welcomeBeginText: {
    color: theme.colors.background,
    fontSize: 17,
    fontWeight: "900",
  },

  // ── Header ──
  header: {
    marginBottom: theme.spacing.xl,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: theme.colors.amberSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    color: theme.colors.amber,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 6,
  },

  // ── Section Headers ──
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeaderText: {
    flex: 1,
    paddingTop: 2,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  // ── FREE Section ──
  freeSection: {
    marginBottom: theme.spacing.sm,
  },
  freeBadgeRow: {
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  freeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.greenSoft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
  freeBadgeText: {
    color: theme.colors.green,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  // ── Divider ──
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.amberDark,
    marginHorizontal: 12,
  },

  // ── PRO Section ──
  proSection: {
    marginBottom: theme.spacing.lg,
  },
  proBadgeRow: {
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.blueSoft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.blue,
  },
  proBadgeText: {
    color: theme.colors.blue,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  // ── PRO Upgrade Card ──
  proUpgradeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.blueSoft,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.blue,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  proUpgradeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.blue + "33",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.blue,
  },
  proUpgradeTextWrap: {
    flex: 1,
  },
  proUpgradeTitle: {
    color: theme.colors.blue,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  proUpgradeSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
  proPriceTag: {
    backgroundColor: theme.colors.blue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
  },
  proPriceText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  // ── Cards ──
  list: {
    gap: theme.spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.985 }],
  },
  cardLocked: {
    borderColor: theme.colors.blue,
    borderWidth: 1.5,
  },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.blue,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },

  // ── About ──
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    ...Platform.select({ web: { cursor: "pointer" as const }, default: {} }),
  },
  aboutText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  // ── Coach William's Corner ──
  cornerCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginTop: theme.spacing.lg,
  },
  cornerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  cornerBadge: {
    color: theme.colors.amber,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cornerText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 23,
  },

  // ── Footer ──
  footerText: {
    color: theme.colors.textFaint,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: theme.spacing.lg,
    marginBottom: 4,
  },
});
