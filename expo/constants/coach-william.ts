/**
 * Coach William — the heart of CDL Inspection Coach.
 * Friendly, encouraging, professional, safety-focused, and authentic.
 * Every message reduces anxiety, builds confidence, and makes learning
 * enjoyable through coaching, repetition, positive reinforcement,
 * and authentic truck driver humor.
 */

// ── Branding ─────────────────────────────────────────────────────────────────

export const appBrand = "Coach William's Rapid Recall System";
export const appSubtitle = "CDL Inspection Coach";
export const appTagline = "Building Safe, Confident Professional Drivers.";

// ── Welcome ─────────────────────────────────────────────────────────────────

export const welcomeTitle = "Good Morning, Driver!";
export const welcomeHeading = "Welcome to Coach William's Rapid Recall System";

export const coachWilliamGreeting =
  "Grab your coffee and pull up a chair.\n\nEvery professional driver started exactly where you are today.\n\nLet's build your confidence one step at a time.";

// ── Coach William's Corner (between lessons / after quizzes) ─────────────────

export const coachCornerMessages: string[] = [
  "Morning, Driver! Grab your coffee and let's build another professional truck driver.",
  "Keep the shiny side up... and the dirty side down.",
  "Hammer down... AFTER you pass your inspection!",
  "All for one and both for each!",
  "The examiner isn't looking for perfection. They're looking for confidence.",
  "Every professional driver started exactly where you are.",
  "Let's put another tool in your toolbox.",
  "One more round and you'll know this better than your favorite truck stop menu.",
  "Easy there, Driver. Even the best miss a gear now and then.",
  "Let's make sure these brakes work BEFORE we chase freight.",
];

// ── Coffee Break with Coach William (after completing a lesson) ──────────────

export const coffeeBreakMessages: string[] = [
  "Grab another sip of coffee... you're doing great.",
  "Every professional driver was once a beginner.",
  "One lesson at a time... one mile at a time.",
  "Confidence comes from preparation.",
  "Let's keep rolling.",
  "Take a breather, Driver. You've earned it.",
  "That coffee's getting cold. Good thing you're warming up those inspection skills.",
  "Stretch your legs, check your mirrors, then let's get back after it.",
];

// ── Coach William's Trucker Wisdom (authentic sayings) ──────────────────────

export const truckerWisdomMessages: string[] = [
  "Keep the shiny side up... and the dirty side down.",
  "Hammer down... AFTER you pass your inspection.",
  "Let's put another tool in your toolbox.",
  "Easy there, Driver. Even the best miss a gear now and then.",
  "The truck can wait. Safety can't.",
  "A good driver checks twice and drives once.",
  "Every mile starts with a solid pre-trip.",
  "Your inspection is your first line of defense.",
  "Drive like your grandbaby is in the next lane.",
  "Good judgment comes from experience. Experience comes from practice.",
];

// ── Coach William's Tips (after rounds) ──────────────────────────────────────

export const coachWilliamTips: string[] = [
  "Accuracy first. Speed comes later.",
  "Say it out loud. Hearing yourself helps build recall.",
  "If you can say it backward, you really know it.",
  "Confidence comes from preparation.",
  "Every repetition makes you stronger.",
  "You've got this.",
];

// ── Coach William's Encouragement ────────────────────────────────────────────

/** Non-repeating random picker. Tracks last index per pool internally. */
function pickFromPool(pool: string[], lastRef: { idx: number }): string {
  if (pool.length === 0) return "Keep going.";
  if (pool.length === 1) return pool[0];
  let idx = Math.floor(Math.random() * pool.length);
  // Avoid repeating the same phrase back-to-back
  if (idx === lastRef.idx) {
    idx = (idx + 1) % pool.length;
  }
  lastRef.idx = idx;
  return pool[idx];
}

// Per-pool last-picked index references (module-level so no phrase repeats back-to-back)
const _lastCorrect = { idx: -1 };
const _lastCorrectStreak = { idx: -1 };
const _lastLongStreak = { idx: -1 };
const _lastHighAchievement = { idx: -1 };
const _lastGeneral = { idx: -1 };
const _lastMistakeTiers: Record<number, { idx: number }> = {};

function mistakeLastRef(tier: number): { idx: number } {
  if (!_lastMistakeTiers[tier]) _lastMistakeTiers[tier] = { idx: -1 };
  return _lastMistakeTiers[tier];
}

// ── Correct Answers ─────────────────────────────────────────────────────────

export const encouragementCorrect: string[] = [
  "Excellent, Hero!",
  "Awesome!",
  "10-4, I heard that!",
  "10-4, Big Dawg!",
];

// ── Correct Streak (3–5 correct in a row) ─────────────────────────────────────

export const encouragementCorrectStreak: string[] = [
  "Rock Star!",
  "Now you're showing off!",
  "You're on a roll!",
  "Keep it up, Hero!",
  "You're as smart as you look!",
];

// ── Long Streak (10+ correct in a row) ────────────────────────────────────────

export const encouragementLongStreak: string[] = [
  "Outstanding, Big Dawg!",
  "You're making this look easy!",
  "That's the way professional drivers do it!",
  "CDL Examiner...watch out!",
  "You're ready to impress that examiner!",
];

// ── High Achievement ─────────────────────────────────────────────────────────

/** Perfect score — all questions answered correctly. */
export const perfectScoreMessage =
  "🏆 Outstanding, Hero!\n\nThat's exactly the kind of performance we're looking for.\n\nYou didn't just memorize the inspection...\n\nYou understood it.\n\nGrab a cup of coffee...\n\nI think you're ready for the CDL Skills Test!";

export const encouragementHighAchievement: string[] = [
  "Now you're showing off!",
  "Don't let it go to your head.",
  "Rock Star!",
  "I'd hire you to drive my truck!",
  "You're making this look easy.",
  "That's exactly what the examiner wants to hear.",
  "I'd be proud to have you on my driving team.",
  "You're becoming a professional driver.",
  "That's textbook perfect!",
];

// ── Tiered Incorrect Answer Encouragement ────────────────────────────────────

export const encouragementMistakeFirst: string[] = [
  "Nope...try again.",
  "C'mon, Hero...you got this.",
];

export const encouragementMistakeThird: string[] = [
  "Adjust, Adapt and Overcome.",
  "Don't give up now.",
  "Every great driver started where you are.",
  "Don't be THAT guy.",
];

export const encouragementMistakeFourth: string[] = [
  "Hero...Winners never Quit and Quitters never Win. Let's do it again.",
  "Hero...Don't be THAT guy. Let's get this right before test day.",
];

// ── General Coaching (throughout lessons) ────────────────────────────────────

export const encouragementGeneral: string[] = [
  "Keep the shiny side up... and the dirty side down.",
  "Grab another sip of coffee—we're making progress.",
  "One step at a time.",
  "Professional drivers build good habits.",
  "Confidence comes from preparation.",
];

// ── Public Picker Functions ──────────────────────────────────────────────────

/** Pick a random encouragement for a correct answer. */
export function getCorrectEncouragement(): string {
  return pickFromPool(encouragementCorrect, _lastCorrect);
}

/** Pick a random correct-streak encouragement (3–5 correct in a row). */
export function getCorrectStreak(): string {
  return pickFromPool(encouragementCorrectStreak, _lastCorrectStreak);
}

/** Pick a random long-streak encouragement (10+ correct in a row). */
export function getLongStreak(): string {
  return pickFromPool(encouragementLongStreak, _lastLongStreak);
}

/** Pick a random high-achievement encouragement (perfect score, streak, difficult section). */
export function getHighAchievement(): string {
  return pickFromPool(encouragementHighAchievement, _lastHighAchievement);
}

/**
 * Pick a tiered encouragement for an incorrect answer.
 * Tier 1 = first mistake, Tier 2 = second consecutive, Tier 3 = third, Tier 4+ = fourth or more.
 */
export function getMistakeEncouragement(consecutiveMistakes: number): string {
  // Tier 1 (1st mistake): first incorrect pool
  // Tier 2 (2nd mistake): same first-incorrect pool (no special tier for mistake 2)
  // Tier 3 (3rd mistake): losing streak pool
  // Tier 4+ (4th+ mistake): continued losing streak pool
  const mappedTier = consecutiveMistakes >= 4 ? 4 : consecutiveMistakes >= 3 ? 3 : 1;
  const pool =
    mappedTier === 4 ? encouragementMistakeFourth
    : mappedTier === 3 ? encouragementMistakeThird
    : encouragementMistakeFirst;
  return pickFromPool(pool, mistakeLastRef(mappedTier));
}

/** Pick a random general coaching phrase. */
export function getGeneralCoaching(): string {
  return pickFromPool(encouragementGeneral, _lastGeneral);
}

// ── Legacy compatibility (kept for backward compat with existing code) ───────

export type EncouragementType = "success" | "mistake" | "general";

/** @deprecated Use getCorrectEncouragement(), getMistakeEncouragement(), or getGeneralCoaching() instead. */
export function randomEncouragement(type: EncouragementType): string {
  if (type === "success") return getCorrectEncouragement();
  if (type === "mistake") return getMistakeEncouragement(1);
  return getGeneralCoaching();
}

// ── Coaching encouragement (after individual answers) ────────────────────────

export const coachingMessages: string[] = [
  "Nice work. You are building recall.",
  "Good job. Keep practicing.",
  "You've got this.",
  "Accuracy first. Speed comes with repetition.",
  "Every answer builds confidence.",
  "One step closer to your CDL.",
];

// ── Coach William's Debrief (end of every lesson) ────────────────────────────

export const debriefMessages: string[] = [
  "Excellent work today.\n\nYou're becoming more confident every round.",
  "Take a short break, grab another cup of coffee, and let's tackle the next lesson.",
  "Solid effort, Driver. That's how professionals are made.",
  "Every lesson you complete makes the real test feel more familiar.",
  "You're not just memorizing — you're building muscle memory.",
];

export const debriefNeedsPractice: string[] = [
  "I'd practice this section one more time before moving on.",
  "Let's run through this once more — repetition builds confidence.",
  "A little more practice here and you'll own it.",
  "Don't rush. Master this before tackling the next section.",
];

export const debriefNextLesson: Record<string, string> = {
  "in-cab": "Next up: Service Brake Test. Time to explain how we'd test the service brakes.",
  "service-brake": "Next up: Parking Brake (Tug) Test. Let's verify each parking brake holds.",
  "parking-brake-tug": "Next up: Air Brake Test Coach. That's where you'll learn the seven-step test.",
  "air-brake": "Next up: Light Operations Check. Let's verify every light on the rig.",
  "light-ops": "Next up: Front of Tractor Inspection. Lights, glass, and suspension.",
  "front": "Good overview, Hero! Now let's move to the Passenger Side Engine Compartment. We'll start broad and then inspect each component.",
  "passenger-side-engine": "Next up: Driver Side Engine Compartment. Now let's inspect each component in detail.",
  "engine": "Next up: Driver Side Inspection. Tires, wheels, door, mirror, fuel tank, and DEF tank.",
  "driver-side": "Next up: Rear of Tractor. Lights, floor, and frame structure.",
  "back": "Next up: CDL Numbers to Remember. Let's lock in those key numbers.",
  "cdl-numbers": "Next up: Coupling System. Where the tractor meets the trailer.",
  "coupling": "Now you know how to inspect the coupling system from the bottom up — air lines to locking jaws, nothing missed. Next up: Trailer Inspection. The last section of the pre-trip.",
  "trailer": "You've completed all inspection sections! Now try the Practice Test to put it all together.",
  "practice": "Great work on the quiz. Head back and review any sections where you missed questions.",
};

export function buildDebrief({
  sectionId,
  completedCount,
  totalCount,
}: {
  sectionId: string;
  completedCount: number;
  totalCount: number;
}): string {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const encouragement = debriefMessages[
    Math.floor(Math.random() * debriefMessages.length)
  ];

  const next = debriefNextLesson[sectionId] ?? "Keep practicing and you'll be ready for your CDL test in no time.";

  if (pct >= 80) {
    return `${encouragement}\n\nYou're making great progress on this section.\n\n${next}`;
  }

  const practice = debriefNeedsPractice[
    Math.floor(Math.random() * debriefNeedsPractice.length)
  ];

  return `${encouragement}\n\n${practice}\n\n${next}`;
}

// ── App Sign-off ─────────────────────────────────────────────────────────────

export const signOffMessages: string[] = [
  "See you down the road, Driver.",
  "Keep the shiny side up... and the dirty side down.",
  "Stay safe and keep learning.",
  "Learn. Recall. Practice. Pass.",
  "Coach William will see you next lesson.",
];

// ── Section completion (Kirkland Rapid Recall chunking) ───────────────────────

export const sectionCompletionMessages: string[] = [
  "Outstanding! One section down.",
  "One bite at a time. That's how professionals learn.",
  "Don't think about the whole inspection. Master one section at a time.",
  "You're building confidence every lesson.",
  "Small wins lead to complete mastery. Keep going.",
  "That section is yours now. On to the next.",
];

export const sectionCompletionTitle = "Great work!";

export const sectionCompletionBody =
  "You've completed another step toward becoming a safe professional driver.";

export function randomSectionCompletion(): string {
  return sectionCompletionMessages[
    Math.floor(Math.random() * sectionCompletionMessages.length)
  ];
}

// ── Individual Item Check Encouragement (after each item checked off) ─────────

export const itemCheckEncouragement: string[] = [
  "Great Work!",
  "Excellent Job!",
  "Outstanding!",
  "Nice Work!",
  "Keep It Up!",
  "You're Doing Great!",
  "Fantastic!",
  "Looking Good!",
  "Awesome Job!",
  "Way to Go!",
  "You're On a Roll!",
  "Keep Going!",
  "Excellent Progress!",
  "That's Correct!",
  "You're Crushing It!",
  "Perfect!",
  "Great Attention to Detail!",
  "You're Getting Closer!",
  "That's Exactly Right!",
  "Coach William is Proud of You!",
];

const _lastItemCheck = { idx: -1 };

/** Pick a rotating encouragement message after an individual item is checked off. */
export function getItemCheckEncouragement(): string {
  return pickFromPool(itemCheckEncouragement, _lastItemCheck);
}

// ── Section Completion Celebration (larger, rotating) ───────────────────────

export const sectionCelebrationMessages: string[] = [
  "🏆 Section Complete! Excellent Work!",
  "🎉 Outstanding! You've completed this section!",
  "👏 Fantastic Job! You're ready for the next section!",
  "⭐ Excellent! Let's keep the momentum going!",
  '🚛 Coach William Says: "You\'re doing exactly what examiners want to see. Keep it up!"',
];

const _lastSectionCelebration = { idx: -1 };

/** Pick a rotating celebration message shown when an entire section is completed. */
export function getSectionCelebration(): string {
  return pickFromPool(sectionCelebrationMessages, _lastSectionCelebration);
}

// ── Final App Completion (entire Pre-Trip Inspection finished) ───────────────

export const finalCompletionTitle = "🎓 Coach William Graduation";
export const finalCompletionBody = "Congratulations!";
export const finalCompletionSub =
  "You have successfully completed the Coach William Pre-Trip Inspection.";
export const finalCompletionLines: string[] = [
  "You have learned the same inspection process Coach William teaches his CDL students.",
  "Now take a deep breath…",
  "Trust your training…",
  "Stay calm…",
  "Take your time…",
  "And show the examiner what you know.",
];
export const finalCompletionClosing = "🚛 Go earn your CDL!";
export const finalCompletionRememberTitle = "Remember...";
export const finalCompletionRememberLines: string[] = [
  "Confidence comes from preparation.",
  "You've got this!",
];
export const finalCompletionSign = "— Coach William";
export const finalCompletionButton = "Return to Home";

// ── Pressure Recall specific ─────────────────────────────────────────────────

export const pressureTimeoutMessage =
  "Keep going. Every repetition improves your recall.";

export const pressureCorrectMessages: string[] = [
  "Nice work. You are building recall under pressure.",
  "Good job. Keep that confidence going.",
  "You've got this. Even with the clock ticking.",
  "Accuracy first. Speed comes with repetition.",
];

export const pressureIncorrectMessages: string[] = [
  "Keep going. Accuracy first. Speed comes with repetition.",
  "No sweat, Driver. That's why we practice.",
  "Every miss teaches you something. Keep at it.",
  "Don't let the clock rattle you. You know this material.",
];

// ── Challenge messages ───────────────────────────────────────────────────────

export const challengeDescription =
  "You scored 100% three times in a row. You are ready for the ultimate test.";

export const challengeInstructions: string[] = [
  "Without looking at your notes, say all four Air Brake Tests in reverse order.",
  "Then say all four in forward order.",
  "Then have someone ask them in random order.",
];

export const challengeFooter =
  "This challenge is designed to prepare you for the real CDL Air Brake Test. If you can do this, you are ready.";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function randomCornerMessage(): string {
  return coachCornerMessages[
    Math.floor(Math.random() * coachCornerMessages.length)
  ];
}

export function randomCoffeeBreak(): string {
  return coffeeBreakMessages[
    Math.floor(Math.random() * coffeeBreakMessages.length)
  ];
}

export function randomTruckerWisdom(): string {
  return truckerWisdomMessages[
    Math.floor(Math.random() * truckerWisdomMessages.length)
  ];
}

export function randomTip(): string {
  return coachWilliamTips[
    Math.floor(Math.random() * coachWilliamTips.length)
  ];
}

export function randomCoaching(): string {
  return coachingMessages[
    Math.floor(Math.random() * coachingMessages.length)
  ];
}

export function randomDebrief(): string {
  return debriefMessages[
    Math.floor(Math.random() * debriefMessages.length)
  ];
}

export function randomSignOff(): string {
  return signOffMessages[
    Math.floor(Math.random() * signOffMessages.length)
  ];
}

export function randomPressureCorrect(): string {
  return pressureCorrectMessages[
    Math.floor(Math.random() * pressureCorrectMessages.length)
  ];
}

export function randomPressureIncorrect(): string {
  return pressureIncorrectMessages[
    Math.floor(Math.random() * pressureIncorrectMessages.length)
  ];
}

// ── Core Inspection Language ─────────────────────────────────────────────────

export const coreLanguageCoachMessage =
  "PMS and BCD are your inspection friends. You'll say them so much they'll start riding shotgun.";

export const topDownCoachMessage =
  "Learn the pattern, Hero. Top-down, system by system — once you know the pattern, the inspection becomes much easier to remember.";

export const coreLanguageWhyItMatters =
  "Using consistent inspection language helps students stay organized, sound confident, and avoid forgetting important phrases during the CDL test. When you use the same words every time, the examiner hears a professional who knows exactly what they're doing.";

/**
 * Maps an inspection item title to the recommended memory tool acronym.
 * Returns null if no specific acronym applies.
 */
export function memoryToolForItem(itemTitle: string): string | null {
  // Solid components, mounted parts, mirrors, gauges, lights, brackets, tanks, frame, suspension, brake parts
  const pmsPatterns = [
    /mirror/i, /bracket/i, /mount/i, /gauge/i, /light/i, /headlamp/i, /reflector/i,
    /tank/i, /frame/i, /cross member/i, /spring/i, /shock/i, /u.bolt/i, /shackle/i,
    /torque arm/i, /landing gear/i, /door/i, /lug nut/i, /rim/i, /fire extinguisher/i,
    /triangle/i, /seat belt/i, /steering/i, /horn/i, /apron/i, /release arm/i,
  ];
  // Hoses, wires, lines, belts — anything flexible or routed
  const ccfPatterns = [
    /hose/i, /wire/i, /line/i, /belt/i, /cable/i,
  ];

  if (ccfPatterns.some((p) => p.test(itemTitle))) return "CCF";
  if (pmsPatterns.some((p) => p.test(itemTitle))) return "PMS · BCD";
  return null;
}

/** Standard inspection phrases students should use. */
export const standardPhrases: string[] = [
  "No missing hardware.",
  "No missing nuts, bolts, or parts.",
  "No evidence of damage.",
  "I see or hear no leaks.",
];
