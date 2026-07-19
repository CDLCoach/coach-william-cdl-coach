import { Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Coffee,
  Flag,
  Info,
  Lightbulb,
  RotateCcw,
  type LucideIcon,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  buildDebrief,
  finalCompletionBody,
  finalCompletionButton,
  finalCompletionClosing,
  finalCompletionLines,
  finalCompletionRememberLines,
  finalCompletionRememberTitle,
  finalCompletionSign,
  finalCompletionSub,
  finalCompletionTitle,
  getSectionCelebration,
  randomCoffeeBreak,
  randomCornerMessage,
  randomSignOff,
  randomTruckerWisdom,
  sectionCompletionBody,
  sectionCompletionTitle,
  standardPhrases,
} from "@/constants/coach-william";
import { useCdlNumbersProgress } from "@/constants/cdl-numbers-progress";
import { isProSection, useProAccess } from "@/constants/pro-access";
import {
  guidedFlow,
  guidedSection,
  inspectionSections,
  nextGuidedSection,
  type ChecklistItem,
  type InspectionSubSection,
} from "@/constants/inspections";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function InspectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isPro, loaded: proLoaded } = useProAccess();
  const section = useMemo(
    () => inspectionSections.find((s) => s.id === id),
    [id],
  );

  type Tab = "learn" | "remember" | "perform";
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [expandedWhy, setExpandedWhy] = useState<Record<number, boolean>>({});
  const [expandedSectionWhy, setExpandedSectionWhy] = useState<
    Record<number, boolean>
  >({});
  const [shownSectionCompletions, setShownSectionCompletions] = useState<
    Set<number>
  >(new Set());

  const toggle = useCallback((index: number) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const toggleWhy = useCallback((index: number) => {
    setExpandedWhy((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const [coffeeBreakVisible, setCoffeeBreakVisible] = useState(false);
  const [truckerWisdom] = useState(() => randomTruckerWisdom());
  const [coffeeBreakMsg] = useState(() => randomCoffeeBreak());
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);

  const router = useRouter();

  const rotatePhrase = useCallback(() => {
    setPhraseIndex((prev) => (prev + 1) % standardPhrases.length);
  }, []);

  // Compute flat item list (from subsections if chunked, otherwise from items).
  // All derived values must safely handle section being undefined so that hook
  // ordering stays identical across renders (Rules of Hooks).
  const subs = section?.subsections;
  const flatItems = subs ? subs.flatMap((s) => s.items) : section?.items ?? [];
  const total = flatItems.length;
  const doneCount = flatItems.filter((_, i) => checked[i]).length;
  const progress = total > 0 ? doneCount / total : 0;
  const allDone = total > 0 && doneCount === total;
  const halfDone = doneCount >= Math.ceil(total / 2) && !allDone;
  const isPerform = activeTab === "perform";

  // The trailer is the final inspection section — completing it finishes the entire
  // Outside Pre-Trip Inspection. Show the full-screen graduation once.
  const sectionId = section?.id ?? "";
  const isFinalSection = sectionId === "trailer";
  const nextSection = useMemo(() => nextGuidedSection(sectionId), [sectionId]);
  const currentGuided = useMemo(() => guidedSection(sectionId), [sectionId]);

  // Pick the random coach messages once per section so they don't re-randomize
  // on every render (e.g. when checking items, expanding cards, toggling tabs).
  const cornerMsg = useMemo(() => randomCornerMessage(), [id]);
  const signOff = useMemo(() => randomSignOff(), [id]);
  const debrief = useMemo(
    () => buildDebrief({ sectionId, completedCount: doneCount, totalCount: total }),
    [sectionId, doneCount, total],
  );

  // expo-router reuses this component instance when navigating between dynamic
  // [id] routes via router.replace. Without resetting, the previous section's
  // checked items and completion card bleed into the next section.
  useEffect(() => {
    setChecked({});
    setExpandedWhy({});
    setExpandedSectionWhy({});
    setShownSectionCompletions(new Set());
    setShowFinalCelebration(false);
    setCoffeeBreakVisible(false);
    setActiveTab("learn");
  }, [id]);

  useEffect(() => {
    if (isFinalSection && allDone && total > 0 && !showFinalCelebration) {
      setShowFinalCelebration(true);
    }
  }, [isFinalSection, allDone, total, showFinalCelebration]);

  // Redirect FREE users who land on a PRO-locked inspection section directly.
  // PRO sections remain visible on Home (with a lock icon) but the lesson
  // itself is only accessible after unlocking Coach William PRO.
  useEffect(() => {
    if (proLoaded && id && isProSection(id) && !isPro) {
      router.replace(`/pro?returnTo=${encodeURIComponent(`/inspection/${id}`)}` as never);
    }
  }, [proLoaded, id, isPro, router]);

  const goToNextSection = useCallback(() => {
    // Clear completion state BEFORE navigating so nothing from this section
    // bleeds into the next one.
    setShowFinalCelebration(false);
    setChecked({});
    setExpandedWhy({});
    setExpandedSectionWhy({});
    setShownSectionCompletions(new Set());
    setActiveTab("learn");
    if (nextSection) {
      // If the next guided section is PRO-locked and the user is FREE,
      // send them to the PRO upgrade screen instead of the lesson.
      if (isProSection(nextSection.id) && !isPro) {
        router.push(`/pro?returnTo=${encodeURIComponent(nextSection.route)}` as never);
        return;
      }
      router.replace(nextSection.route as never);
    } else {
      // Pop back to the existing Home at the stack root instead of replacing
      // with "/" — router.replace("/") would create a duplicate Home entry
      // in the navigation stack, causing one extra mounted Home screen per
      // walkthrough. After multiple walkthroughs this accumulates into
      // significant memory pressure and progressive slowdown/freezing.
      router.back();
    }
  }, [nextSection, router]);

  // The first guided section uses "Begin …"; everything else uses "Continue to …"
  const guidedFlowFirstId = guidedFlow[0]?.id ?? "in-cab";
  const navButtonLabel = useMemo(() => {
    const nextTitle = nextSection?.title ?? "Practice Test";
    return sectionId === guidedFlowFirstId
      ? `Begin ${nextTitle}`
      : `Continue to ${nextTitle}`;
  }, [nextSection, sectionId, guidedFlowFirstId]);

  // ── Early return AFTER all hooks (Rules of Hooks safe) ──
  if (!section) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Section not found.</Text>
      </View>
    );
  }

  const Icon = section.icon;

  // Section-completion helper: returns index of a just-completed subsection, or -1.
  // (Early-return guard already ensures section/subs are defined here.)
  const justCompletedSection: number = (() => {
    if (!subs) return -1;
    let globalIdx = 0;
    for (let si = 0; si < subs.length; si++) {
      const secItems = subs[si].items;
      const allChecked = secItems.every((_, li) => checked[globalIdx + li]);
      if (allChecked && !shownSectionCompletions.has(si)) {
        return si;
      }
      globalIdx += secItems.length;
    }
    return -1;
  })();

  const markSectionCompletionShown = (si: number) => {
    setShownSectionCompletions((prev) => new Set(prev).add(si));
  };

  // ── CDL Numbers custom view ──
  if (section.id === "cdl-numbers" && subs && subs.length > 0) {
    return (
      <CDLNumbersView
        title={section.title}
        subtitle={section.subtitle}
        icon={Icon}
        subsection={subs[0]}
        insets={insets}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: section.title }} />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon color={theme.colors.amber} size={26} strokeWidth={2.2} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{section.title}</Text>
            <Text style={styles.heroSubtitle}>{section.subtitle}</Text>
          </View>
        </View>

        {/* ── Interactive Learn → Remember → Perform tabs ── */}
        <View style={styles.frameworkRow}>
          <Pressable
            onPress={() => setActiveTab("learn")}
            style={({ pressed }) => [
              styles.frameworkTab,
              activeTab === "learn" && styles.frameworkTabActive,
              pressed && styles.frameworkTabPressed,
            ]}
          >
            <Text
              style={[
                styles.frameworkNum,
                activeTab === "learn" && styles.frameworkNumActive,
              ]}
            >
              1
            </Text>
            <Text
              style={[
                styles.frameworkLabel,
                activeTab === "learn" && styles.frameworkLabelActive,
              ]}
            >
              📖 Learn
            </Text>
          </Pressable>
          <View style={styles.frameworkArrow}>
            <View style={styles.frameworkLine} />
          </View>
          <Pressable
            onPress={() => setActiveTab("remember")}
            style={({ pressed }) => [
              styles.frameworkTab,
              activeTab === "remember" && styles.frameworkTabActive,
              pressed && styles.frameworkTabPressed,
            ]}
          >
            <Text
              style={[
                styles.frameworkNum,
                activeTab === "remember" && styles.frameworkNumActive,
              ]}
            >
              2
            </Text>
            <Text
              style={[
                styles.frameworkLabel,
                activeTab === "remember" && styles.frameworkLabelActive,
              ]}
            >
              🧠 Remember
            </Text>
          </Pressable>
          <View style={styles.frameworkArrow}>
            <View style={styles.frameworkLine} />
          </View>
          <Pressable
            onPress={() => setActiveTab("perform")}
            style={({ pressed }) => [
              styles.frameworkTab,
              activeTab === "perform" && styles.frameworkTabActive,
              pressed && styles.frameworkTabPressed,
            ]}
          >
            <Text
              style={[
                styles.frameworkNum,
                activeTab === "perform" && styles.frameworkNumActive,
              ]}
            >
              3
            </Text>
            <Text
              style={[
                styles.frameworkLabel,
                activeTab === "perform" && styles.frameworkLabelActive,
              ]}
            >
              🎤 Perform
            </Text>
          </Pressable>
        </View>

        {/* ── Learn tab banner ── */}
        {activeTab === "learn" && (
          <View style={styles.tabBanner}>
            <Brain color={theme.colors.blue} size={16} strokeWidth={2.2} />
            <Text style={styles.tabBannerText}>
              Study the inspection items. When you're ready, move to Remember then Perform.
            </Text>
          </View>
        )}

        {/* ── Remember tab banner ── */}
        {activeTab === "remember" && (
          <View style={styles.tabBanner}>
            <Lightbulb color={theme.colors.amber} size={16} strokeWidth={2.2} />
            <Text style={[styles.tabBannerText, { color: theme.colors.amber }]}>
              Recall the memory tools and acronyms. Tap the phrase card to rotate.
            </Text>
          </View>
        )}

        {/* ── Perform tab banner ── */}
        {isPerform && (
          <View style={styles.tabBanner}>
            <Check color={theme.colors.green} size={16} strokeWidth={2.2} />
            <Text style={[styles.tabBannerText, { color: theme.colors.green }]}>
              Check off each item as you complete the inspection. Say it out loud.
            </Text>
          </View>
        )}

        {isPerform && (
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>Checklist progress</Text>
              <Text style={styles.progressCount}>
                {doneCount} / {total}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
        )}

        {/* ── Memory Tool Quick Reference (Learn & Remember only) ── */}
        {!isPerform && (
          <Pressable
            onPress={rotatePhrase}
            style={({ pressed }) => [
              styles.memoryToolQuickRef,
              pressed && styles.itemPressed,
            ]}
          >
            <View style={styles.memoryToolQuickRefHeader}>
              <Lightbulb color={theme.colors.blue} size={14} strokeWidth={2.2} />
              <Text style={styles.memoryToolQuickRefLabel}>Memory Tool</Text>
            </View>
            <View style={styles.memoryToolQuickRefAcronyms}>
              <View style={styles.memoryToolQuickRefChip}>
                <Text style={styles.memoryToolQuickRefChipText}>PMS</Text>
              </View>
              <Text style={styles.memoryToolQuickRefSep}>·</Text>
              <View style={styles.memoryToolQuickRefChip}>
                <Text style={styles.memoryToolQuickRefChipText}>BCD</Text>
              </View>
              <Text style={styles.memoryToolQuickRefSep}>·</Text>
              <View style={styles.memoryToolQuickRefChip}>
                <Text style={styles.memoryToolQuickRefChipText}>CCF</Text>
              </View>
            </View>
            <Text style={styles.memoryToolQuickRefPhrase}>
              "{standardPhrases[phraseIndex]}"
            </Text>
            <Text style={styles.memoryToolQuickRefHint}>Tap to rotate phrase</Text>
          </Pressable>
        )}

        {/* ── Trucker Wisdom ── */}
        <View style={styles.wisdomCard}>
          <Info color={theme.colors.amber} size={14} strokeWidth={2.2} />
          <Text style={styles.wisdomText}>"{truckerWisdom}"</Text>
        </View>

        {/* ── Subsections (chunked learning) ── */}
        {subs ? (
          <View style={styles.list}>
            {subs.map((sub, si) => {
              const subStart = subs
                .slice(0, si)
                .reduce((acc, s) => acc + s.items.length, 0);
              const subChecked = sub.items.filter(
                (_, li) => checked[subStart + li],
              ).length;
              const subTotal = sub.items.length;
              const subComplete = subChecked === subTotal;
              const isSectionWhyExpanded = !!expandedSectionWhy[si];

              return (
                <View key={sub.id} style={styles.subSectionWrapper}>
                  {/* ── Section header ── */}
                  <View style={styles.subSectionHeader}>
                    <View style={styles.subSectionBadge}>
                      <Text style={styles.subSectionBadgeText}>
                        Section {si + 1}
                      </Text>
                    </View>
                    <View style={styles.subSectionTitleRow}>
                      <Text style={styles.subSectionTitle}>{sub.title}</Text>
                      {isPerform && subComplete && (
                        <Check
                          color={theme.colors.green}
                          size={18}
                          strokeWidth={3}
                        />
                      )}
                    </View>
                    {isPerform && (
                      <Text style={styles.subSectionProgress}>
                        {subChecked} / {subTotal} complete
                      </Text>
                    )}
                  </View>

                  {/* ── Section Coach Intro ── */}
                  {sub.sectionCoachIntro && (
                    <View style={styles.sectionCoachIntroCard}>
                      <Text style={styles.sectionCoachIntroLabel}>
                        Coach William Says:
                      </Text>
                      <Text style={styles.sectionCoachIntroText}>
                        "{sub.sectionCoachIntro}"
                      </Text>
                    </View>
                  )}

                  {/* ── Memory Tool (COPS-style acronym) ── */}
                  {sub.memoryToolAcronym && (
                    <View style={styles.memoryToolCard}>
                      <View style={styles.memoryToolHeader}>
                        <Brain
                          color={theme.colors.blue}
                          size={16}
                          strokeWidth={2.2}
                        />
                        <Text style={styles.memoryToolLabel}>
                          Memory Tool
                        </Text>
                      </View>
                      <Text style={styles.memoryToolRemember}>
                        Remember:
                      </Text>
                      <Text style={styles.memoryToolAcronym}>
                        {sub.memoryToolAcronym}
                      </Text>
                      {sub.memoryToolItems && (
                        <View style={styles.memoryToolItems}>
                          {sub.memoryToolItems.map((mi) => (
                            <View key={mi.id} style={styles.memoryToolItem}>
                              <Text style={styles.memoryToolLetter}>
                                {mi.letter}
                              </Text>
                              <Text style={styles.memoryToolEquals}>=</Text>
                              <Text style={styles.memoryToolItemLabel}>
                                {mi.label}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {sub.memoryToolCoachTip && (
                        <View style={styles.memoryToolCoach}>
                          <Text style={styles.memoryToolCoachLabel}>
                            Coach William Says:
                          </Text>
                          <Text style={styles.memoryToolCoachText}>
                            "{sub.memoryToolCoachTip}"
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* ── Section Why It Matters ── */}
                  <Pressable
                    onPress={() =>
                      setExpandedSectionWhy((prev) => ({
                        ...prev,
                        [si]: !prev[si],
                      }))
                    }
                    style={({ pressed }) => [
                      styles.whyButton,
                      pressed && styles.whyButtonPressed,
                    ]}
                  >
                    <Text style={styles.whyButtonLabel}>Why It Matters</Text>
                    {isSectionWhyExpanded ? (
                      <ChevronUp
                        color={theme.colors.amber}
                        size={16}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <ChevronDown
                        color={theme.colors.amber}
                        size={16}
                        strokeWidth={2.5}
                      />
                    )}
                  </Pressable>

                  {isSectionWhyExpanded && (
                    <View style={styles.whyCard}>
                      <View style={styles.whyCardDot} />
                      <Text style={styles.whyCardText}>
                        {sub.whyItMatters}
                      </Text>
                    </View>
                  )}

                  {/* ── Section items ── */}
                  {sub.items.map((item, li) => {
                    const globalIdx = subStart + li;
                    const isChecked = !!checked[globalIdx];
                    const isWhyExpanded = !!expandedWhy[globalIdx];
                    return (
                      <InspectionItemRow
                        key={item.id}
                        item={item}
                        index={globalIdx}
                        isChecked={isChecked}
                        isWhyExpanded={isWhyExpanded}
                        isPerform={isPerform}
                        onToggle={toggle}
                        onToggleWhy={toggleWhy}
                      />
                    );
                  })}

                  {/* ── Section completion card (Perform only) ──
                      Hidden when the ENTIRE section is complete so it doesn't
                      duplicate the guided completion card + smart nav button. ── */}
                  {isPerform && subComplete && justCompletedSection === si && !allDone && (
                    <View style={styles.sectionDoneCard}>
                      <View style={styles.sectionDoneIcon}>
                        <Coffee
                          color={theme.colors.background}
                          size={20}
                          strokeWidth={2.2}
                        />
                      </View>
                      <Text style={styles.sectionDoneTitle}>
                        {sub.completionTitleOverride ?? sectionCompletionTitle}
                      </Text>
                      <Text style={styles.sectionDoneBody}>
                        {sub.completionBodyOverride ?? sectionCompletionBody}
                      </Text>
                      <Text style={styles.sectionDoneCelebration}>
                        {sub.completionCoachMessageOverride ??
                          getSectionCelebration()}
                      </Text>
                      <Pressable
                        onPress={() => markSectionCompletionShown(si)}
                        style={({ pressed }) => [
                          styles.sectionDoneDismiss,
                          pressed && styles.itemPressed,
                        ]}
                      >
                        <Text style={styles.sectionDoneDismissText}>
                          Continue
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          /* ── Flat list (sections without subsections) ── */
          <View style={styles.list}>
            {section.items.map((item, index) => {
              const isChecked = !!checked[index];
              const isWhyExpanded = !!expandedWhy[index];
              const prevItem = index > 0 ? section.items[index - 1] : null;
              const showGroupHeader =
                !!item.group && (!prevItem || prevItem.group !== item.group);
              return (
                <InspectionItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  isChecked={isChecked}
                  isWhyExpanded={isWhyExpanded}
                  isPerform={isPerform}
                  onToggle={toggle}
                  onToggleWhy={toggleWhy}
                  groupHeader={showGroupHeader ? item.group : undefined}
                />
              );
            })}
          </View>
        )}

        {/* ── Final Examiner Statement (instructional reminder) ── */}
        {section.finalStatement && (
          <View style={styles.finalStatementCard}>
            <View style={styles.finalStatementHeader}>
              <Flag
                color={theme.colors.background}
                size={16}
                strokeWidth={2.4}
              />
              <Text style={styles.finalStatementTitle}>
                {section.finalStatement.title}
              </Text>
            </View>
            <Text style={styles.finalStatementText}>
              "{section.finalStatement.statement}"
            </Text>
            <View style={styles.finalStatementNoteBox}>
              <Text style={styles.finalStatementNoteText}>
                {section.finalStatement.note}
              </Text>
            </View>
          </View>
        )}

        {/* ── Tip, Coffee Break, Corner, Debrief, Sign-off (Perform only) ── */}
        {isPerform && (
          <>
            <Text style={styles.tip}>
              Say it out loud — use PMS for solid parts, CCF for hoses and wires,
              BCD for condition, and always listen for leaks.
            </Text>

            {halfDone && !coffeeBreakVisible && (
              <Pressable
                onPress={() => setCoffeeBreakVisible(true)}
                style={({ pressed }) => [
                  styles.coffeeBreakCard,
                  pressed && styles.itemPressed,
                ]}
              >
                <View style={styles.coffeeBreakIcon}>
                  <Coffee color={theme.colors.amber} size={24} strokeWidth={2} />
                </View>
                <View style={styles.coffeeBreakContent}>
                  <Text style={styles.coffeeBreakBadge}>
                    Coffee Break with Coach William
                  </Text>
                  <Text style={styles.coffeeBreakText}>
                    "{coffeeBreakMsg}"
                  </Text>
                </View>
              </Pressable>
            )}

            {allDone && !isFinalSection && (
              <View style={styles.guidedCompletionCard}>
                <View style={styles.guidedProgressRow}>
                  <Check
                    color={theme.colors.green}
                    size={18}
                    strokeWidth={3}
                  />
                  <Text style={styles.guidedProgressDone}>
                    {currentGuided?.title ?? section.title} Complete
                  </Text>
                </View>
                <View style={styles.guidedNextBox}>
                  <Text style={styles.guidedNextLabel}>Next:</Text>
                  <Text style={styles.guidedNextTitle}>
                    {nextSection?.title ?? "Practice Test"}
                  </Text>
                </View>
                <Pressable
                  onPress={goToNextSection}
                  style={({ pressed }) => [
                    styles.guidedNavButton,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <Text style={styles.guidedNavButtonText}>
                    {navButtonLabel}
                  </Text>
                  <ArrowRight
                    color={theme.colors.background}
                    size={20}
                    strokeWidth={2.5}
                  />
                </Pressable>
              </View>
            )}

            {allDone && (
              <View style={styles.cornerCard}>
                <View style={styles.cornerHeader}>
                  <Coffee
                    color={theme.colors.amber}
                    size={16}
                    strokeWidth={2.2}
                  />
                  <Text style={styles.cornerBadge}>Coach William's Corner</Text>
                </View>
                <Text style={styles.cornerText}>
                  "{cornerMsg}"
                </Text>
              </View>
            )}

            {allDone && (
              <View style={styles.debriefCard}>
                <View style={styles.debriefHeader}>
                  <Text style={styles.debriefBadge}>
                    Coach William's Debrief
                  </Text>
                </View>
                <Text style={styles.debriefText}>
                  {debrief}
                </Text>
              </View>
            )}

            {!allDone && <Text style={styles.signOffText}>{signOff}</Text>}
          </>
        )}
      </ScrollView>

      {/* ── Final App Completion: Coach William Graduation (full-screen overlay) ── */}
      {showFinalCelebration && isFinalSection && (
        <ScrollView
          style={styles.finalCelebrationOverlay}
          contentContainerStyle={[
            styles.finalCelebrationScrollContent,
            {
              paddingTop: insets.top + 24,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.finalCelebrationCard}>
            <Text style={styles.finalCelebrationTitle}>
              {finalCompletionTitle}
            </Text>
            <Text style={styles.finalCelebrationBody}>
              {finalCompletionBody}
            </Text>
            <Text style={styles.finalCelebrationSub}>
              {finalCompletionSub}
            </Text>
            <View style={styles.finalCelebrationLines}>
              {finalCompletionLines.map((line) => (
                <Text key={line} style={styles.finalCelebrationLine}>
                  {line}
                </Text>
              ))}
            </View>
            <Text style={styles.finalCelebrationClosing}>
              {finalCompletionClosing}
            </Text>
            <Text style={styles.finalCelebrationRememberTitle}>
              {finalCompletionRememberTitle}
            </Text>
            <View style={styles.finalCelebrationRememberLines}>
              {finalCompletionRememberLines.map((line) => (
                <Text
                  key={line}
                  style={styles.finalCelebrationRememberLine}
                >
                  {line}
                </Text>
              ))}
            </View>
            <Text style={styles.finalCelebrationSign}>
              {finalCompletionSign}
            </Text>
            <Pressable
              onPress={() => {
                // Clear completion flags before leaving so the graduation
                // overlay cannot reappear on Home or linger.
                setShowFinalCelebration(false);
                setChecked({});
                setShownSectionCompletions(new Set());
                router.back();
              }}
              style={({ pressed }) => [
                styles.finalCelebrationButton,
                pressed && styles.itemPressed,
              ]}
            >
              <Text style={styles.finalCelebrationButtonText}>
                {finalCompletionButton}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

// ────────────────────────────────────────────────────────────
// Memoized Inspection Item Row — only re-renders when its own
// checked/expanded state changes, NOT when a sibling item toggles.
// This prevents the parent from cascading a full re-render of every
// row on every checkmark (the cause of the Driver Side Engine
// Compartment freeze — it has 21 items, so each check re-rendered
// all 21 rows, then the encouragement effect triggered a second
// full re-render of all 21 rows).
// ────────────────────────────────────────────────────────────

type InspectionItemRowProps = {
  item: ChecklistItem;
  index: number;
  isChecked: boolean;
  isWhyExpanded: boolean;
  isPerform: boolean;
  onToggle: (index: number) => void;
  onToggleWhy: (index: number) => void;
  /** Optional group header label to render above this row (flat lists). */
  groupHeader?: string;
};

const InspectionItemRow = React.memo(function InspectionItemRow({
  item,
  index,
  isChecked,
  isWhyExpanded,
  isPerform,
  onToggle,
  onToggleWhy,
  groupHeader,
}: InspectionItemRowProps) {
  return (
    <View style={styles.itemWrapper}>
      {groupHeader ? (
        <View style={styles.flatListGroupHeader}>
          <Text style={styles.flatListGroupTitle}>{groupHeader}</Text>
        </View>
      ) : null}
      {isPerform ? (
        <Pressable
          onPress={() => onToggle(index)}
          style={({ pressed }) => [
            styles.item,
            isChecked && styles.itemChecked,
            pressed && styles.itemPressed,
          ]}
          testID={`item-${index}`}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxOn]}>
            {isChecked ? (
              <Check
                color={theme.colors.background}
                size={18}
                strokeWidth={3}
              />
            ) : (
              <Circle color={theme.colors.textFaint} size={18} />
            )}
          </View>
          <View style={styles.itemText}>
            <Text
              style={[styles.itemTitle, isChecked && styles.itemTitleChecked]}
            >
              {item.title}
            </Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.itemReadOnly}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitleR}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
          </View>
        </View>
      )}

      {/* ── Item Why It Matters ── */}
      <Pressable
        onPress={() => onToggleWhy(index)}
        style={({ pressed }) => [
          styles.whyButton,
          pressed && styles.whyButtonPressed,
        ]}
      >
        <Text style={styles.whyButtonLabel}>Why It Matters</Text>
        {isWhyExpanded ? (
          <ChevronUp
            color={theme.colors.amber}
            size={16}
            strokeWidth={2.5}
          />
        ) : (
          <ChevronDown
            color={theme.colors.amber}
            size={16}
            strokeWidth={2.5}
          />
        )}
      </Pressable>

      {isWhyExpanded && (
        <View style={styles.whyCard}>
          <View style={styles.whyCardDot} />
          <Text style={styles.whyCardText}>{item.whyItMatters}</Text>
        </View>
      )}
    </View>
  );
});

// ────────────────────────────────────────────────────────────
// CDL Numbers to Remember — custom view with Progress Checkmarks
// ────────────────────────────────────────────────────────────

type CDLNumbersViewProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  subsection: InspectionSubSection;
  insets: { top: number; bottom: number };
};

function CDLNumbersView({
  title,
  subtitle,
  icon: Icon,
  subsection,
  insets,
}: CDLNumbersViewProps) {
  const { mastered, toggle, reset, loaded } = useCdlNumbersProgress();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [truckerWisdom] = useState(() => randomTruckerWisdom());
  const [expandedWhy, setExpandedWhy] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const rotatePhrase = useCallback(() => {
    setPhraseIndex((prev) => (prev + 1) % standardPhrases.length);
  }, []);

  const toggleWhy = useCallback(() => {
    setExpandedWhy((prev) => !prev);
  }, []);

  const numbers = subsection.memoryToolItems ?? [];
  const masteredCount = numbers.filter((n) => !!mastered[n.id]).length;
  const total = numbers.length;
  const progress = total > 0 ? masteredCount / total : 0;
  const allMastered = masteredCount === total && total > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon color={theme.colors.amber} size={26} strokeWidth={2.2} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* ── Progress Indicator ── */}
        {loaded && (
          <View style={styles.cdlProgressCard}>
            <View style={styles.cdlProgressTop}>
              <Text style={styles.cdlProgressLabel}>Progress</Text>
              <Text style={styles.cdlProgressCount}>
                {masteredCount} of {total} Numbers Mastered
              </Text>
            </View>
            <View style={styles.cdlProgressTrack}>
              <View
                style={[
                  styles.cdlProgressFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
            {allMastered && (
              <View style={styles.cdlAllMasteredBanner}>
                <Text style={styles.cdlAllMasteredText}>
                  🏆 All numbers mastered — you're ready, Hero!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Trucker Wisdom ── */}
        <View style={styles.wisdomCard}>
          <Info color={theme.colors.amber} size={14} strokeWidth={2.2} />
          <Text style={styles.wisdomText}>"{truckerWisdom}"</Text>
        </View>

        {/* ── Memory Tool Quick Reference ── */}
        <Pressable
          onPress={rotatePhrase}
          style={({ pressed }) => [
            styles.memoryToolQuickRef,
            pressed && styles.itemPressed,
          ]}
        >
          <View style={styles.memoryToolQuickRefHeader}>
            <Lightbulb color={theme.colors.blue} size={14} strokeWidth={2.2} />
            <Text style={styles.memoryToolQuickRefLabel}>
              Memory Tool
            </Text>
          </View>
          <View style={styles.memoryToolQuickRefAcronyms}>
            <View style={styles.memoryToolQuickRefChip}>
              <Text style={styles.memoryToolQuickRefChipText}>PMS</Text>
            </View>
            <Text style={styles.memoryToolQuickRefSep}>·</Text>
            <View style={styles.memoryToolQuickRefChip}>
              <Text style={styles.memoryToolQuickRefChipText}>BCD</Text>
            </View>
            <Text style={styles.memoryToolQuickRefSep}>·</Text>
            <View style={styles.memoryToolQuickRefChip}>
              <Text style={styles.memoryToolQuickRefChipText}>CCF</Text>
            </View>
          </View>
          <Text style={styles.memoryToolQuickRefPhrase}>
            "{standardPhrases[phraseIndex]}"
          </Text>
          <Text style={styles.memoryToolQuickRefHint}>Tap to rotate phrase</Text>
        </Pressable>

        {/* ── Section Coach Intro (first Coach William Says) ── */}
        {subsection.sectionCoachIntro && (
          <View style={styles.sectionCoachIntroCard}>
            <Text style={styles.sectionCoachIntroLabel}>
              Coach William Says:
            </Text>
            <Text style={styles.sectionCoachIntroText}>
              "{subsection.sectionCoachIntro}"
            </Text>
          </View>
        )}

        {/* ── Memory Tool Card ── */}
        {subsection.memoryToolAcronym && (
          <View style={styles.memoryToolCard}>
            <View style={styles.memoryToolHeader}>
              <Brain
                color={theme.colors.blue}
                size={16}
                strokeWidth={2.2}
              />
              <Text style={styles.memoryToolLabel}>Memory Tool</Text>
            </View>
            <Text style={styles.memoryToolRemember}>Remember:</Text>
            <Text style={styles.memoryToolAcronym}>
              {subsection.memoryToolAcronym}
            </Text>
            {numbers.length > 0 && (
              <View style={styles.memoryToolItems}>
                {numbers.map((mi) => {
                  const isMastered = !!mastered[mi.id];
                  return (
                    <Pressable
                      key={mi.id}
                      onPress={() => toggle(mi.id)}
                      style={({ pressed }) => [
                        styles.cdlNumberRow,
                        isMastered && styles.cdlNumberRowMastered,
                        pressed && styles.itemPressed,
                      ]}
                      testID={`cdl-number-${mi.id}`}
                    >
                      <View style={styles.cdlNumberInfo}>
                        <Text style={styles.cdlNumberLabel}>
                          {mi.letter}
                        </Text>
                        <Text style={styles.cdlNumberEquals}>=</Text>
                        <Text style={styles.cdlNumberValue}>
                          {mi.label}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.cdlCheckmark,
                          isMastered && styles.cdlCheckmarkOn,
                        ]}
                      >
                        {isMastered ? (
                          <Check
                            color={theme.colors.background}
                            size={18}
                            strokeWidth={3}
                          />
                        ) : (
                          <Circle
                            color={theme.colors.textFaint}
                            size={18}
                          />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
            {subsection.memoryToolCoachTip && (
              <View style={styles.memoryToolCoach}>
                <Text style={styles.memoryToolCoachLabel}>
                  Coach William Says:
                </Text>
                <Text style={styles.memoryToolCoachText}>
                  "{subsection.memoryToolCoachTip}"
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Why It Matters ── */}
        <Pressable
          onPress={toggleWhy}
          style={({ pressed }) => [
            styles.whyButton,
            pressed && styles.whyButtonPressed,
          ]}
        >
          <Text style={styles.whyButtonLabel}>Why It Matters</Text>
          {expandedWhy ? (
            <ChevronUp
              color={theme.colors.amber}
              size={16}
              strokeWidth={2.5}
            />
          ) : (
            <ChevronDown
              color={theme.colors.amber}
              size={16}
              strokeWidth={2.5}
            />
          )}
        </Pressable>

        {expandedWhy && (
          <View style={styles.whyCard}>
            <View style={styles.whyCardDot} />
            <Text style={styles.whyCardText}>
              {subsection.whyItMatters}
            </Text>
          </View>
        )}

        {/* ── Completion message ── */}
        {allMastered && (
          <View style={styles.cdlCompletionCard}>
            <Text style={styles.cdlCompletionTitle}>
              {subsection.completionTitleOverride ?? sectionCompletionTitle}
            </Text>
            <Text style={styles.cdlCompletionBody}>
              {subsection.completionBodyOverride ?? sectionCompletionBody}
            </Text>
            <Text style={styles.cdlCompletionCelebration}>
              {subsection.completionCoachMessageOverride ??
                getSectionCelebration()}
            </Text>
          </View>
        )}

        {/* ── Reset Progress ── */}
        {loaded && masteredCount > 0 && (
          <View style={styles.cdlResetContainer}>
            {showResetConfirm ? (
              <View style={styles.cdlResetConfirmRow}>
                <Text style={styles.cdlResetConfirmText}>
                  Clear all {masteredCount} checkmark{masteredCount > 1 ? "s" : ""}?
                </Text>
                <View style={styles.cdlResetConfirmBtns}>
                  <Pressable
                    onPress={() => {
                      reset();
                      setShowResetConfirm(false);
                    }}
                    style={({ pressed }) => [
                      styles.cdlResetYesBtn,
                      pressed && styles.itemPressed,
                    ]}
                  >
                    <Text style={styles.cdlResetYesText}>Reset</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setShowResetConfirm(false)}
                    style={({ pressed }) => [
                      styles.cdlResetNoBtn,
                      pressed && styles.itemPressed,
                    ]}
                  >
                    <Text style={styles.cdlResetNoText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setShowResetConfirm(true)}
                style={({ pressed }) => [
                  styles.cdlResetButton,
                  pressed && styles.itemPressed,
                ]}
              >
                <RotateCcw
                  color={theme.colors.textMuted}
                  size={16}
                  strokeWidth={2.2}
                />
                <Text style={styles.cdlResetButtonText}>
                  Reset Progress
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ── Sign-off ── */}
        <Text style={styles.signOffText}>{randomSignOff()}</Text>
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
    padding: theme.spacing.md,
  },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  missingText: {
    color: theme.colors.textMuted,
    fontSize: 16,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.amberSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "900" as const,
  },
  heroSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    marginTop: 2,
  },

  // ── Tab banner ──
  tabBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  tabBannerText: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "600" as const,
    flex: 1,
    lineHeight: 18,
  },

  // ── Interactive Learn → Remember → Perform tabs ──
  frameworkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  frameworkTab: {
    alignItems: "center" as const,
    gap: 2,
    flex: 1,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  frameworkTabActive: {
    backgroundColor: theme.colors.amberSoft,
  },
  frameworkTabPressed: {
    opacity: 0.7,
  },
  frameworkStep: {
    // kept for backward compat with air-brake.tsx shared styles
    alignItems: "center" as const,
    gap: 2,
    flex: 1,
  },
  frameworkStepActive: {
    alignItems: "center" as const,
    gap: 2,
    flex: 1,
  },
  frameworkNum: {
    color: theme.colors.textFaint,
    fontSize: 18,
    fontWeight: "900" as const,
    width: 30,
    height: 30,
    lineHeight: 30,
    textAlign: "center" as const,
    borderRadius: 15,
    backgroundColor: theme.colors.surfaceRaised,
    overflow: "hidden" as const,
  },
  frameworkNumActive: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: "900" as const,
    width: 30,
    height: 30,
    lineHeight: 30,
    textAlign: "center" as const,
    borderRadius: 15,
    backgroundColor: theme.colors.amber,
    overflow: "hidden" as const,
  },
  frameworkLabel: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
  },
  frameworkLabelActive: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
  },
  frameworkArrow: {
    width: 24,
    alignItems: "center" as const,
  },
  frameworkLine: {
    width: "100%" as const,
    height: 2,
    backgroundColor: theme.colors.border,
    borderRadius: 1,
  },

  // ── Progress ──
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  progressCount: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "900" as const,
  },
  progressTrack: {
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceRaised,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%" as const,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.amber,
  },

  // ── Trucker Wisdom ──
  wisdomCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
  },
  wisdomText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    flex: 1,
    lineHeight: 20,
  },

  // ── Memory Tool Quick Reference ──
  memoryToolQuickRef: {
    backgroundColor: theme.colors.blueSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.blue,
    marginBottom: theme.spacing.sm,
    alignItems: "center" as const,
  },
  memoryToolQuickRefHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  memoryToolQuickRefLabel: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  memoryToolQuickRefAcronyms: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  memoryToolQuickRefChip: {
    backgroundColor: theme.colors.blue,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  memoryToolQuickRefChipText: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "900" as const,
    letterSpacing: 1,
  },
  memoryToolQuickRefSep: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  memoryToolQuickRefPhrase: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 6,
  },
  memoryToolQuickRefHint: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "600" as const,
    opacity: 0.6,
  },

  // ── Subsection layout ──
  subSectionWrapper: {
    marginBottom: theme.spacing.lg,
  },
  subSectionHeader: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  subSectionBadge: {
    alignSelf: "flex-start" as const,
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
  },
  subSectionBadgeText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
  },
  subSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subSectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800" as const,
    flex: 1,
  },
  subSectionProgress: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600" as const,
    marginTop: 6,
  },

  // ── Flat-list group header (e.g. "Rear of Trailer") ──
  flatListGroupHeader: {
    alignSelf: "flex-start" as const,
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
  },
  flatListGroupTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  // ── Section completion card ──
  sectionDoneCard: {
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.green,
    marginTop: theme.spacing.sm,
    alignItems: "center" as const,
  },
  sectionDoneIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  sectionDoneTitle: {
    color: theme.colors.green,
    fontSize: 18,
    fontWeight: "900" as const,
    marginBottom: 4,
    textAlign: "center",
  },
  sectionDoneBody: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "600" as const,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  sectionDoneCelebration: {
    color: theme.colors.green,
    fontSize: 17,
    fontWeight: "800" as const,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 14,
    marginTop: 4,
  },
  sectionDoneDismiss: {
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  sectionDoneDismissText: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "800" as const,
  },

  // ── Checklist items ──
  list: {
    gap: 0,
  },
  itemWrapper: {
    marginBottom: theme.spacing.sm,
  },
  item: {
    flexDirection: "row",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemChecked: {
    borderColor: theme.colors.amber,
    backgroundColor: theme.colors.surfaceAlt,
  },
  itemPressed: {
    opacity: 0.75,
  },
  itemReadOnly: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemTitleR: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800" as const,
    marginBottom: 4,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceRaised,
    marginTop: 2,
  },
  checkboxOn: {
    backgroundColor: theme.colors.amber,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800" as const,
    marginBottom: 4,
  },
  itemTitleChecked: {
    color: theme.colors.amber,
  },
  itemDesc: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },

  // ── Why It Matters ──
  whyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    marginTop: -2,
  },
  whyButtonPressed: {
    opacity: 0.7,
  },
  whyButtonLabel: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  whyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginTop: 4,
  },
  whyCardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.amber,
    marginTop: 6,
  },
  whyCardText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "500" as const,
    lineHeight: 21,
    flex: 1,
  },

  // ── Coffee Break ──
  coffeeBreakCard: {
    flexDirection: "row",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.green,
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  coffeeBreakIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.green + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  coffeeBreakContent: {
    flex: 1,
  },
  coffeeBreakBadge: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  coffeeBreakText: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    lineHeight: 20,
  },

  // ── Coach William's Corner ──
  cornerCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginTop: theme.spacing.md,
  },
  cornerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  cornerBadge: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  cornerText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    lineHeight: 23,
  },

  // ── Debrief ──
  debriefCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.blue,
    marginTop: theme.spacing.md,
  },
  debriefHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  debriefBadge: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  debriefText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 23,
  },

  // ── Section Coach Intro ──
  sectionCoachIntroCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginBottom: theme.spacing.sm,
  },
  sectionCoachIntroLabel: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  sectionCoachIntroText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    lineHeight: 22,
  },

  // ── Memory Tool card (COPS-style acronym) ──
  memoryToolCard: {
    backgroundColor: theme.colors.blueSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.blue,
    marginBottom: theme.spacing.sm,
  },
  memoryToolHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  memoryToolLabel: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  memoryToolRemember: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "600" as const,
    marginBottom: 6,
  },
  memoryToolAcronym: {
    color: theme.colors.blue,
    fontSize: 32,
    fontWeight: "900" as const,
    letterSpacing: 4,
    marginBottom: 12,
  },
  memoryToolItems: {
    gap: 6,
    marginBottom: 14,
  },
  memoryToolItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memoryToolLetter: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "900" as const,
    minWidth: 28,
    height: 28,
    lineHeight: 28,
    textAlign: "center",
    borderRadius: 6,
    backgroundColor: theme.colors.blue,
    overflow: "hidden",
    paddingHorizontal: 6,
  },
  memoryToolEquals: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  memoryToolItemLabel: {
    color: theme.colors.blue,
    fontSize: 16,
    fontWeight: "700" as const,
  },
  memoryToolCoach: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.blue + "40",
    paddingTop: 10,
  },
  memoryToolCoachLabel: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  memoryToolCoachText: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    lineHeight: 20,
  },

  // ── Tip / Sign-off ──
  tip: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontStyle: "italic" as const,
    textAlign: "center",
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  signOffText: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontWeight: "700" as const,
    textAlign: "center",
    marginTop: theme.spacing.lg,
  },

  // ── Coach William's Encouragement banner ──
  encouragementBanner: {
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
  encouragementBannerLabel: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  encouragementBannerText: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    lineHeight: 20,
  },

  // ── CDL Numbers custom view ──
  cdlProgressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  cdlProgressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cdlProgressLabel: {
    color: theme.colors.amber,
    fontSize: 16,
    fontWeight: "800" as const,
  },
  cdlProgressCount: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  cdlProgressTrack: {
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceRaised,
    overflow: "hidden",
  },
  cdlProgressFill: {
    height: "100%" as const,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.amber,
  },
  cdlAllMasteredBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
  cdlAllMasteredText: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "800" as const,
    flex: 1,
    textAlign: "center",
  },
  cdlNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.sm,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cdlNumberRowMastered: {
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.greenSoft,
  },
  cdlNumberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  cdlNumberLabel: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "900" as const,
    minWidth: 28,
    height: 28,
    lineHeight: 28,
    textAlign: "center",
    borderRadius: 6,
    backgroundColor: theme.colors.blue,
    overflow: "hidden",
    paddingHorizontal: 6,
  },
  cdlNumberEquals: {
    color: theme.colors.blue,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  cdlNumberValue: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700" as const,
    flex: 1,
  },
  cdlCheckmark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceRaised,
  },
  cdlCheckmarkOn: {
    backgroundColor: theme.colors.green,
  },
  cdlCompletionCard: {
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.green,
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  cdlCompletionTitle: {
    color: theme.colors.green,
    fontSize: 18,
    fontWeight: "900" as const,
    marginBottom: 6,
    textAlign: "center",
  },
  cdlCompletionBody: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "600" as const,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  cdlCompletionCelebration: {
    color: theme.colors.green,
    fontSize: 17,
    fontWeight: "800" as const,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 6,
    marginTop: 4,
  },
  cdlResetContainer: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  cdlResetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cdlResetButtonText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  cdlResetConfirmRow: {
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: "100%" as const,
  },
  cdlResetConfirmText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700" as const,
    textAlign: "center",
  },
  cdlResetConfirmBtns: {
    flexDirection: "row",
    gap: 12,
  },
  cdlResetYesBtn: {
    backgroundColor: theme.colors.red,
    borderRadius: theme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cdlResetYesText: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "800" as const,
  },
  cdlResetNoBtn: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cdlResetNoText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800" as const,
  },

  // ── Final Examiner Statement callout ──
  finalStatementCard: {
    backgroundColor: theme.colors.blue,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.amber,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  finalStatementHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  finalStatementTitle: {
    color: theme.colors.background,
    fontSize: 17,
    fontWeight: "900" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    flex: 1,
  },
  finalStatementText: {
    color: theme.colors.white,
    fontSize: 19,
    fontWeight: "800" as const,
    fontStyle: "italic" as const,
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 14,
  },
  finalStatementNoteBox: {
    backgroundColor: theme.colors.background + "30",
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.white + "40",
  },
  finalStatementNoteText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },

  // ── Final App Completion Celebration (full-screen overlay) ──
  finalCelebrationOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(8, 13, 22, 0.92)",
  },
  finalCelebrationScrollContent: {
    flexGrow: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: theme.spacing.lg,
  },
  finalCelebrationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.amber,
    alignItems: "center" as const,
    width: "100%" as const,
  },
  finalCelebrationTitle: {
    color: theme.colors.amber,
    fontSize: 26,
    fontWeight: "900" as const,
    textAlign: "center",
    marginBottom: 18,
  },
  finalCelebrationBody: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800" as const,
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 12,
  },
  finalCelebrationSub: {
    color: theme.colors.amber,
    fontSize: 16,
    fontWeight: "700" as const,
    textAlign: "center",
    marginBottom: 22,
  },
  finalCelebrationLines: {
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 22,
  },
  finalCelebrationLine: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  finalCelebrationClosing: {
    color: theme.colors.green,
    fontSize: 20,
    fontWeight: "900" as const,
    textAlign: "center",
    marginBottom: 18,
  },
  finalCelebrationRememberTitle: {
    color: theme.colors.amber,
    fontSize: 16,
    fontWeight: "800" as const,
    textAlign: "center",
    marginBottom: 8,
  },
  finalCelebrationRememberLines: {
    alignItems: "center" as const,
    gap: 4,
    marginBottom: 18,
  },
  finalCelebrationRememberLine: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  finalCelebrationSign: {
    color: theme.colors.amber,
    fontSize: 16,
    fontWeight: "700" as const,
    fontStyle: "italic" as const,
    textAlign: "center",
    marginBottom: 26,
  },
  finalCelebrationButton: {
    backgroundColor: theme.colors.amber,
    borderRadius: theme.radius.pill,
    paddingVertical: 16,
    paddingHorizontal: 56,
  },
  finalCelebrationButtonText: {
    color: theme.colors.background,
    fontSize: 20,
    fontWeight: "900" as const,
  },

  // ── Guided Learning completion card ──
  guidedCompletionCard: {
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.green,
    marginTop: theme.spacing.md,
    alignItems: "center" as const,
  },
  guidedCelebrationMsg: {
    color: theme.colors.green,
    fontSize: 19,
    fontWeight: "900" as const,
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 14,
  },
  guidedProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  guidedProgressDone: {
    color: theme.colors.green,
    fontSize: 16,
    fontWeight: "800" as const,
  },
  guidedNextBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.green + "60",
    alignItems: "center" as const,
    marginBottom: 16,
    width: "100%" as const,
  },
  guidedNextLabel: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  guidedNextTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900" as const,
    textAlign: "center",
  },
  guidedNavButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: "100%" as const,
  },
  guidedNavButtonText: {
    color: theme.colors.background,
    fontSize: 17,
    fontWeight: "900" as const,
    flexShrink: 1,
  },

  // ── Section-completion banner (~5 seconds, non-blocking, no auto-nav) ──
  sectionToastWrap: {
    position: "absolute" as const,
    top: 84,
    left: theme.spacing.md,
    right: theme.spacing.md,
    alignItems: "center" as const,
  },
  sectionToastCard: {
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: "center" as const,
    maxWidth: "100%" as const,
    shadowColor: theme.colors.green,
    shadowOffset: { width: 0, height: 6 } as const,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  sectionToastText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "900" as const,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionToastDivider: {
    width: 60,
    height: 2,
    backgroundColor: theme.colors.background,
    opacity: 0.4,
    borderRadius: 2,
    marginVertical: 10,
  },
  sectionToastProgressRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  sectionToastProgressDone: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: "800" as const,
  },
  sectionToastNextBox: {
    marginTop: 4,
    alignItems: "center" as const,
  },
  sectionToastNextLabel: {
    color: theme.colors.background,
    opacity: 0.85,
    fontSize: 12,
    fontWeight: "700" as const,
    marginBottom: 2,
  },
  sectionToastNextTitle: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: "900" as const,
  },
});
