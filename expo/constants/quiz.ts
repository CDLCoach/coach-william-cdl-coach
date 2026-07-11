export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  explanation: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "How much play should the steering wheel have on a vehicle with a 20-inch steering wheel?",
    options: [
      "No more than 2 inches",
      "No more than 6 inches",
      "As much as 8 inches",
      "Play is not checked",
    ],
    answer: 0,
    explanation:
      "Steering wheel play should be no more than about 10 degrees, which is roughly 2 inches on a 20-inch wheel.",
  },
  {
    id: 2,
    question:
      "During the Air Leakage Rate Test on a combination vehicle, the air loss in one minute should not exceed:",
    options: ["2 PSI", "3 PSI", "4 PSI", "6 PSI"],
    answer: 2,
    explanation:
      "For combination vehicles, air loss should not exceed 4 PSI in one minute (3 PSI for a single vehicle).",
  },
  {
    id: 3,
    question: "The low air pressure warning must come on before pressure drops below:",
    options: ["20 PSI", "45 PSI", "55 PSI", "80 PSI"],
    answer: 2,
    explanation:
      "Correct! The low air warning light and buzzer must activate before the air pressure drops below 55 PSI.",
  },
  {
    id: 4,
    question: "At what air pressure should the spring (parking) brakes pop out?",
    options: [
      "150 to 170 PSI",
      "120 to 140 PSI",
      "90 to 100 PSI",
      "45 to 20 PSI",
    ],
    answer: 3,
    explanation:
      "The tractor and trailer parking brake valves should pop out between 45 and 20 psi.",
  },
  {
    id: 5,
    question: "The locking jaws of the fifth wheel should close around the:",
    options: [
      "Head of the kingpin",
      "Shank of the kingpin",
      "Trailer apron",
      "Release arm",
    ],
    answer: 1,
    explanation:
      "Locking jaws must be fully closed around the shank (not the head) of the kingpin.",
  },
  {
    id: 6,
    question: "What is the minimum tread depth for front (steer) tires?",
    options: ["1/32 inch", "2/32 inch", "4/32 inch", "6/32 inch"],
    answer: 2,
    explanation:
      "Steer tires must have at least 4/32 inch of tread depth. Other tires require at least 2/32 inch.",
  },
  {
    id: 7,
    question: "Governor cut-out, when air pressure stops building, normally occurs at:",
    options: [
      "90 to 100 PSI",
      "60 to 80 PSI",
      "150 to 170 PSI",
      "120 to 140 PSI",
    ],
    answer: 3,
    explanation:
      "The governor normally cuts out air compressor loading between 120 and 140 psi.",
  },
  {
    id: 8,
    question: "When checking lug nuts, a warning sign of a loose nut is:",
    options: [
      "A clean, dry rim",
      "Rust streaks or shiny threads",
      "Valve cap in place",
      "Even tire tread wear",
    ],
    answer: 1,
    explanation:
      "Rust streaks or shiny (worn) threads around a lug nut indicate it may be loose.",
  },
  {
    id: 9,
    question: "Belt tension on the engine compartment belts should allow about:",
    options: [
      "No movement at all",
      "3/4 inch of play",
      "2 inches of play",
      "4 inches of play",
    ],
    answer: 1,
    explanation:
      "Properly adjusted belts should deflect about 3/4 inch when pressed.",
  },
  {
    id: 10,
    question: "Before starting the Air Leakage Rate Test you should:",
    options: [
      "Leave the engine running at high idle",
      "Turn the engine off, turn the key to the ON position, and then push in both brake valves",
      "Keep both parking brake valves pulled out",
      "Drive the vehicle forward slowly",
    ],
    answer: 1,
    explanation:
      "Off-On-Push: turn the engine off, turn the key to the ON position, and then push in both brake valves. This is the first step of the Air Brake Test sequence.",
  },
  {
    id: 11,
    question: "Which of these is checked during the in-cab inspection?",
    options: [
      "Fifth wheel locking jaws",
      "Landing gear",
      "Seat belt and gauges",
      "Mud flaps",
    ],
    answer: 2,
    explanation:
      "The in-cab inspection includes the seat belt, mirrors, windshield, wipers, heater, defroster, horn, gauges, and steering.",
  },
  {
    id: 12,
    question: "Trailer landing gear should be:",
    options: [
      "Partially lowered for stability",
      "Fully raised with the handle secured",
      "Removed before driving",
      "Left in any position",
    ],
    answer: 1,
    explanation:
      "Landing gear must be fully raised and the crank handle secured before driving.",
  },
  {
    id: 13,
    question: "What should you do immediately after entering the cab?",
    options: [
      "Start the engine.",
      "Check the mirrors.",
      "Put on your seat belt.",
      "Release the parking brakes.",
    ],
    answer: 2,
    explanation:
      "Immediately after entering the cab, put on your seat belt. It is your last line of defense in a collision and is the first thing the examiner expects to see.",
  },
  {
    id: 14,
    question: "After identifying the safety equipment, what is the next step?",
    options: [
      "Start the engine.",
      "Turn the key to the ON position and allow the system to cycle.",
      "Perform the Air Brake Test.",
      "Check the mirrors.",
    ],
    answer: 1,
    explanation:
      "Allow the ABS and other warning systems to complete their self-check before starting the engine.",
  },
  {
    id: 15,
    question: "What should the ABS warning light do during a safe start?",
    options: [
      "Stay on.",
      "Never come on.",
      "Come on and then go off.",
      "Flash continuously.",
    ],
    answer: 2,
    explanation:
      "The ABS light should illuminate briefly and then go out, indicating the system has completed its self-test.",
  },
  {
    id: 16,
    question:
      "During the in-cab safety equipment check, the fire extinguisher must be:",
    options: [
      "Properly mounted, rated, dated, and fully charged",
      "Stored in the sleeper berth for easy access",
      "Mounted only if the truck carries hazardous materials",
      "Inspected monthly by a certified mechanic",
    ],
    answer: 0,
    explanation:
      "The fire extinguisher must be properly mounted and secured, rated and dated, and fully charged. A discharged or expired extinguisher is useless in an emergency.",
  },
  {
    id: 17,
    question:
      "Why is it important that wiper blades make full, flush contact with the windshield?",
    options: [
      "Streaks reduce visibility exactly when you need it most in heavy weather",
      "It improves the truck's aerodynamics",
      "It prevents the wiper motor from overheating",
      "It is only a cosmetic concern",
    ],
    answer: 0,
    explanation:
      "Loose or damaged blades leave streaks and gaps. In rain or snow at highway speed, reduced visibility can be dangerous.",
  },
  {
    id: 18,
    question:
      "When entering or exiting the cab, how many points of contact should you maintain?",
    options: [
      "At least two points of contact at all times",
      "Three points of contact — two hands and one foot, or two feet and one hand",
      "One point of contact is sufficient if you are careful",
      "Four points of contact for maximum safety",
    ],
    answer: 1,
    explanation:
      "Always use three points of contact when entering or exiting the cab: either two hands and one foot, or two feet and one hand. Never jump from the truck — safety starts before the engine starts.",
  },
  {
    id: 19,
    question:
      "What is the purpose of the safety latch on the coupling release arm?",
    options: [
      "It prevents the release arm from accidentally opening during travel",
      "It holds the kingpin in place directly",
      "It keeps the fifth wheel greased",
      "It connects the air lines to the trailer",
    ],
    answer: 0,
    explanation:
      "The safety latch is the backup that keeps the release arm locked. Without it, road vibration can work the arm loose over hundreds of miles.",
  },
  {
    id: 20,
    question: "What does ABC stand for during the tire inspection?",
    options: [
      "Air Brake Check",
      "Abrasions, Bulges, and Cuts",
      "Axle Bearing Cap",
      "Air Bag Condition",
    ],
    answer: 1,
    explanation:
      "Inspect every tire sidewall for no Abrasions, Bulges, or Cuts.",
  },
  {
    id: 21,
    question: "How should tire pressure be checked?",
    options: [
      "By kicking the tire.",
      "With a DOT-approved tire pressure gauge.",
      "By looking at the sidewall.",
      "By checking tread depth.",
    ],
    answer: 1,
    explanation:
      "Always verify tire pressure with a DOT-approved tire pressure gauge.",
  },
  {
    id: 22,
    question:
      "After completing the Light Operations Check, what should you do before exiting the cab?",
    options: [
      "Turn the ignition key to OFF, exit using three points of contact, and place the key in the outside door lock",
      "Leave the engine running and jump out",
      "Start driving immediately",
      "Remove the steering wheel",
    ],
    answer: 0,
    explanation:
      "Finish cleanly: key off, three points of contact, key secured. Every step matters, including the last one before stepping outside.",
  },
];
