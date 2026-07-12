import { router } from "expo-router";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Coffee,
  ExternalLink,
  GraduationCap,
  HardHat,
  Heart,
  LifeBuoy,
  Lightbulb,
  Lock,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react-native";
import React from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  appBrand,
  appSubtitle,
  appTagline,
  randomSignOff,
} from "@/constants/coach-william";
import { useProAccess } from "@/constants/pro-access";
import { theme } from "@/constants/theme";

/** Base URL for the Coach William Training website hosted on GitHub Pages.
 *  Update this after publishing your GitHub Pages site. */
const SITE_URL = "https://cdlcoach.github.io/coach-william-cdl-coach";

const WELCOME_PARAS = [
  "Welcome to Coach William's Rapid Recall System.",
  "This app combines industry-standard CDL inspection procedures with Coach William's unique teaching style, inspection flow, coaching methods, memory techniques, humor, and confidence-building approach.",
  "The goal is simple: Help students become safe, confident professional drivers.",
];

const WILLIAM_ROLES = [
  { icon: HardHat, label: "Diesel Mechanic" },
  { icon: Truck, label: "Company Driver" },
  { icon: Users, label: "Owner-Operator" },
  { icon: Truck, label: "Fleet Owner" },
  { icon: GraduationCap, label: "Over-the-Road Driver Trainer" },
  { icon: BookOpen, label: "CDL Instructor" },
];

const RAPID_RECALL_FEATURES = [
  "Learn Mode",
  "Forward Recall",
  "Reverse Recall",
  "Random Recall",
  "Pressure Recall",
  "Mock Examiner",
  "Memory Toolbox",
  "CDL Numbers to Remember",
  "Coach William's Coaching System",
  "Positive reinforcement",
  "Classroom humor",
  "Confidence-building techniques",
];

const FUTURE_PRODUCTS = [
  "Hazmat Coach",
  "Tanker Coach",
  "Doubles & Triples Coach",
  "Backing & Maneuver Coach",
  "CDL Permit Prep",
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { isPro, lock } = useProAccess();

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Unable to open link", "Please check your internet connection and try again.");
    });
  };

  const handleResetToFree = () => {
    lock();
    Alert.alert("FREE testing mode restored.");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.logo}>
          <ShieldCheck color={theme.colors.amber} size={44} strokeWidth={2.2} />
        </View>
        <Text style={styles.title}>{appBrand}</Text>
        <Text style={styles.subtitle}>{appSubtitle}</Text>
        <Text style={styles.tagline}>{appTagline}</Text>

        {/* ── PRO Status / Settings ── */}
        <View style={styles.proStatusCard}>
          <View style={styles.sectionHeader}>
            <ShieldCheck color={theme.colors.blue} size={20} strokeWidth={2.2} />
            <Text style={[styles.sectionTitle, { color: theme.colors.blue }]}>PRO STATUS</Text>
          </View>
          {isPro ? (
            <View style={styles.proStatusActive}>
              <View style={styles.proStatusDotActive} />
              <Text style={styles.proStatusActiveText}>PRO Status: Demo Testing Access</Text>
            </View>
          ) : (
            <View style={styles.proStatusLocked}>
              <Lock color={theme.colors.blue} size={14} strokeWidth={2.4} />
              <Text style={styles.proStatusLockedText}>FREE user</Text>
            </View>
          )}
          <Text style={styles.proStatusNote}>
            This is a development/beta version. PRO access is simulated for testing. Real Google Play and Apple purchases will be connected before public release.
          </Text>
          {isPro ? (
            <Pressable
              onPress={handleResetToFree}
              style={({ pressed }) => [
                styles.resetBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Lock color={theme.colors.red} size={16} strokeWidth={2.4} />
              <Text style={styles.resetBtnText}>Reset to FREE (Testing)</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push("/pro")}
              style={({ pressed }) => [
                styles.proStatusBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.proStatusBtnText}>Unlock Coach William PRO</Text>
              <ChevronRight color={theme.colors.background} size={18} strokeWidth={2.8} />
            </Pressable>
          )}
        </View>

        {/* ── Welcome ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Coffee color={theme.colors.amber} size={20} strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>WELCOME</Text>
          </View>
          {WELCOME_PARAS.map((p, i) => (
            <Text key={i} style={[styles.body, i < WELCOME_PARAS.length - 1 && styles.bodySpaced]}>
              {p}
            </Text>
          ))}
        </View>

        {/* ── Meet Coach William ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users color={theme.colors.amber} size={20} strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>MEET COACH WILLIAM</Text>
          </View>
          <Text style={[styles.body, styles.bodySpaced]}>
            Coach William has been part of the trucking industry since approximately 1990.
          </Text>
          <Text style={[styles.label, { marginBottom: 12 }]}>His experience includes:</Text>
          <View style={styles.roleList}>
            {WILLIAM_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <View key={role.label} style={styles.roleItem}>
                  <Icon color={theme.colors.amber} size={18} strokeWidth={2} />
                  <Text style={styles.roleText}>{role.label}</Text>
                </View>
              );
            })}
          </View>
          <Text style={[styles.body, styles.bodySpaced]}>
            He worked as a diesel mechanic for approximately three years before beginning his professional driving career in 1993.
          </Text>
          <Text style={styles.body}>
            Throughout his trucking career, Coach William has developed practical teaching techniques that help students understand, remember, and confidently perform the CDL inspection.
          </Text>
        </View>

        {/* ── Rapid Recall System ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain color={theme.colors.amber} size={20} strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>COACH WILLIAM'S RAPID RECALL SYSTEM</Text>
          </View>
          <Text style={[styles.body, styles.bodySpaced]}>
            The Rapid Recall System is Coach William's teaching approach.
          </Text>
          <Text style={[styles.body, styles.bodySpaced]}>It combines:</Text>
          <View style={styles.featureList}>
            {RAPID_RECALL_FEATURES.map((f) => (
              <View key={f} style={styles.featureItem}>
                <ChevronRight color={theme.colors.amber} size={14} strokeWidth={2.5} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.body, { marginTop: 12 }]}>
            These features work together as one complete learning system designed to improve confidence, retention, and test-day performance.
          </Text>
        </View>

        {/* ── Important Note ── */}
        <View style={styles.noteCard}>
          <View style={styles.sectionHeader}>
            <Lightbulb color={theme.colors.amber} size={20} strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>IMPORTANT NOTE</Text>
          </View>
          <Text style={[styles.noteText, styles.bodySpaced]}>
            This app teaches industry-standard CDL inspection procedures.
          </Text>
          <Text style={[styles.noteText, styles.bodySpaced]}>
            Common instructional memory aids such as PMS, BCD, CCF, COPS, and ABC are presented as learning tools commonly used during CDL instruction.
          </Text>
          <Text style={[styles.noteText, styles.bodySpaced]}>
            Coach William does not claim ownership of these acronyms.
          </Text>
          <Text style={styles.noteText}>
            The originality of this app comes from Coach William's teaching style, inspection flow, coaching philosophy, Rapid Recall System, classroom experience, and real-world trucking knowledge.
          </Text>
        </View>

        {/* ── Coach William's Mission ── */}
        <View style={styles.missionCard}>
          <View style={styles.sectionHeader}>
            <Heart color={theme.colors.red} size={20} strokeWidth={2.2} />
            <Text style={[styles.sectionTitle, { color: theme.colors.red }]}>COACH WILLIAM'S MISSION</Text>
          </View>
          <Text style={[styles.missionQuote, styles.bodySpaced]}>
            "My goal isn't just to help you pass your CDL Skills Test."
          </Text>
          <Text style={[styles.missionQuote, styles.bodySpaced]}>
            "My goal is to help you become a safe, confident professional driver."
          </Text>
          <View style={styles.missionCta}>
            <Coffee color={theme.colors.amber} size={16} strokeWidth={2.2} />
            <Text style={styles.missionCtaText}>Grab a cup of coffee...</Text>
          </View>
          <Text style={styles.missionFinal}>Let's get to work, Hero!</Text>
        </View>

        {/* ── Future Products ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck color={theme.colors.amber} size={20} strokeWidth={2.2} />
            <Text style={styles.sectionTitle}>COMING SOON</Text>
          </View>
          <Text style={[styles.body, styles.bodySpaced]}>
            As Coach William's Rapid Recall System continues to grow, additional training products will be released using the same proven teaching philosophy, confidence-building approach, and coaching style found throughout CDL Inspection Coach.
          </Text>
          <Text style={[styles.body, styles.bodySpaced]}>
            Each new product will build upon the same learning system to help professional drivers master new skills with confidence.
          </Text>
          <View style={styles.featureList}>
            {FUTURE_PRODUCTS.map((p) => (
              <View key={p} style={styles.featureItem}>
                <ChevronRight color={theme.colors.amber} size={14} strokeWidth={2.5} />
                <Text style={styles.featureText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Coach William's Vision ── */}
        <View style={styles.visionCard}>
          <View style={styles.sectionHeader}>
            <Lightbulb color={theme.colors.amber} size={20} strokeWidth={2.2} />
            <Text style={[styles.sectionTitle, { color: theme.colors.amber }]}>COACH WILLIAM'S VISION</Text>
          </View>
          <Text style={[styles.visionQuote, styles.bodySpaced]}>
            "My mission is to help build safe, confident professional drivers by creating practical, easy-to-understand training that students actually enjoy using.
          </Text>
          <Text style={[styles.visionQuote, styles.bodySpaced]}>
            Every lesson, quiz, recall mode, and coaching message is designed to build confidence through repetition, understanding, and encouragement.
          </Text>
          <Text style={[styles.visionQuote, styles.bodySpaced]}>
            Whether you're earning your first CDL or adding new endorsements, my goal is to help you succeed—one step at a time."
          </Text>
          <View style={styles.missionCta}>
            <Coffee color={theme.colors.amber} size={16} strokeWidth={2.2} />
            <Text style={styles.missionCtaText}>Grab a cup of coffee...</Text>
          </View>
          <Text style={styles.visionFinal}>Let's get to work, Hero!</Text>
        </View>

        {/* ── Legal & Support ── */}
        <View style={styles.legalSection}>
          <Pressable
            onPress={() => openUrl(`${SITE_URL}/privacy.html`)}
            style={({ pressed }) => [
              styles.legalLink,
              pressed && styles.btnPressed,
            ]}
          >
            <ShieldCheck color={theme.colors.blue} size={18} strokeWidth={2.2} />
            <Text style={styles.legalLinkText}>Privacy Policy</Text>
            <ExternalLink color={theme.colors.textFaint} size={15} strokeWidth={2} />
          </Pressable>
          <Pressable
            onPress={() => openUrl(`${SITE_URL}/support.html`)}
            style={({ pressed }) => [
              styles.legalLink,
              pressed && styles.btnPressed,
            ]}
          >
            <LifeBuoy color={theme.colors.amber} size={18} strokeWidth={2.2} />
            <Text style={styles.legalLinkText}>Support & FAQ</Text>
            <ExternalLink color={theme.colors.textFaint} size={15} strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── Footer ── */}
        <Text style={styles.footer}>{randomSignOff()}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.lg,
  },

  // ── Header ──
  logo: {
    width: 88,
    height: 88,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.amberSoft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.amber,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  tagline: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    letterSpacing: 0.2,
  },

  // ── PRO Status ──
  proStatusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.blue,
    marginBottom: theme.spacing.xl,
  },
  proStatusActive: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 10,
  },
  proStatusDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.green,
  },
  proStatusActiveText: {
    color: theme.colors.green,
    fontSize: 16,
    fontWeight: "800",
  },
  proStatusLocked: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 10,
  },
  proStatusLockedText: {
    color: theme.colors.blue,
    fontSize: 16,
    fontWeight: "800",
  },
  proStatusNote: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  proStatusBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: theme.colors.blue,
    borderRadius: theme.radius.sm,
    paddingVertical: 13,
    paddingHorizontal: theme.spacing.md,
    marginTop: 4,
  },
  proStatusBtnText: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "900",
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  resetBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingVertical: 11,
    paddingHorizontal: theme.spacing.md,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.red,
  },
  resetBtnText: {
    color: theme.colors.red,
    fontSize: 14,
    fontWeight: "800",
  },

  // ── Sections ──
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  // ── Body text ──
  body: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  bodySpaced: {
    marginBottom: 12,
  },
  label: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Role list ──
  roleList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
    gap: 10,
  },
  roleItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  roleText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Feature list ──
  featureList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  featureItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  featureText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Important Note ──
  noteCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginBottom: theme.spacing.xl,
  },
  noteText: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },

  // ── Mission ──
  missionCard: {
    backgroundColor: theme.colors.redSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.red,
    marginBottom: theme.spacing.xl,
  },
  missionQuote: {
    color: theme.colors.red,
    fontSize: 16,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 24,
  },
  missionCta: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  missionCtaText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "700",
  },
  missionFinal: {
    color: theme.colors.red,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },

  // ── Vision ──
  visionCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginBottom: theme.spacing.xl,
  },
  visionQuote: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 24,
  },
  visionFinal: {
    color: theme.colors.amber,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },

  // ── Legal & Support ──
  legalSection: {
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  legalLink: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  legalLinkText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Footer ──
  footer: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
});
