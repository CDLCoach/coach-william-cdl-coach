import { useRouter } from "expo-router";
import {
  ArrowRight,
  Check,
  Coffee,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react-native";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  perfectScoreMessage,
  randomCoffeeBreak,
  randomCornerMessage,
  randomSignOff,
  randomTruckerWisdom,
} from "@/constants/coach-william";
import { useProAccess } from "@/constants/pro-access";
import { type QuizQuestion, quizQuestions } from "@/constants/quiz";
import { theme } from "@/constants/theme";

type Phase = "quiz" | "results";

/**
 * Simple, stable Practice Test — optimized for smooth, low-lag transitions.
 *
 * Flow: one question → student selects one answer → correct/incorrect is
 * shown inline → student taps Next → next question → after Q22 → results.
 *
 * Performance notes:
 *  - Handlers use functional setState so their identity is stable across
 *    renders, preventing child Pressables from re-rendering.
 *  - Each option is a memoized OptionButton that only re-renders when its
 *    own visual state (selected / locked / correct / wrong) changes.
 *  - The "Trucker Wisdom" line is picked once per question via useMemo,
 *    so it doesn't re-randomize on every render.
 *  - No key on the options container — React reconciles in place.
 *  - No animations, modals, overlays, timers, or auto-advance.
 */

/** Fisher-Yates shuffle returning a new array. */
function shuffle<T>(array: readonly T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Shuffles the question bank and randomizes each question's answer choices
 * so every practice test feels fresh. Returns a defensive copy so the
 * original quiz data is never mutated.
 */
function createShuffledQuestions(): QuizQuestion[] {
  return shuffle(quizQuestions).map((q) => {
    const pairs = q.options.map((opt, idx) => ({ opt, origIdx: idx }));
    const shuffledPairs = shuffle(pairs);
    return {
      id: q.id,
      question: q.question,
      options: shuffledPairs.map((p) => p.opt),
      answer: shuffledPairs.findIndex((p) => p.origIdx === q.answer),
      explanation: q.explanation,
    };
  });
}

type OptionButtonProps = {
  index: number;
  option: string;
  selected: boolean;
  isAnswer: boolean;
  locked: boolean;
  onSelect: (index: number) => void;
};

/** Memoized single answer option — only re-renders when its own state changes. */
const OptionButton = memo(function OptionButton({
  index,
  option,
  selected,
  isAnswer,
  locked,
  onSelect,
}: OptionButtonProps) {
  const showCorrect = locked && isAnswer;
  const showWrong = locked && selected && !isAnswer;

  const handlePress = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={locked}
      style={({ pressed }) => [
        styles.option,
        showCorrect && styles.optionCorrect,
        showWrong && styles.optionWrong,
        !locked && pressed && styles.optionPressed,
      ]}
      testID={`option-${index}`}
    >
      <View
        style={[
          styles.optionMarker,
          showCorrect && styles.markerCorrect,
          showWrong && styles.markerWrong,
        ]}
      >
        {showCorrect ? (
          <Check color={theme.colors.background} size={16} strokeWidth={3} />
        ) : showWrong ? (
          <X color={theme.colors.white} size={16} strokeWidth={3} />
        ) : (
          <Text style={styles.optionLetter}>
            {String.fromCharCode(65 + index)}
          </Text>
        )}
      </View>
      <Text style={styles.optionText}>{option}</Text>
    </Pressable>
  );
});

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPro, loaded } = useProAccess();

  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>(
    () => createShuffledQuestions(),
  );
  const total = shuffledQuestions.length;

  const [phase, setPhase] = useState<Phase>("quiz");
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // ScrollView ref — reset scroll to top on each new question so content
  // doesn't accumulate at a stale scroll offset (causes fuzzy/offset rendering).
  const scrollRef = useRef<ScrollView>(null);

  // ALL hooks must run before any conditional return (Rules of Hooks).
  const question = shuffledQuestions[current];

  // Pick the wisdom line once per question so it doesn't re-randomize
  // on every render (e.g. when the student selects an answer).
  const wisdom = useMemo(() => randomTruckerWisdom(), [question?.id]);

  // Reset scroll position to top whenever the question index changes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [current]);

  // Redirect FREE users to the PRO upgrade screen — Practice Test is a
  // PRO feature. Runs after load completes so AsyncStorage is consulted.
  useEffect(() => {
    if (loaded && !isPro) {
      router.replace("/pro?returnTo=/practice" as never);
    }
  }, [loaded, isPro, router]);

  if (loaded && !isPro) {
    return <View style={styles.container} />;
  }

  // Refs mirror the latest state so handlers can be stable (no deps).
  const lockedRef = useRef(locked);
  lockedRef.current = locked;
  const currentRef = useRef(current);
  currentRef.current = current;
  const totalRef = useRef(total);
  totalRef.current = total;
  const questionRef = useRef<QuizQuestion | undefined>(question);
  questionRef.current = question;

  // Stable handlers — functional setState + refs means zero dependency churn.
  const onSelect = useCallback((index: number) => {
    if (lockedRef.current) return;
    const q = questionRef.current;
    if (!q) return;
    const isCorrect = index === q.answer;
    setSelected(index);
    setLocked(true);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }
  }, []);

  const onNext = useCallback(() => {
    if (!lockedRef.current) return;
    const cur = currentRef.current;
    const tot = totalRef.current;
    if (cur + 1 >= tot) {
      setPhase("results");
      return;
    }
    setSelected(null);
    setLocked(false);
    setCurrent((c) => c + 1);
  }, []);

  const restart = useCallback(() => {
    setShuffledQuestions(createShuffledQuestions());
    setPhase("quiz");
    setCurrent(0);
    setSelected(null);
    setLocked(false);
    setCorrectCount(0);
  }, []);

  // ── Defensive guard: invalid index → safe loading state ──
  // (AFTER all hooks have been called.)
  if (phase === "quiz" && !question) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.textMuted, fontSize: 16, fontWeight: "700" }}>
            Loading question…
          </Text>
        </View>
      </View>
    );
  }

  if (phase === "results") {
    return (
      <ResultsView
        total={total}
        correct={correctCount}
        onRestart={restart}
        onHome={() => router.back()}
        bottomInset={insets.bottom}
      />
    );
  }

  // Guard already ensured question is defined here.
  const q: QuizQuestion = question;
  const progress = (current + (locked ? 1 : 0)) / total;
  const isLast = current + 1 >= total;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {current + 1} of {total}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        {/* No key on the ScrollView — React reconciles in place so we don't
            pay for a full unmount/mount on every question. The scroll-to-top
            effect handles the offset reset. */}
        <View>
          <Text style={styles.question}>{q.question}</Text>

          {/* Trucker Wisdom */}
          <View style={styles.wisdomCard}>
            <Text style={styles.wisdomText}>"{wisdom}"</Text>
          </View>

          <View style={styles.options}>
            {q.options.map((option, index) => (
              <OptionButton
                key={`${q.id}-${index}`}
                index={index}
                option={option}
                selected={selected === index}
                isAnswer={index === q.answer}
                locked={locked}
                onSelect={onSelect}
              />
            ))}
          </View>

          {/* Explanation shown after answering */}
          {locked && (
            <View style={styles.explainCard}>
              <Text style={styles.explainLabel}>
                {selected === q.answer ? "Correct!" : "Not quite —"}
              </Text>
              <Text style={styles.explainText}>{q.explanation}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer with Next button — visible only after answering */}
      {locked && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
          <Pressable
            onPress={onNext}
            style={({ pressed }) => [styles.nextBtn, pressed && styles.nextBtnPressed]}
            testID="next-button"
          >
            <Text style={styles.nextText}>
              {isLast ? "See Results" : "Next Question"}
            </Text>
            <ArrowRight color={theme.colors.background} size={20} strokeWidth={2.6} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function ResultsView({
  total,
  correct,
  onRestart,
  onHome,
  bottomInset,
}: {
  total: number;
  correct: number;
  onRestart: () => void;
  onHome: () => void;
  bottomInset: number;
}) {
  const incorrect = total - correct;
  const percent = useMemo(
    () => (total > 0 ? Math.round((correct / total) * 100) : 0),
    [correct, total],
  );
  const passed = percent >= 80;
  const accent = passed ? theme.colors.green : theme.colors.amber;

  // Pick the random coach messages once for the results screen.
  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const corner = useMemo(() => randomCornerMessage(), []);
  const signOff = useMemo(() => randomSignOff(), []);
  const debrief = useMemo(
    () => buildDebrief({ sectionId: "practice", completedCount: correct, totalCount: total }),
    [correct, total],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.resultsScroll,
          { paddingBottom: bottomInset + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.scoreRing, { borderColor: accent }]}>
          <Text style={[styles.scorePercent, { color: accent }]}>{percent}%</Text>
          <Text style={styles.scoreCaption}>Score</Text>
        </View>

        <View style={[styles.verdict, { backgroundColor: accent + "22" }]}>
          <Trophy color={accent} size={20} strokeWidth={2.4} />
          <Text style={[styles.verdictText, { color: accent }]}>
            {passed ? "You passed! Keep it sharp." : "Almost there — review and retry."}
          </Text>
        </View>

        {percent === 100 && (
          <View style={styles.highAchievementBanner}>
            <Text style={styles.highAchievementLabel}>Coach William Says:</Text>
            <Text style={styles.highAchievementText}>{perfectScoreMessage}</Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <StatBox label="Total Questions" value={total} color={theme.colors.text} />
          <StatBox label="Correct Answers" value={correct} color={theme.colors.green} />
          <StatBox label="Incorrect" value={incorrect} color={theme.colors.red} />
          <StatBox label="Percentage" value={`${percent}%`} color={accent} />
        </View>

        <Pressable
          onPress={onRestart}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.nextBtnPressed]}
          testID="retake-button"
        >
          <RotateCcw color={theme.colors.background} size={20} strokeWidth={2.6} />
          <Text style={styles.nextText}>Retake Test</Text>
        </Pressable>
        <Pressable
          onPress={onHome}
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.optionPressed]}
          testID="home-button"
        >
          <Text style={styles.secondaryText}>Back to Home</Text>
        </Pressable>

        <View style={styles.coffeeBreakCard}>
          <View style={styles.coffeeBreakHeader}>
            <Coffee color={theme.colors.green} size={14} strokeWidth={2.2} />
            <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
          </View>
          <Text style={styles.coffeeBreakText}>"{coffee}"</Text>
        </View>

        <View style={styles.cornerCard}>
          <View style={styles.cornerHeader}>
            <Coffee color={theme.colors.amber} size={14} strokeWidth={2.2} />
            <Text style={styles.cornerBadge}>Coach William's Corner</Text>
          </View>
          <Text style={styles.cornerText}>"{corner}"</Text>
        </View>

        <View style={styles.debriefCard}>
          <View style={styles.debriefHeader}>
            <Text style={styles.debriefBadge}>Coach William's Debrief</Text>
          </View>
          <Text style={styles.debriefText}>{debrief}</Text>
        </View>

        <Text style={styles.signOffText}>{signOff}</Text>
      </ScrollView>
    </View>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressBar: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    gap: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceRaised,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.amber,
  },
  progressText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "700",
  },
  scroll: {
    padding: theme.spacing.md,
  },
  question: {
    color: theme.colors.text,
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 31,
    marginBottom: theme.spacing.lg,
  },
  options: {
    gap: theme.spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionCorrect: {
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.greenSoft,
  },
  optionWrong: {
    borderColor: theme.colors.red,
    backgroundColor: theme.colors.redSoft,
  },
  optionMarker: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  markerCorrect: {
    backgroundColor: theme.colors.green,
  },
  markerWrong: {
    backgroundColor: theme.colors.red,
  },
  optionLetter: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "900",
  },
  optionText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 23,
  },
  explainCard: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.amber,
  },
  explainLabel: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 5,
  },
  explainText: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.amber,
    borderRadius: theme.radius.md,
    paddingVertical: 17,
  },
  nextBtnPressed: {
    opacity: 0.85,
  },
  nextText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: "900",
  },
  resultsScroll: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  scoreRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  scorePercent: {
    fontSize: 52,
    fontWeight: "900",
  },
  scoreCaption: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 2,
  },
  verdict: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    marginBottom: theme.spacing.lg,
  },
  verdictText: {
    fontSize: 15,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: 30,
    fontWeight: "900",
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.amber,
    borderRadius: theme.radius.md,
    paddingVertical: 17,
    width: "100%",
  },
  secondaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: theme.spacing.sm,
  },
  secondaryText: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  cornerCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginTop: theme.spacing.lg,
    width: "100%",
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
  signOffText: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginTop: theme.spacing.lg,
  },
  wisdomCard: {
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
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 20,
  },
  coffeeBreakCard: {
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.green,
    marginTop: theme.spacing.md,
    width: "100%",
  },
  coffeeBreakHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  coffeeBreakBadge: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  coffeeBreakText: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 23,
  },
  debriefCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.blue,
    marginTop: theme.spacing.md,
    width: "100%",
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
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  debriefText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
  },
  highAchievementBanner: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginBottom: theme.spacing.lg,
    width: "100%",
  },
  highAchievementLabel: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  highAchievementText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 22,
  },
});
