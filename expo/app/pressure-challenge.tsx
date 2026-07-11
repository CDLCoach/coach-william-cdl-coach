import { useRouter } from "expo-router";
import {
  ArrowRight,
  Check,
  Clock,
  Home,
  RotateCcw,
  Timer,
  Trophy,
  X,
  Zap,
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
  perfectScoreMessage,
  randomCoffeeBreak,
  randomCornerMessage,
  randomPressureCorrect,
  randomPressureIncorrect,
  randomSignOff,
} from "@/constants/coach-william";
import { useProAccess } from "@/constants/pro-access";
import { type PressureQuestion, pressureQuestions } from "@/constants/pressure-challenge";
import { theme } from "@/constants/theme";

type Phase = "intro" | "quiz" | "results";

/** Number of questions in one Pressure Challenge session. */
const SESSION_SIZE = 15;
/** Seconds per question. */
const SECONDS_PER_QUESTION = 10;

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
 * Build a Pressure Challenge session: shuffle the full pool, take SESSION_SIZE,
 * and shuffle each question's answer choices so every run feels fresh. No
 * question repeats within the same session.
 */
function createSessionQuestions(): PressureQuestion[] {
  return shuffle(pressureQuestions).slice(0, SESSION_SIZE).map((q) => {
    const pairs = q.options.map((opt, idx) => ({ opt, origIdx: idx }));
    const shuffledPairs = shuffle(pairs);
    return {
      id: q.id,
      category: q.category,
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
  selected: boolean | null;
  isAnswer: boolean;
  locked: boolean;
  timedOut: boolean;
  onSelect: (index: number) => void;
};

/** Memoized single answer option — only re-renders when its own state changes. */
const OptionButton = memo(function OptionButton({
  index,
  option,
  selected,
  isAnswer,
  locked,
  timedOut,
  onSelect,
}: OptionButtonProps) {
  const showCorrect = locked && isAnswer;
  const showWrong = locked && selected === true && !isAnswer;

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

export default function PressureChallengeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPro, loaded } = useProAccess();

  const [phase, setPhase] = useState<Phase>("intro");
  const [sessionQuestions, setSessionQuestions] = useState<PressureQuestion[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [locked, setLocked] = useState<boolean>(false);
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(SECONDS_PER_QUESTION);

  const total = sessionQuestions.length;

  // Refs mirror the latest state so handlers can be stable (no deps).
  const lockedRef = useRef(locked);
  lockedRef.current = locked;
  const currentRef = useRef(current);
  currentRef.current = current;
  const totalRef = useRef(total);
  totalRef.current = total;
  const questionRef = useRef<PressureQuestion | undefined>(undefined);

  // Timer ref — stored as a number so we can clear it.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = sessionQuestions[current];
  questionRef.current = question;

  // Redirect FREE users to the PRO upgrade screen — Pressure Challenge is a
  // PRO feature. Runs after load completes so AsyncStorage is consulted.
  useEffect(() => {
    if (loaded && !isPro) {
      router.replace("/pro?returnTo=/pressure-challenge" as never);
    }
  }, [loaded, isPro, router]);

  if (loaded && !isPro) {
    return <View style={styles.container} />;
  }

  // ── Timer management ──────────────────────────────────────────────────────
  // When a new question is shown (not locked), start a 10-second countdown.
  // When time hits 0, lock the question as incorrect (timeout).
  useEffect(() => {
    if (phase !== "quiz" || locked) {
      return;
    }
    setTimeLeft(SECONDS_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up — stop the timer and mark as timeout.
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimedOut(true);
          setLocked(true);
          setSelected(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, current, locked]);

  // ── Defensive guard: invalid index → safe loading state ───────────────────
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

  // ── Handlers (stable identities via refs) ──────────────────────────────────
  const onSelect = useCallback((index: number) => {
    if (lockedRef.current) return;
    const q = questionRef.current;
    if (!q) return;
    const isCorrect = index === q.answer;
    // Stop the timer immediately on answer.
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSelected(isCorrect);
    setLocked(true);
    setTimedOut(false);
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
    setTimedOut(false);
    setCurrent((c) => c + 1);
  }, []);

  const startChallenge = useCallback(() => {
    setSessionQuestions(createSessionQuestions());
    setPhase("quiz");
    setCurrent(0);
    setSelected(null);
    setLocked(false);
    setTimedOut(false);
    setCorrectCount(0);
    setTimeLeft(SECONDS_PER_QUESTION);
  }, []);

  const restart = useCallback(() => {
    setSessionQuestions(createSessionQuestions());
    setPhase("quiz");
    setCurrent(0);
    setSelected(null);
    setLocked(false);
    setTimedOut(false);
    setCorrectCount(0);
    setTimeLeft(SECONDS_PER_QUESTION);
  }, []);

  const goHome = useCallback(() => {
    router.back();
  }, [router]);

  // ── Intro screen ───────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <IntroView
        onStart={startChallenge}
        onHome={goHome}
        bottomInset={insets.bottom}
        topInset={insets.top}
      />
    );
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (phase === "results") {
    return (
      <ResultsView
        total={total}
        correct={correctCount}
        onRestart={restart}
        onHome={goHome}
        bottomInset={insets.bottom}
      />
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  const q: PressureQuestion = question;
  const progress = (current + (locked ? 1 : 0)) / total;
  const isLast = current + 1 >= total;
  const timeColor = timeLeft <= 3 ? theme.colors.red : timeLeft <= 6 ? theme.colors.amber : theme.colors.green;

  return (
    <View style={styles.container}>
      {/* Header: progress + timer */}
      <View style={styles.progressBar}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {current + 1} of {total}
          </Text>
          <View style={[styles.timerBadge, { borderColor: timeColor }]}>
            <Clock color={timeColor} size={16} strokeWidth={2.6} />
            <Text style={[styles.timerText, { color: timeColor }]}>{timeLeft}s</Text>
          </View>
        </View>
        <Text style={styles.categoryLabel}>{q.category}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        <View>
          <Text style={styles.question}>{q.question}</Text>

          <View style={styles.options}>
            {q.options.map((option, index) => (
              <OptionButton
                key={`${q.id}-${index}`}
                index={index}
                option={option}
                selected={selected}
                isAnswer={index === q.answer}
                locked={locked}
                timedOut={timedOut}
                onSelect={onSelect}
              />
            ))}
          </View>

          {/* Feedback shown after answering or timeout */}
          {locked && (
            <View style={styles.explainCard}>
              <Text style={styles.explainLabel}>
                {timedOut
                  ? "Time's up!"
                  : selected === true
                    ? "Correct!"
                    : "Not quite —"}
              </Text>
              <Text style={styles.explainText}>
                {timedOut
                  ? `The correct answer is ${String.fromCharCode(65 + q.answer)}: ${q.options[q.answer]}.\n${q.explanation}`
                  : q.explanation}
              </Text>
              {timedOut && (
                <Text style={styles.timeoutCoachNote}>
                  {randomPressureIncorrect()}
                </Text>
              )}
              {!timedOut && selected === true && (
                <Text style={styles.correctCoachNote}>
                  {randomPressureCorrect()}
                </Text>
              )}
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

// ── Intro Screen ──────────────────────────────────────────────────────────────

function IntroView({
  onStart,
  onHome,
  bottomInset,
  topInset,
}: {
  onStart: () => void;
  onHome: () => void;
  bottomInset: number;
  topInset: number;
}) {
  const corner = useMemo(() => randomCornerMessage(), []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.introScroll,
          { paddingTop: topInset + theme.spacing.lg, paddingBottom: bottomInset + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introIconWrap}>
          <Zap color={theme.colors.amber} size={48} strokeWidth={2.2} />
        </View>
        <Text style={styles.introTitle}>Pressure Challenge</Text>
        <Text style={styles.introSubtitle}>
          Train to answer quickly under test pressure.
        </Text>

        <View style={styles.introRulesCard}>
          <View style={styles.introRuleRow}>
            <Timer color={theme.colors.amber} size={20} strokeWidth={2.4} />
            <Text style={styles.introRuleText}>
              {SECONDS_PER_QUESTION} seconds per question
            </Text>
          </View>
          <View style={styles.introRuleRow}>
            <Check color={theme.colors.green} size={20} strokeWidth={2.4} />
            <Text style={styles.introRuleText}>
              {SESSION_SIZE} random questions from all inspection categories
            </Text>
          </View>
          <View style={styles.introRuleRow}>
            <X color={theme.colors.red} size={20} strokeWidth={2.4} />
            <Text style={styles.introRuleText}>
              If time runs out, it's marked incorrect
            </Text>
          </View>
          <View style={styles.introRuleRow}>
            <Trophy color={theme.colors.blue} size={20} strokeWidth={2.4} />
            <Text style={styles.introRuleText}>
              See your final score at the end
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onStart}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.nextBtnPressed]}
          testID="start-challenge-button"
        >
          <Zap color={theme.colors.background} size={20} strokeWidth={2.6} />
          <Text style={styles.nextText}>Start Challenge</Text>
        </Pressable>
        <Pressable
          onPress={onHome}
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.optionPressed]}
          testID="home-button"
        >
          <Text style={styles.secondaryText}>Back to Home</Text>
        </Pressable>

        <View style={styles.cornerCard}>
          <View style={styles.cornerHeader}>
            <Clock color={theme.colors.amber} size={14} strokeWidth={2.2} />
            <Text style={styles.cornerBadge}>Coach William's Corner</Text>
          </View>
          <Text style={styles.cornerText}>"{corner}"</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────

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

  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const corner = useMemo(() => randomCornerMessage(), []);
  const signOff = useMemo(() => randomSignOff(), []);

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
            {passed ? "You handled the pressure! Keep it sharp." : "Keep practicing — speed comes with repetition."}
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
          <Text style={styles.nextText}>Restart Challenge</Text>
        </Pressable>
        <Pressable
          onPress={onHome}
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.optionPressed]}
          testID="home-button"
        >
          <Home color={theme.colors.textMuted} size={18} strokeWidth={2.4} />
          <Text style={styles.secondaryText}>Back to Home</Text>
        </Pressable>

        <View style={styles.coffeeBreakCard}>
          <View style={styles.coffeeBreakHeader}>
            <Clock color={theme.colors.green} size={14} strokeWidth={2.2} />
            <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
          </View>
          <Text style={styles.coffeeBreakText}>"{coffee}"</Text>
        </View>

        <View style={styles.cornerCard}>
          <View style={styles.cornerHeader}>
            <Clock color={theme.colors.amber} size={14} strokeWidth={2.2} />
            <Text style={styles.cornerBadge}>Coach William's Corner</Text>
          </View>
          <Text style={styles.cornerText}>"{corner}"</Text>
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
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "700",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: {
    fontSize: 15,
    fontWeight: "900",
  },
  categoryLabel: {
    color: theme.colors.amber,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
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
  correctCoachNote: {
    color: theme.colors.green,
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
    marginTop: 8,
  },
  timeoutCoachNote: {
    color: theme.colors.red,
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
    marginTop: 8,
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
  // ── Intro ──
  introScroll: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  introIconWrap: {
    width: 96,
    height: 96,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.amberSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.amber,
  },
  introTitle: {
    color: theme.colors.amber,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  introSubtitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  introRulesCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: "100%",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  introRuleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  introRuleText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: theme.spacing.sm,
  },
  secondaryText: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  // ── Results ──
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
    flexShrink: 1,
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
