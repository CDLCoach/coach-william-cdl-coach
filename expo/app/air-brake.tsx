import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  ClipboardCheck,
  Coffee,
  Info,
  Shuffle,
  Timer,
  Trophy,
} from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  buildDebrief,
  getCorrectEncouragement,
  getCorrectStreak,
  getGeneralCoaching,
  getMistakeEncouragement,
  perfectScoreMessage,
  randomCoffeeBreak,
  randomCornerMessage,
  randomEncouragement,
  randomSignOff,
  randomTip,
  randomTruckerWisdom,
} from "@/constants/coach-william";
import { theme } from "@/constants/theme";

// ── Data ────────────────────────────────────────────────────────────────────

type LearnStep = {
  step: number;
  title: string;
  description: string;
  encouragement: string;
  coachReminder?: string;
};

const learnSteps: LearnStep[] = [
  {
    step: 1,
    title: "Off-On-Push",
    description:
      "Turn the truck off. Turn the key to the on position but do not start the truck. Push in both parking brake valves.",
    encouragement: "Nice work. You are building confidence.",
  },
  {
    step: 2,
    title: "Air Leakage Rate Test",
    description:
      "With both parking brake valves pushed in, apply and hold the service brake pedal for one full minute while checking the rate of air leakage. A combination vehicle should lose no more than 4 PSI during that one-minute period.",
    encouragement: "You have got this.",
    coachReminder:
      "We're not just checking for an air leak\u2014we're checking the rate of air leakage over one minute.",
  },
  {
    step: 3,
    title: "Low Air Warning Test",
    description:
      "Fan the service brake until the low air warning buzzer and light come on before 55 PSI.",
    encouragement: "Accuracy first. Speed comes later.",
  },
  {
    step: 4,
    title: "Parking Brake Pop-Out Test",
    description:
      "Continue fanning the service brake until both parking brake valves pop out between 45 and 20 PSI.",
    encouragement: "Every repetition makes this easier.",
  },
];

const stepOrder = learnSteps.map((s) => s.title);



type TrainingMode = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ color: string; size: number; strokeWidth: number }>;
  accent: string;
};

const trainingModes: TrainingMode[] = [
  {
    id: "learn",
    title: "Learn the Test",
    subtitle: "Study the four main sections with encouragement",
    icon: BookOpen,
    accent: theme.colors.blue,
  },
  {
    id: "forward",
    title: "Forward Recall",
    subtitle: "Practice saying the steps in order",
    icon: ArrowRight,
    accent: theme.colors.amber,
  },
  {
    id: "reverse",
    title: "Reverse Recall",
    subtitle: "Practice saying the steps backward",
    icon: ArrowLeft,
    accent: theme.colors.amber,
  },
  {
    id: "random",
    title: "Random Recall",
    subtitle: "Identify steps from random prompts",
    icon: Shuffle,
    accent: theme.colors.green,
  },
  {
    id: "pressure",
    title: "Pressure Recall",
    subtitle: "Perform under exam pressure with a timer",
    icon: Timer,
    accent: theme.colors.red,
  },
  {
    id: "mock",
    title: "Mock Test",
    subtitle: "Full simulated air brake check",
    icon: ClipboardCheck,
    accent: theme.colors.blue,
  },
];

type Mode = "menu" | "learn" | "forward" | "reverse" | "random" | "pressure" | "mock" | "challenge";

// ── Helpers ─────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}



// ── Sub-views ───────────────────────────────────────────────────────────────

function LearnView({ onBack, goTo }: { onBack: () => void; goTo: (m: Mode) => void }) {
  const insets = useSafeAreaInsets();
  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const debrief = useMemo(
    () => buildDebrief({ sectionId: "air-brake", completedCount: learnSteps.length, totalCount: learnSteps.length }),
    [],
  );
  const signOff = useMemo(() => randomSignOff(), []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Training Menu</Text>
        </Pressable>

        <Text style={styles.modeTitle}>Learn the Test</Text>
        <Text style={styles.modeSubtitle}>
          Study each step carefully. Accuracy comes first.
        </Text>

        <View style={styles.learnSteps}>
          {learnSteps.map((ls, idx) => (
            <View key={ls.step}>
              <View style={styles.learnCard}>
                <View style={styles.learnBadge}>
                  <Text style={styles.learnBadgeText}>{ls.step}</Text>
                </View>
                <Text style={styles.learnTitle}>{ls.title}</Text>
                <Text style={styles.learnDesc}>{ls.description}</Text>
              </View>
              <View style={styles.encouragementRow}>
                <View style={styles.encouragementDot} />
                <Text style={styles.encouragementText}>{ls.encouragement}</Text>
              </View>
              {ls.coachReminder && (
                <View style={styles.tipCard}>
                  <Text style={styles.tipBadge}>Coach William Reminds You:</Text>
                  <Text style={styles.tipText}>"{ls.coachReminder}"</Text>
                </View>
              )}
              {idx < learnSteps.length - 1 && <View style={styles.learnDivider} />}
            </View>
          ))}
        </View>

        {/* Coffee Break */}
        <View style={styles.coffeeBreakCard}>
          <View style={styles.coffeeBreakHeader}>
            <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
          </View>
          <Text style={styles.coffeeBreakText}>
            "{coffee}"
          </Text>
        </View>

        {/* Debrief */}
        <View style={styles.debriefCard}>
          <View style={styles.debriefHeader}>
            <Text style={styles.debriefBadge}>Coach William's Debrief</Text>
          </View>
          <Text style={styles.debriefText}>
            {debrief}
          </Text>
        </View>

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={styles.doneButtonText}>Back to Training Menu</Text>
        </Pressable>
        <Text style={styles.signOffText}>{signOff}</Text>
      </ScrollView>
    </View>
  );
}

// ── Forward Recall ──────────────────────────────────────────────────────────

function ForwardRecallView({ onBack, goTo }: { onBack: () => void; goTo: (m: Mode) => void }) {
  const insets = useSafeAreaInsets();
  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const debrief = useMemo(
    () => buildDebrief({ sectionId: "air-brake", completedCount: learnSteps.length, totalCount: learnSteps.length }),
    [],
  );
  const signOff = useMemo(() => randomSignOff(), []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Training Menu</Text>
        </Pressable>

        <Text style={styles.modeTitle}>Forward Recall</Text>
        <Text style={styles.modeSubtitle}>
          Practice saying the Air Brake Test steps in order.
        </Text>

        <View style={styles.recallList}>
          {learnSteps.map((ls, idx) => (
            <View key={ls.step}>
              <View style={styles.recallListItem}>
                <View style={[styles.learnBadge, { backgroundColor: theme.colors.amber }]}>
                  <Text style={[styles.learnBadgeText, { color: theme.colors.background }]}>
                    {ls.step}
                  </Text>
                </View>
                <View style={styles.recallListItemContent}>
                  <Text style={styles.recallTitle}>{ls.title}</Text>
                  <Text style={styles.learnDesc}>{ls.description}</Text>
                </View>
              </View>
              {idx < learnSteps.length - 1 && (
                <View style={styles.recallArrow}>
                  <ArrowRight color={theme.colors.amber} size={22} strokeWidth={3} />
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.recallHint}>
          <Text style={styles.recallHintText}>
            Say each step out loud. Try to recall the title and what it means
            before reading the description.
          </Text>
        </View>

        {/* Coffee Break */}
        <View style={styles.coffeeBreakCard}>
          <View style={styles.coffeeBreakHeader}>
            <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
          </View>
          <Text style={styles.coffeeBreakText}>
            "{coffee}"
          </Text>
        </View>

        {/* Debrief */}
        <View style={styles.debriefCard}>
          <View style={styles.debriefHeader}>
            <Text style={styles.debriefBadge}>Coach William's Debrief</Text>
          </View>
          <Text style={styles.debriefText}>
            {debrief}
          </Text>
        </View>

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={styles.doneButtonText}>Back to Training Menu</Text>
        </Pressable>
        <Text style={styles.signOffText}>{signOff}</Text>
      </ScrollView>
    </View>
  );
}

// ── Reverse Recall ──────────────────────────────────────────────────────────

function ReverseRecallView({ onBack, goTo }: { onBack: () => void; goTo: (m: Mode) => void }) {
  const insets = useSafeAreaInsets();
  const reversed = useMemo(() => [...learnSteps].reverse(), []);
  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const debrief = useMemo(
    () => buildDebrief({ sectionId: "air-brake", completedCount: learnSteps.length, totalCount: learnSteps.length }),
    [],
  );
  const signOff = useMemo(() => randomSignOff(), []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Training Menu</Text>
        </Pressable>

        <Text style={styles.modeTitle}>Reverse Recall</Text>
        <Text style={styles.modeSubtitle}>
          Practice saying the Air Brake Test steps in reverse order — exactly as
          an instructor would teach.
        </Text>

        <View style={styles.recallList}>
          {reversed.map((ls, idx) => (
            <View key={ls.step}>
              <View style={styles.recallListItem}>
                <View style={[styles.learnBadge, { backgroundColor: theme.colors.amber }]}>
                  <Text style={[styles.learnBadgeText, { color: theme.colors.background }]}>
                    {ls.step}
                  </Text>
                </View>
                <View style={styles.recallListItemContent}>
                  <Text style={styles.recallTitle}>{ls.title}</Text>
                  <Text style={styles.learnDesc}>{ls.description}</Text>
                </View>
              </View>
              {idx < reversed.length - 1 && (
                <View style={styles.recallArrow}>
                  <ArrowRight
                    color={theme.colors.amber}
                    size={22}
                    strokeWidth={3}
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.recallHint}>
          <Text style={styles.recallHintText}>
            If you can say it backward, you really know it. Try closing your eyes
            and reciting all four steps in reverse.
          </Text>
        </View>

        {/* Coffee Break */}
        <View style={styles.coffeeBreakCard}>
          <View style={styles.coffeeBreakHeader}>
            <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
          </View>
          <Text style={styles.coffeeBreakText}>
            "{coffee}"
          </Text>
        </View>

        {/* Debrief */}
        <View style={styles.debriefCard}>
          <View style={styles.debriefHeader}>
            <Text style={styles.debriefBadge}>Coach William's Debrief</Text>
          </View>
          <Text style={styles.debriefText}>
            {debrief}
          </Text>
        </View>

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={styles.doneButtonText}>Back to Training Menu</Text>
        </Pressable>
        <Text style={styles.signOffText}>{signOff}</Text>
      </ScrollView>
    </View>
  );
}

// ── Random Recall ───────────────────────────────────────────────────────────

type RandomQuestion = {
  text: string;
  correctAnswer: string;
  options: string[];
};

function generateRandomQuestion(excludeIdx?: number): RandomQuestion {
  // Pick a random index that has both a before and after (or just one that works)
  // Avoid repeating the same question back-to-back
  let idx: number;
  if (excludeIdx !== undefined) {
    const candidates = stepOrder.map((_, i) => i).filter((i) => i !== excludeIdx);
    idx = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    idx = Math.floor(Math.random() * stepOrder.length);
  }

  if (idx === 0) {
    return {
      text: `What test comes after ${stepOrder[idx]}?`,
      correctAnswer: stepOrder[idx + 1],
      options: shuffleArray(stepOrder),
    };
  }
  if (idx === stepOrder.length - 1) {
    return {
      text: `What test comes before ${stepOrder[idx]}?`,
      correctAnswer: stepOrder[idx - 1],
      options: shuffleArray(stepOrder),
    };
  }
  // Randomly pick before or after
  if (Math.random() < 0.5) {
    return {
      text: `What test comes before ${stepOrder[idx]}?`,
      correctAnswer: stepOrder[idx - 1],
      options: shuffleArray(stepOrder),
    };
  }
  return {
    text: `What test comes after ${stepOrder[idx]}?`,
    correctAnswer: stepOrder[idx + 1],
    options: shuffleArray(stepOrder),
  };
}

function RandomRecallView({ onBack, goTo }: { onBack: () => void; goTo: (m: Mode) => void }) {
  const insets = useSafeAreaInsets();
  const lastIdxRef = useRef(-1);
  const [question, setQuestion] = useState<RandomQuestion>(() => generateRandomQuestion());
  const [selected, setSelected] = useState(-1);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showFeedback, setShowFeedback] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState<number>(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  // Pick random coach messages once so they don't re-randomize on every render
  // (e.g. when selecting answers or advancing questions).
  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const signOff = useMemo(() => randomSignOff(), []);

  const answered = selected >= 0;
  const answerSelectedRef = useRef(false);
  const isCorrect = answered && question.options[selected] === question.correctAnswer;

  const select = useCallback(
    (optIdx: number) => {
      if (answerSelectedRef.current) return;
      answerSelectedRef.current = true;
      setSelected(optIdx);
      setShowFeedback(true);
      const correct = question.options[optIdx] === question.correctAnswer;
      if (correct) {
        setConsecutiveWrong(0);
        setConsecutiveCorrect((c) => c + 1);
      } else {
        setConsecutiveCorrect(0);
        setConsecutiveWrong((w) => w + 1);
      }
      setScore((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        total: s.total + 1,
      }));
    },
    [answered, question],
  );

  const nextQuestion = useCallback(() => {
    // Determine current question index to avoid repeating it back-to-back
    const currentText = question.text;
    const currentIdx = stepOrder.findIndex((title) =>
      currentText.includes(title)
    );
    lastIdxRef.current = currentIdx;
    answerSelectedRef.current = false;
    setQuestion(generateRandomQuestion(currentIdx >= 0 ? currentIdx : undefined));
    setSelected(-1);
    setShowFeedback(false);
  }, [question.text]);

  const resetScore = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    nextQuestion();
  }, [nextQuestion]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Training Menu</Text>
        </Pressable>

        <Text style={styles.modeTitle}>Random Recall</Text>
        <Text style={styles.modeSubtitle}>
          Answer random questions about the order of the Air Brake Test.
        </Text>

        <View style={styles.scoreBar}>
          <Text style={styles.scoreText}>
            Score: {score.correct}/{score.total}
          </Text>
          {score.total > 0 && (
            <Text style={styles.scorePercent}>
              {Math.round((score.correct / score.total) * 100)}%
            </Text>
          )}
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.quizQ}>{question.text}</Text>
        </View>

        <View style={styles.quizOptions}>
          {question.options.map((optTitle, i) => {
            let bgColor: string = theme.colors.surface;
            let borderColor: string = theme.colors.border;
            if (showFeedback) {
              if (optTitle === question.correctAnswer) {
                bgColor = theme.colors.greenSoft;
                borderColor = theme.colors.green;
              } else if (i === selected && optTitle !== question.correctAnswer) {
                bgColor = theme.colors.redSoft;
                borderColor = theme.colors.red;
              }
            }

            return (
              <Pressable
                key={`quiz-option-${i}`}
                onPress={() => select(i)}
                disabled={answered}
                style={({ pressed }) => [
                  styles.quizOption,
                  { backgroundColor: bgColor, borderColor },
                  pressed && !answered && styles.cardPressed,
                ]}
              >
                <Text style={styles.quizOptionLetter}>
                  {String.fromCharCode(65 + i)}
                </Text>
                <Text style={styles.quizOptionText}>{optTitle}</Text>
              </Pressable>
            );
          })}
        </View>

        {showFeedback && (
          <View style={styles.feedbackCard}>
            <Text
              style={[
                styles.feedbackResult,
                { color: isCorrect ? theme.colors.green : theme.colors.red },
              ]}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </Text>
            {!isCorrect && (
              <Text style={styles.feedbackExplanation}>
                The correct answer is: {question.correctAnswer}
              </Text>
            )}
            <View style={styles.encouragementRow}>
              <View style={styles.encouragementDot} />
              <Text style={styles.encouragementText}>
                {isCorrect
                  ? consecutiveCorrect >= 3
                    ? getCorrectStreak()
                    : getCorrectEncouragement()
                  : getMistakeEncouragement(consecutiveWrong)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.quizActions}>
          <Pressable
            onPress={() => {
              setConsecutiveWrong(0);
              setConsecutiveCorrect(0);
              resetScore();
            }}
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.navButtonText}>Reset</Text>
          </Pressable>
          <Pressable
            onPress={nextQuestion}
            style={({ pressed }) => [
              styles.navButton,
              styles.navButtonPrimary,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.navButtonPrimaryText}>
              {answered ? "Next Question" : "Skip"}
            </Text>
          </Pressable>
        </View>

        {/* Coffee Break */}
        <View style={styles.coffeeBreakCard}>
          <View style={styles.coffeeBreakHeader}>
            <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
          </View>
          <Text style={styles.coffeeBreakText}>
            "{coffee}"
          </Text>
        </View>

        <Text style={styles.signOffText}>{signOff}</Text>
      </ScrollView>
    </View>
  );
}

// ── Pressure Recall ─────────────────────────────────────────────────────────

type PressureQuestion = {
  stepTitle: string;
  description: string;
};

type ConfidenceLevel = "Test Ready" | "Building" | "Learning";

const PRESSURE_COUNTDOWN = 10;

function PressureRecallView({
  onBack,
  goTo,
  streakCount,
  onStreakUpdate,
}: {
  onBack: () => void;
  goTo: (m: Mode) => void;
  streakCount: number;
  onStreakUpdate: (perfect: boolean) => void;
}) {
  const insets = useSafeAreaInsets();
  const [consecutiveWrong, setConsecutiveWrong] = useState<number>(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);

  const questions: PressureQuestion[] = useMemo(
    () =>
      shuffleArray(
        learnSteps.map((ls) => ({
          stepTitle: ls.title,
          description: ls.description,
        })),
      ),
    [],
  );

  const allTitles = useMemo(() => stepOrder, []);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PRESSURE_COUNTDOWN);
  const [timerExpired, setTimerExpired] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [options] = useState(() => shuffleArray(allTitles));

  const question = questions[currentQ];
  const answered = selected >= 0 || timerExpired;
  const isCorrect = selected >= 0 && options[selected] === question.stepTitle;
  const isLastQ = currentQ === questions.length - 1;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(PRESSURE_COUNTDOWN);
  const answeredRef = useRef(false);
  // Pick random coach messages once so they don't re-randomize on every render
  // (e.g. when the timer ticks every second, when selecting answers).
  const tip = useMemo(() => randomTip(), []);
  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const signOff = useMemo(() => randomSignOff(), []);
  // Debrief depends on the final score — only recompute when score changes.
  const debrief = useMemo(
    () => buildDebrief({
      sectionId: "air-brake",
      completedCount: score.correct,
      totalCount: score.correct + score.incorrect,
    }),
    [score.correct, score.incorrect],
  );

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advanceQuestion = useCallback(() => {
    clearTimer();
    answeredRef.current = false;
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(-1);
      setTimerExpired(false);
      setShowFeedback(false);
      setTimeLeft(PRESSURE_COUNTDOWN);
      timeLeftRef.current = PRESSURE_COUNTDOWN;
    } else {
      const finalCorrect = score.correct + (selected >= 0 && options[selected] === question.stepTitle ? 1 : 0);
      const finalIncorrect = score.incorrect + ((selected < 0 || options[selected] !== question.stepTitle) ? 1 : 0);
      onStreakUpdate(finalCorrect === questions.length && finalIncorrect === 0);
      setScore({
        correct: finalCorrect,
        incorrect: finalIncorrect,
      });
      setFinished(true);
    }
  }, [clearTimer, currentQ, questions.length, score.correct, score.incorrect, selected, options, question.stepTitle, onStreakUpdate]);

  // Start countdown when quiz starts
  useEffect(() => {
    if (!quizStarted || finished) return;
    if (selected >= 0 || timerExpired) return;

    timeLeftRef.current = PRESSURE_COUNTDOWN;

    intervalRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);

      if (timeLeftRef.current <= 0) {
        clearTimer();
        setTimerExpired(true);
        setShowFeedback(true);
        if (!answeredRef.current) {
          answeredRef.current = true;
          setConsecutiveCorrect(0);
          setConsecutiveWrong((w) => w + 1);
          setScore((s) => ({ ...s, incorrect: s.incorrect + 1 }));
        }
      }
    }, 1000);

    return clearTimer;
  }, [quizStarted, currentQ, finished, selected, timerExpired, clearTimer]);

  const select = useCallback(
    (optIdx: number) => {
      if (answered || answeredRef.current) return;
      answeredRef.current = true;
      clearTimer();
      setSelected(optIdx);
      setShowFeedback(true);
      const correct = options[optIdx] === question.stepTitle;
      if (correct) {
        setConsecutiveWrong(0);
        setConsecutiveCorrect((c) => c + 1);
      } else {
        setConsecutiveCorrect(0);
        setConsecutiveWrong((w) => w + 1);
      }
      setScore((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        incorrect: s.incorrect + (correct ? 0 : 1),
      }));
    },
    [answered, clearTimer, options, question.stepTitle],
  );

  const timerColor = timeLeft >= 6 ? theme.colors.green : timeLeft >= 3 ? theme.colors.amber : theme.colors.red;

  const reset = useCallback(() => {
    clearTimer();
    answeredRef.current = false;
    setCurrentQ(0);
    setSelected(-1);
    setScore({ correct: 0, incorrect: 0 });
    setFinished(false);
    setTimeLeft(PRESSURE_COUNTDOWN);
    setTimerExpired(false);
    setShowFeedback(false);
    setQuizStarted(false);
    setConsecutiveWrong(0);
    setConsecutiveCorrect(0);
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  // ── Results View ──
  if (finished) {
    const total = score.correct + score.incorrect;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;

    let confidenceLevel: ConfidenceLevel;
    let resultMessage: string;
    let resultSubMessage: string;

    if (pct === 100) {
      confidenceLevel = "Test Ready";
      resultMessage = perfectScoreMessage;
      resultSubMessage = "Your recall is becoming automatic.";
    } else if (pct >= 75) {
      confidenceLevel = "Building";
      resultMessage = "Great job!";
      resultSubMessage = "One more round and you'll have it.";
    } else {
      confidenceLevel = "Learning";
      resultMessage = "Keep practicing.";
      resultSubMessage = "Repetition builds confidence.\nTry another round.";
    }

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modeTitle}>Pressure Recall</Text>

          <View style={styles.resultCard}>
            <Timer color={theme.colors.amber} size={44} strokeWidth={2.2} />
            <Text style={styles.resultPercent}>{pct}%</Text>

            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatNum}>{score.correct}</Text>
                <Text style={styles.resultStatLabel}>Correct</Text>
              </View>
              <View style={styles.resultStatDivider} />
              <View style={styles.resultStat}>
                <Text style={[styles.resultStatNum, { color: theme.colors.red }]}>
                  {score.incorrect}
                </Text>
                <Text style={styles.resultStatLabel}>Incorrect</Text>
              </View>
            </View>

            <Text style={[styles.resultScoreLabel, { color: pct === 100 ? theme.colors.green : pct >= 75 ? theme.colors.amber : theme.colors.red }]}>
              {resultMessage}
            </Text>
            <Text style={styles.resultLabel}>{resultSubMessage}</Text>

            <View style={styles.confidenceBadge}>
              <Trophy
                color={pct === 100 ? theme.colors.green : pct >= 75 ? theme.colors.amber : theme.colors.textFaint}
                size={20}
              />
              <Text
                style={[
                  styles.confidenceText,
                  {
                    color: pct === 100 ? theme.colors.green : pct >= 75 ? theme.colors.amber : theme.colors.textMuted,
                  },
                ]}
              >
                Confidence: {confidenceLevel}
              </Text>
            </View>
          </View>

          {/* Coach William's Tip */}
          <View style={styles.tipCard}>
            <Text style={styles.tipBadge}>Coach William Says:</Text>
            <Text style={styles.tipText}>"{tip}"</Text>
          </View>

          {/* Coffee Break */}
          <View style={styles.coffeeBreakCard}>
            <View style={styles.coffeeBreakHeader}>
              <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
            </View>
            <Text style={styles.coffeeBreakText}>
              "{coffee}"
            </Text>
          </View>

          {/* Coach William's Debrief */}
          <View style={styles.debriefCard}>
            <View style={styles.debriefHeader}>
              <Text style={styles.debriefBadge}>Coach William's Debrief</Text>
            </View>
            <Text style={styles.debriefText}>
              {debrief}
            </Text>
          </View>

          {/* Sign-off */}
          <Text style={styles.signOffText}>{signOff}</Text>

          {/* Streak indicator */}
          {streakCount > 0 && (
            <View style={styles.streakRow}>
              <Award color={theme.colors.amber} size={18} />
              <Text style={styles.streakText}>
                {streakCount} perfect round{streakCount > 1 ? "s" : ""} in a row
              </Text>
            </View>
          )}

          <View style={styles.recallNav}>
            <Pressable
              onPress={reset}
              style={({ pressed }) => [
                styles.navButton,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.navButtonText}>Try Again</Text>
            </Pressable>
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.navButton,
                styles.navButtonPrimary,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.navButtonPrimaryText}>Back to Menu</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Quiz View ──
  if (!quizStarted) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 60, justifyContent: "center", flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={onBack} style={styles.backRow}>
            <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
            <Text style={styles.backLabel}>Training Menu</Text>
          </Pressable>

          <Text style={styles.modeTitle}>Pressure Recall</Text>
          <Text style={styles.modeSubtitle}>
            This mode prepares you to perform under the pressure of the actual CDL
            examination. You have 10 seconds to answer each question.
          </Text>

          <View style={styles.pressureIntro}>
            <View style={styles.pressureIntroItem}>
              <Text style={styles.pressureIntroNum}>4</Text>
              <Text style={styles.pressureIntroLabel}>Questions</Text>
            </View>
            <View style={styles.pressureIntroItem}>
              <Text style={styles.pressureIntroNum}>{PRESSURE_COUNTDOWN}s</Text>
              <Text style={styles.pressureIntroLabel}>Per Question</Text>
            </View>
            <View style={styles.pressureIntroItem}>
              <Text style={styles.pressureIntroNum}>1</Text>
              <Text style={styles.pressureIntroLabel}>Chance Each</Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              setQuizStarted(true);
              setTimeLeft(PRESSURE_COUNTDOWN);
            }}
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.cardPressed,
            ]}
          >
            <Timer color={theme.colors.white} size={26} />
            <Text style={styles.startButtonText}>Start Pressure Recall</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Training Menu</Text>
        </Pressable>

        <View style={styles.pressureHeader}>
          <Text style={styles.modeTitle}>Pressure Recall</Text>
          <View style={[styles.timerBadge, { borderColor: timerColor }]}>
            <Text style={[styles.timerText, { color: timerColor }]}>
              {timerExpired ? "0" : timeLeft}
            </Text>
          </View>
        </View>

        <View style={styles.scoreBar}>
          <Text style={styles.scoreText}>
            Correct: {score.correct}
          </Text>
          <Text style={styles.progressLabel}>
            Question {currentQ + 1} of {questions.length}
          </Text>
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.quizPrompt}>Which Air Brake Test is this?</Text>
          <Text style={styles.quizDesc}>{question.description}</Text>
        </View>

        {timerExpired && (
          <View style={styles.timeoutBanner}>
            <Text style={styles.timeoutText}>Time's Up!</Text>
          </View>
        )}

        <View style={styles.quizOptions}>
          {options.map((optTitle, i) => {
            let bgColor: string = theme.colors.surface;
            let borderColor: string = theme.colors.border;
            if (showFeedback) {
              if (optTitle === question.stepTitle) {
                bgColor = theme.colors.greenSoft;
                borderColor = theme.colors.green;
              } else if (i === selected && optTitle !== question.stepTitle) {
                bgColor = theme.colors.redSoft;
                borderColor = theme.colors.red;
              }
            }

            return (
              <Pressable
                key={`quiz-option-${i}`}
                onPress={() => select(i)}
                disabled={answered}
                style={({ pressed }) => [
                  styles.quizOption,
                  { backgroundColor: bgColor, borderColor },
                  pressed && !answered && styles.cardPressed,
                ]}
              >
                <Text style={styles.quizOptionLetter}>
                  {String.fromCharCode(65 + i)}
                </Text>
                <Text style={styles.quizOptionText}>{optTitle}</Text>
              </Pressable>
            );
          })}
        </View>

        {showFeedback && (
          <View style={styles.feedbackCard}>
            <Text
              style={[
                styles.feedbackResult,
                { color: isCorrect ? theme.colors.green : theme.colors.red },
              ]}
            >
              {isCorrect ? "Correct!" : timerExpired ? "Time's Up!" : "Incorrect"}
            </Text>
            {!isCorrect && (
              <Text style={styles.feedbackExplanation}>
                Correct answer: {question.stepTitle}
              </Text>
            )}
            <View style={styles.encouragementRow}>
              <View style={styles.encouragementDot} />
              <Text style={styles.encouragementText}>
                {isCorrect
                  ? consecutiveCorrect >= 2
                    ? getCorrectStreak()
                    : getCorrectEncouragement()
                  : getMistakeEncouragement(consecutiveWrong)}
              </Text>
            </View>
            <Pressable
              onPress={advanceQuestion}
              style={({ pressed }: { pressed: boolean }) => [
                styles.pressureNextButton,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.pressureNextButtonText}>
                {isLastQ ? "See Results" : "Next Question"}
              </Text>
              <ArrowRight color={theme.colors.white} size={22} strokeWidth={2.5} />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ── Coach William's Challenge ───────────────────────────────────────────────

function ChallengeView({ onBack, onResetStreak }: { onBack: () => void; onResetStreak: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Training Menu</Text>
        </Pressable>

        <View style={styles.challengeHeader}>
          <Trophy color={theme.colors.amber} size={52} strokeWidth={2} />
          <Text style={styles.challengeTitle}>Coach William's Challenge</Text>
        </View>

        <Text style={styles.challengeSubtitle}>
          You scored 100% three times in a row. You are ready for the ultimate test.
        </Text>

        <View style={styles.challengeCard}>
          <Text style={styles.challengeInstruction}>
            Without looking at your notes, say all four Air Brake Tests in reverse
            order.
          </Text>
          <Text style={styles.challengeInstruction}>
            Then say all four in forward order.
          </Text>
          <Text style={styles.challengeInstruction}>
            Then have someone ask them in random order.
          </Text>
        </View>

        <Text style={styles.challengeFooter}>
          This challenge is designed to prepare you for the real CDL Air Brake
          Test. If you can do this, you are ready.
        </Text>

        <Pressable
          onPress={() => {
            onResetStreak();
            onBack();
          }}
          style={({ pressed }) => [
            styles.challengeDoneButton,
            pressed && styles.cardPressed,
          ]}
        >
          <Award color={theme.colors.background} size={22} />
          <Text style={styles.challengeDoneText}>Challenge Complete</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ── Mock Test ───────────────────────────────────────────────────────────────

function MockTestView({ onBack, goTo }: { onBack: () => void; goTo: (m: Mode) => void }) {
  const insets = useSafeAreaInsets();

  // Pick random coach messages once so they don't re-randomize on every render.
  const coffee = useMemo(() => randomCoffeeBreak(), []);
  const signOff = useMemo(() => randomSignOff(), []);

  const mockQuestions = useMemo(
    () => [
      {
        q: "What is the first step in the air brake test?",
        options: [
          "Fan the brakes",
          "Turn the truck off",
          "Check the gauges",
          "Start the engine",
        ],
        correct: 1,
      },
      {
        q: "How much air loss is allowed during the Air Leakage Rate Test?",
        options: [
          "No more than 2 PSI",
          "No more than 4 PSI",
          "No more than 6 PSI",
          "No more than 10 PSI",
        ],
        correct: 1,
      },
      {
        q: "When should the low air warning buzzer and light come on?",
        options: [
          "Before 75 PSI",
          "Before 65 PSI",
          "Before 55 PSI",
          "After 45 PSI",
        ],
        correct: 2,
      },
      {
        q: "At what pressure range should the parking brake valves pop out?",
        options: [
          "60 to 40 PSI",
          "55 to 30 PSI",
          "45 to 20 PSI",
          "30 to 10 PSI",
        ],
        correct: 2,
      },
      {
        q: "After pushing in the parking brake valves, what should you do next?",
        options: [
          "Start the engine",
          "Hold the service brake for one minute",
          "Fan the brakes immediately",
          "Turn the key off",
        ],
        correct: 1,
      },
    ],
    [],
  );

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState<number>(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);

  // Debrief depends on the final score — only recompute when score changes.
  const debrief = useMemo(
    () => buildDebrief({
      sectionId: "air-brake",
      completedCount: score.correct,
      totalCount: score.correct + score.incorrect,
    }),
    [score.correct, score.incorrect],
  );

  const question = mockQuestions[current];
  const answered = selected >= 0;
  const isCorrect = selected >= 0 && selected === question.correct;
  const isLast = current === mockQuestions.length - 1;

  const select = useCallback(
    (optIdx: number) => {
      if (answered) return;
      setSelected(optIdx);
      setShowFeedback(true);
      setUserAnswers((prev) => [...prev, optIdx]);
      const correct = optIdx === question.correct;
      if (correct) {
        setConsecutiveWrong(0);
        setConsecutiveCorrect((c) => c + 1);
      } else {
        setConsecutiveCorrect(0);
        setConsecutiveWrong((w) => w + 1);
      }
      setScore((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        incorrect: s.incorrect + (correct ? 0 : 1),
      }));
    },
    [answered, question.correct],
  );

  const advanceQuestion = useCallback(() => {
    if (!isLast) {
      setCurrent((c) => c + 1);
      setSelected(-1);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  }, [isLast]);

  const reset = useCallback(() => {
    setCurrent(0);
    setSelected(-1);
    setShowFeedback(false);
    setScore({ correct: 0, incorrect: 0 });
    setUserAnswers([]);
    setFinished(false);
    setConsecutiveWrong(0);
    setConsecutiveCorrect(0);
  }, []);

  if (finished) {
    const correctCount = score.correct;
    const incorrectCount = score.incorrect;
    const total = mockQuestions.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modeTitle}>Mock Test Results</Text>
          <View style={styles.resultCard}>
            <ClipboardCheck
              color={pct >= 80 ? theme.colors.green : theme.colors.amber}
              size={44}
              strokeWidth={2.2}
            />
            <Text style={styles.resultPercent}>{pct}%</Text>
            <Text style={styles.resultLabel}>
              {correctCount} of {total} correct
            </Text>
            {pct >= 80 ? (
              <Text style={styles.encouragementText}>
                {pct === 100 ? perfectScoreMessage : "Great job! You are ready for the real test."}
              </Text>
            ) : (
              <Text style={styles.encouragementText}>
                Keep practicing. Accuracy first, speed later.
              </Text>
            )}
          </View>

          <Text style={styles.reviewTitle}>Review</Text>
          {mockQuestions.map((mq, i) => {
            const userAnswer = userAnswers[i];
            const isAnswerCorrect = userAnswer === mq.correct;
            return (
              <View
                key={`review-q-${i}`}
                style={[
                  styles.reviewCard,
                  {
                    borderColor: isAnswerCorrect
                      ? theme.colors.green
                      : theme.colors.red,
                  },
                ]}
              >
                <Text style={styles.reviewQ}>
                  {i + 1}. {mq.q}
                </Text>
                <Text
                  style={[
                    styles.reviewA,
                    { color: isAnswerCorrect ? theme.colors.green : theme.colors.red },
                  ]}
                >
                  Your answer: {mq.options[userAnswer]}
                </Text>
                {!isAnswerCorrect && (
                  <Text style={[styles.reviewA, { color: theme.colors.green }]}>
                    Correct: {mq.options[mq.correct]}
                  </Text>
                )}
              </View>
            );
          })}

          <View style={styles.recallNav}>
            <Pressable
              onPress={reset}
              style={({ pressed }) => [
                styles.navButton,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.navButtonText}>Retake Mock Test</Text>
            </Pressable>
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.navButton,
                styles.navButtonPrimary,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.navButtonPrimaryText}>Back to Menu</Text>
            </Pressable>
          </View>

          {/* Coffee Break */}
          <View style={styles.coffeeBreakCard}>
            <View style={styles.coffeeBreakHeader}>
              <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
            </View>
            <Text style={styles.coffeeBreakText}>
              "{coffee}"
            </Text>
          </View>

          {/* Debrief */}
          <View style={styles.debriefCard}>
            <View style={styles.debriefHeader}>
              <Text style={styles.debriefBadge}>Coach William's Debrief</Text>
            </View>
            <Text style={styles.debriefText}>
              {debrief}
            </Text>
          </View>

          <Text style={styles.signOffText}>{signOff}</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backRow}>
          <ChevronLeft color={theme.colors.amber} size={22} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Training Menu</Text>
        </Pressable>

        <Text style={styles.modeTitle}>Mock Test</Text>
        <Text style={styles.progressLabel}>
          Question {current + 1} of {mockQuestions.length}
        </Text>

        <View style={styles.quizCard}>
          <Text style={styles.quizQ}>{question.q}</Text>
        </View>

        <View style={styles.quizOptions}>
          {question.options.map((opt, i) => {
            let bgColor: string = theme.colors.surface;
            let borderColor: string = theme.colors.border;
            if (showFeedback) {
              if (i === question.correct) {
                bgColor = theme.colors.greenSoft;
                borderColor = theme.colors.green;
              } else if (i === selected && i !== question.correct) {
                bgColor = theme.colors.redSoft;
                borderColor = theme.colors.red;
              }
            }
            return (
              <Pressable
                key={`exam-option-${i}`}
                onPress={() => select(i)}
                disabled={answered}
                style={({ pressed }) => [
                  styles.quizOption,
                  { backgroundColor: bgColor, borderColor },
                  pressed && !answered && styles.cardPressed,
                ]}
              >
                <Text style={styles.quizOptionLetter}>
                  {String.fromCharCode(65 + i)}
                </Text>
                <Text style={styles.quizOptionText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {showFeedback && (
          <View style={styles.feedbackCard}>
            <Text
              style={[
                styles.feedbackResult,
                { color: isCorrect ? theme.colors.green : theme.colors.red },
              ]}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </Text>
            {!isCorrect && (
              <Text style={styles.feedbackExplanation}>
                Correct answer: {question.options[question.correct]}
              </Text>
            )}
            <View style={styles.encouragementRow}>
              <View style={styles.encouragementDot} />
              <Text style={styles.encouragementText}>
                {isCorrect
                  ? consecutiveCorrect >= 3
                    ? getCorrectStreak()
                    : getCorrectEncouragement()
                  : getMistakeEncouragement(consecutiveWrong)}
              </Text>
            </View>
            <Pressable
              onPress={advanceQuestion}
              style={({ pressed }: { pressed: boolean }) => [
                styles.pressureNextButton,
                pressed && styles.cardPressed,
              ]}
            >
              <Text style={styles.pressureNextButtonText}>
                {isLast ? "See Results" : "Next Question"}
              </Text>
              <ArrowRight color={theme.colors.white} size={22} strokeWidth={2.5} />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────

export default function AirBrakeCoachScreen() {
  const insets = useSafeAreaInsets();
  // Allow deep-linking into a specific training mode, e.g. /air-brake?mode=mock
  const params = useLocalSearchParams<{ mode?: string }>();
  const initialMode: Mode =
    params.mode === "mock" ||
    params.mode === "learn" ||
    params.mode === "forward" ||
    params.mode === "reverse" ||
    params.mode === "random" ||
    params.mode === "pressure" ||
    params.mode === "challenge"
      ? (params.mode as Mode)
      : "menu";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [streakCount, setStreakCount] = useState(0);
  const [challengeUnlocked, setChallengeUnlocked] = useState(false);

  // Pick the random menu messages once on mount so they don't re-randomize
  // on every render (e.g. when streak/challenge state changes).
  const wisdom = useMemo(() => randomTruckerWisdom(), []);
  const menuCoffee = useMemo(() => randomCoffeeBreak(), []);
  const menuCorner = useMemo(() => randomCornerMessage(), []);

  const goTo = useCallback((m: Mode) => setMode(m), []);
  const goBack = useCallback(() => setMode("menu"), []);

  const handleStreakUpdate = useCallback(
    (perfect: boolean) => {
      if (perfect) {
        const next = streakCount + 1;
        setStreakCount(next);
        if (next >= 3) {
          setChallengeUnlocked(true);
        }
      } else {
        setStreakCount(0);
      }
    },
    [streakCount],
  );

  const handleResetStreak = useCallback(() => {
    setStreakCount(0);
    setChallengeUnlocked(false);
  }, []);

  // ── Menu View ──
  if (mode === "menu") {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + theme.spacing.md, paddingBottom: insets.bottom + 50 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>Air Brake Test Coach</Text>

          <Text style={styles.intro}>
            Welcome to the Air Brake Test Coach. We are going to learn the test,
            say it forward, say it backward, answer random questions, then build
            speed. Accuracy comes first. Speed comes with practice.
          </Text>

          {/* ── Kirkland Rapid Recall Method ── */}
          <View style={styles.methodCard}>
            <Text style={styles.methodTitle}>
              Kirkland Rapid Recall Method™
            </Text>
            <Text style={styles.methodBody}>
              Knowing the information once isn't enough.
            </Text>
            <Text style={[styles.methodBody, { marginBottom: 10 }]}>
              Professional CDL drivers must be able to recall important information quickly, accurately, and under pressure.
            </Text>
            <Text style={[styles.methodBody, { marginBottom: 6 }]}>
              The Kirkland Rapid Recall Method™ strengthens memory through:
            </Text>
            <View style={styles.methodList}>
              <Text style={styles.methodBullet}>
                {"\u2022 Forward Recall"}
              </Text>
              <Text style={styles.methodBullet}>
                {"\u2022 Backward Recall"}
              </Text>
              <Text style={styles.methodBullet}>
                {"\u2022 Random Recall"}
              </Text>
              <Text style={styles.methodBullet}>
                {"\u2022 Pressure Recall"}
              </Text>
            </View>
            <Text style={[styles.methodBody, { marginTop: 10 }]}>
              Take your time, stay focused, and build confidence through repetition.
            </Text>
          </View>

          {/* Trucker Wisdom */}
          <View style={styles.wisdomCard}>
            <Text style={styles.wisdomText}>
              "{wisdom}"
            </Text>
          </View>

          {/* Coach William's Challenge unlock */}
          {challengeUnlocked && (
            <Pressable
              onPress={() => goTo("challenge")}
              style={({ pressed }) => [
                styles.challengeUnlockCard,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.challengeUnlockIcon}>
                <Trophy color={theme.colors.amber} size={32} strokeWidth={2.2} />
              </View>
              <View style={styles.challengeUnlockText}>
                <Text style={styles.challengeUnlockTitle}>
                  Coach William's Challenge
                </Text>
                <Text style={styles.challengeUnlockSubtitle}>
                  You earned it! 3 perfect rounds in a row.
                </Text>
              </View>
              <ArrowRight color={theme.colors.amber} size={22} />
            </Pressable>
          )}

          <Text style={styles.sectionLabel}>TRAINING MODES</Text>

          <View style={styles.trainingList}>
            {trainingModes.map((tm) => {
              const Icon = tm.icon;
              return (
                <Pressable
                  key={tm.id}
                  onPress={() => goTo(tm.id as Mode)}
                  style={({ pressed }) => [
                    styles.trainingCard,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.trainingIcon,
                      { backgroundColor: tm.accent + "22" },
                    ]}
                  >
                    <Icon color={tm.accent} size={30} strokeWidth={2.2} />
                  </View>
                  <View style={styles.trainingText}>
                    <Text style={styles.trainingTitle}>{tm.title}</Text>
                    <Text style={styles.trainingSubtitle}>{tm.subtitle}</Text>
                  </View>
                  <ArrowRight color={theme.colors.textFaint} size={22} />
                </Pressable>
              );
            })}
          </View>

          {/* Coffee Break */}
          <View style={styles.coffeeBreakCard}>
            <View style={styles.coffeeBreakHeader}>
              <Text style={styles.coffeeBreakBadge}>Coffee Break</Text>
            </View>
            <Text style={styles.coffeeBreakText}>
              "{menuCoffee}"
            </Text>
          </View>

          {/* Coach William's Corner */}
          <View style={styles.coachCornerCard}>
            <View style={styles.coachCornerHeader}>
              <Text style={styles.coachCornerBadge}>Coach William's Corner</Text>
            </View>
            <Text style={styles.coachCornerText}>
              "{menuCorner}"
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Sub-views ──
  switch (mode) {
    case "learn":
      return <LearnView onBack={goBack} goTo={goTo} />;
    case "forward":
      return <ForwardRecallView onBack={goBack} goTo={goTo} />;
    case "reverse":
      return <ReverseRecallView onBack={goBack} goTo={goTo} />;
    case "random":
      return <RandomRecallView onBack={goBack} goTo={goTo} />;
    case "pressure":
      return (
        <PressureRecallView
          onBack={goBack}
          goTo={goTo}
          streakCount={streakCount}
          onStreakUpdate={handleStreakUpdate}
        />
      );
    case "mock":
      return <MockTestView onBack={goBack} goTo={goTo} />;
    case "challenge":
      return <ChallengeView onBack={goBack} onResetStreak={handleResetStreak} />;
  }
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.md,
  },

  // ── Menu ──
  screenTitle: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  methodBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.amberSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
  },
  methodBadgeText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800",
  },
  methodCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
  },
  methodTitle: {
    color: theme.colors.amber,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  methodBody: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },
  methodList: {
    gap: 4,
  },
  methodBullet: {
    color: theme.colors.amber,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },
  intro: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: theme.spacing.sm,
  },
  trainingList: {
    gap: theme.spacing.sm,
  },
  trainingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.985 }],
  },
  trainingIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  trainingText: {
    flex: 1,
  },
  trainingTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  trainingSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    marginTop: 3,
    lineHeight: 20,
  },

  // ── Challenge unlock on menu ──
  challengeUnlockCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  challengeUnlockIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.amber + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  challengeUnlockText: {
    flex: 1,
  },
  challengeUnlockTitle: {
    color: theme.colors.amber,
    fontSize: 18,
    fontWeight: "900",
  },
  challengeUnlockSubtitle: {
    color: theme.colors.amberDark,
    fontSize: 15,
    marginTop: 2,
    fontWeight: "600",
  },

  // ── Shared sub-views ──
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: theme.spacing.md,
    alignSelf: "flex-start",
    ...Platform.select({ web: { cursor: "pointer" as const }, default: {} }),
  },
  backLabel: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "700",
  },
  modeTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4,
  },
  modeSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  progressLabel: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800",
  },

  // ── Learn ──
  learnSteps: {
    gap: 0,
  },
  learnCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  learnBadge: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  learnBadgeText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  learnTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  learnDesc: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  encouragementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: 4,
  },
  encouragementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.green,
    marginTop: 7,
  },
  encouragementText: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    flex: 1,
    lineHeight: 20,
  },
  learnDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
    marginLeft: 24,
  },
  doneButton: {
    alignSelf: "center",
    backgroundColor: theme.colors.amber,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    paddingHorizontal: 36,
    marginTop: theme.spacing.lg,
  },
  doneButtonText: {
    color: theme.colors.background,
    fontSize: 17,
    fontWeight: "800",
  },

  // ── Forward / Reverse Recall ──
  recallList: {
    gap: 0,
  },
  recallListItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recallListItemContent: {
    marginTop: theme.spacing.sm,
  },
  recallTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  recallArrow: {
    alignItems: "center",
    paddingVertical: 8,
  },
  recallHint: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginTop: theme.spacing.lg,
  },
  recallHintText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    textAlign: "center",
  },

  // ── Recall Nav ──
  recallNav: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navButtonPrimary: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue,
  },
  navButtonPrimaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  navButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  // ── Random / Quiz shared ──
  scoreBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.sm,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  scoreText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  scorePercent: {
    color: theme.colors.green,
    fontSize: 18,
    fontWeight: "900",
  },
  quizCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  quizPrompt: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  quizDesc: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "600",
  },
  quizQ: {
    color: theme.colors.text,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  quizOptions: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  quizOption: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: theme.spacing.md,
    borderRadius: theme.radius.md,
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
  },
  quizOptionLetter: {
    color: theme.colors.textFaint,
    fontSize: 16,
    fontWeight: "900",
    width: 24,
  },
  quizOptionText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  quizActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },

  // ── Pressure Recall ──
  pressureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressureIntro: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  pressureIntroItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressureIntroNum: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  pressureIntroLabel: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  timerBadge: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 2,
    borderRadius: theme.radius.pill,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 26,
    fontWeight: "900",
  },
  timeoutBanner: {
    backgroundColor: theme.colors.redSoft,
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.red,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  timeoutText: {
    color: theme.colors.red,
    fontSize: 20,
    fontWeight: "900",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: theme.colors.red,
    borderRadius: theme.radius.md,
    paddingVertical: 24,
    marginTop: theme.spacing.lg,
  },
  startButtonText: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: "900",
  },
  speedNextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.colors.blue,
    borderRadius: theme.radius.md,
    paddingVertical: 18,
    marginTop: theme.spacing.sm,
  },
  speedNextText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "800",
  },

  // ── Pressure Recall Next Question button (in feedback card) ──
  pressureNextButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 10,
    backgroundColor: theme.colors.blue,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    marginTop: theme.spacing.md,
  },
  pressureNextButtonText: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: "800",
  },

  // ── Coach William's Corner / Debrief / Sign-off (shared) ──
  coachCornerCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginTop: theme.spacing.lg,
  },
  coachCornerHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 10,
  },
  coachCornerBadge: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  coachCornerText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic" as const,
    lineHeight: 23,
  },
  signOffText: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center" as const,
    marginTop: theme.spacing.lg,
  },

  // ── Results ──
  resultCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  resultPercent: {
    color: theme.colors.amber,
    fontSize: 42,
    fontWeight: "900",
  },
  resultLabel: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
    lineHeight: 22,
  },
  resultStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
    gap: 16,
    marginTop: 4,
  },
  resultStat: {
    alignItems: "center",
    flex: 1,
  },
  resultStatNum: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  resultStatLabel: {
    color: theme.colors.textFaint,
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  resultScoreLabel: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
  },
  confidenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  confidenceText: {
    fontSize: 15,
    fontWeight: "800",
  },

  // ── Coach William's Tip ──
  tipCard: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.amberDark,
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  tipBadge: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  tipText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },

  // ── Streak ──
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  streakText: {
    color: theme.colors.amber,
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Challenge ──
  challengeHeader: {
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  challengeTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },
  challengeSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  challengeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  challengeInstruction: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "600",
  },
  challengeFooter: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  challengeDoneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.colors.amber,
    borderRadius: theme.radius.md,
    paddingVertical: 20,
  },
  challengeDoneText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: "900",
  },

  // ── Mock Test ──
  reviewTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
  },
  reviewQ: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  reviewA: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },

  // ── Feedback (shared) ──
  feedbackCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },
  feedbackResult: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  feedbackExplanation: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },

  // ── Learn → Remember → Perform framework ──
  frameworkRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
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

  // ── Trucker Wisdom ──
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
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    lineHeight: 20,
  },

  // ── Coffee Break ──
  coffeeBreakCard: {
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.green,
    marginTop: theme.spacing.md,
  },
  coffeeBreakHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 8,
  },
  coffeeBreakBadge: {
    color: theme.colors.green,
    fontSize: 15,
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  coffeeBreakText: {
    color: theme.colors.green,
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
    flexDirection: "row" as const,
    alignItems: "center" as const,
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
});
