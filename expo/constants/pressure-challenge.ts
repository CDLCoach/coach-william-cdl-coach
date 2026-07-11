/**
 * Pressure Challenge question pool.
 *
 * Used by the Pressure Challenge screen (app/pressure-challenge.tsx) to train
 * students to answer quickly under test pressure. Questions are tagged by
 * inspection category so the challenge can pull a balanced random subset.
 *
 * These questions are intentionally distinct from the Practice Test pool in
 * constants/quiz.ts so the two modes complement rather than duplicate each other.
 */

import type { QuizQuestion } from "@/constants/quiz";

/** The 13 inspection categories the Pressure Challenge draws from. */
export type PressureCategory =
  | "In-Cab Inspection"
  | "Service Brake"
  | "Parking Brake"
  | "Air Brake Test"
  | "Light Operations"
  | "Front of Tractor"
  | "Passenger Side Engine Compartment"
  | "Driver Side Engine Compartment"
  | "Driver Side Inspection"
  | "Back of Tractor"
  | "CDL Numbers to Remember"
  | "Coupling System"
  | "Trailer Inspection";

export type PressureQuestion = QuizQuestion & {
  category: PressureCategory;
};

export const pressureQuestions: PressureQuestion[] = [
  // ── In-Cab Inspection ───────────────────────────────────────────────────────
  {
    id: 101,
    category: "In-Cab Inspection",
    question: "What does PMS stand for during the inspection?",
    options: [
      "Properly Mounted and Secured",
      "Pressure, Mirrors, Steering",
      "Park, Move, Stop",
      "Pre-trip Manual Standard",
    ],
    answer: 0,
    explanation: "PMS = Properly Mounted and Secured. Use it for solid mounted components.",
  },
  {
    id: 102,
    category: "In-Cab Inspection",
    question: "What does BCD mean during the inspection?",
    options: [
      "Brakes, Controls, Dashboard",
      "Not Broken, Cracked, or Damaged",
      "Brake Cable Distance",
      "Battery, Coolant, DEF",
    ],
    answer: 1,
    explanation: "BCD = Not Broken, Cracked, or Damaged. Say it for every physical component.",
  },
  {
    id: 103,
    category: "In-Cab Inspection",
    question: "What is the very first thing you do after entering the cab?",
    options: [
      "Start the engine",
      "Release the parking brakes",
      "Put on your seat belt",
      "Check the mirrors",
    ],
    answer: 2,
    explanation: "Put on your seat belt immediately. It is the first thing the examiner expects.",
  },
  {
    id: 104,
    category: "In-Cab Inspection",
    question: "What does CCF stand for when inspecting hoses and wires?",
    options: [
      "Coolant, Coolant, Fluid",
      "Not Cut, Cracked, or Frayed",
      "Cab Control Feature",
      "Cable, Clamp, Fastener",
    ],
    answer: 1,
    explanation: "CCF = Not Cut, Cracked, or Frayed. Use it for hoses, wires, lines, and belts.",
  },
  {
    id: 105,
    category: "In-Cab Inspection",
    question: "During the safe start, what should the ABS warning light do?",
    options: [
      "Stay on the whole time",
      "Never come on at all",
      "Come on briefly then go off",
      "Flash continuously",
    ],
    answer: 2,
    explanation: "The ABS light should illuminate briefly and then go out, completing its self-test.",
  },

  // ── Service Brake ───────────────────────────────────────────────────────────
  {
    id: 110,
    category: "Service Brake",
    question: "During the Service Brake Test, what speed should you reach before applying the brakes?",
    options: ["Approximately 5 MPH", "15 MPH", "25 MPH", "Highway speed"],
    answer: 0,
    explanation: "Gently accelerate to about 5 MPH, then apply the service brakes.",
  },
  {
    id: 111,
    category: "Service Brake",
    question: "When performing the Service Brake Test, the vehicle should stop:",
    options: [
      "Smoothly without pulling left or right",
      "As quickly as possible",
      "With a slight pull to the right",
      "Only when the parking brake is applied",
    ],
    answer: 0,
    explanation: "The vehicle should stop smoothly without pulling to either side.",
  },
  {
    id: 112,
    category: "Service Brake",
    question: "Before the Service Brake Test, both parking brakes should be:",
    options: [
      "Released",
      "Applied",
      "Removed from the vehicle",
      "Left in any position",
    ],
    answer: 0,
    explanation: "Release both tractor and trailer parking brakes before the Service Brake Test.",
  },

  // ── Parking Brake ───────────────────────────────────────────────────────────
  {
    id: 120,
    category: "Parking Brake",
    question: "During the tractor parking brake tug test, which button is OUT?",
    options: [
      "Tractor parking brake only",
      "Trailer parking brake only",
      "Both buttons",
      "Neither button",
    ],
    answer: 0,
    explanation: "Tractor button OUT, trailer button IN. Gently tug against the tractor brake.",
  },
  {
    id: 121,
    category: "Parking Brake",
    question: "What gear do you shift into for a parking brake tug test?",
    options: ["A forward gear", "Reverse", "Neutral", "Park"],
    answer: 0,
    explanation: "Shift into a forward gear and gently tug against the parking brake.",
  },
  {
    id: 122,
    category: "Parking Brake",
    question: "After both tug tests, what should you allow to happen?",
    options: [
      "Rebuild air pressure to governor cut-out",
      "Shut the engine off immediately",
      "Exit the cab",
      "Drive forward to test the brakes",
    ],
    answer: 0,
    explanation: "Rebuild air pressure until governor cut-out (about 140–120 PSI) before the next test.",
  },

  // ── Air Brake Test ──────────────────────────────────────────────────────────
  {
    id: 130,
    category: "Air Brake Test",
    question: "What is the first step of the Air Brake Test sequence?",
    options: [
      "Build air pressure to governor cut-out",
      "Fan the brakes",
      "Pull both parking brake valves",
      "Turn the engine off",
    ],
    answer: 0,
    explanation: "First step: build air pressure to governor cut-out (140–120 PSI).",
  },
  {
    id: 131,
    category: "Air Brake Test",
    question: "During the Air Leakage Rate Test, how long do you hold the service brake?",
    options: ["One full minute", "30 seconds", "Two minutes", "Until the air runs out"],
    answer: 0,
    explanation: "Hold the service brake for one full minute and check the air loss.",
  },
  {
    id: 132,
    category: "Air Brake Test",
    question: "How do you perform the low air warning test?",
    options: [
      "Fan the brakes to reduce air pressure",
      "Shut the engine off",
      "Pull both parking brake valves",
      "Step on the brake pedal once",
    ],
    answer: 0,
    explanation: "Fan the brakes (pump the pedal) to lower air pressure until the warning activates.",
  },
  {
    id: 133,
    category: "Air Brake Test",
    question: "Before starting the Air Leakage Rate Test, the engine should be:",
    options: [
      "Off, with the key in the ON position",
      "Running at high idle",
      "Running at low idle",
      "Off with the key removed",
    ],
    answer: 0,
    explanation: "Engine off, key ON, then push in both brake valves. This is the Off-On-Push step.",
  },

  // ── Light Operations ────────────────────────────────────────────────────────
  {
    id: 140,
    category: "Light Operations",
    question: "Before activating the lights, the ignition key should be in which position?",
    options: ["ON (engine off)", "OFF", "Start", "Accessory only"],
    answer: 0,
    explanation: "Turn the key to ON without starting the engine so the warning buzzer and lights are powered.",
  },
  {
    id: 141,
    category: "Light Operations",
    question: "Which lights are checked at the FRONT of the tractor?",
    options: [
      "Low beams, high beams, turn signals, four-way flashers, clearance, marker",
      "Only the headlights",
      "Only the brake lights",
      "Tail lights and reverse lights",
    ],
    answer: 0,
    explanation: "Front lights: low/high beams, left/right turn signals, four-way flashers, clearance and marker lights.",
  },
  {
    id: 142,
    category: "Light Operations",
    question: "Why should you roll the driver's window down during the Light Operations Check?",
    options: [
      "So the examiner can clearly hear every command",
      "To let fresh air in",
      "To cool the engine",
      "It is not necessary",
    ],
    answer: 0,
    explanation: "A rolled-down window lets the examiner hear every light command clearly.",
  },

  // ── Front of Tractor ────────────────────────────────────────────────────────
  {
    id: 150,
    category: "Front of Tractor",
    question: "If the truck is leaning to one side, it could indicate a problem with the:",
    options: ["Suspension", "Steering wheel", "Radio", "Windshield wipers"],
    answer: 0,
    explanation: "Leaning can mean a broken spring or suspension problem. Check during the overview.",
  },
  {
    id: 151,
    category: "Front of Tractor",
    question: "A puddle of fluid under the front of the truck could indicate:",
    options: [
      "A brake, coolant, or oil leak",
      "Rainwater from yesterday",
      "Nothing important",
      "A normal condition",
    ],
    answer: 0,
    explanation: "Fluid puddles can mean a brake, coolant, or oil leak. Investigate before driving.",
  },
  {
    id: 152,
    category: "Front of Tractor",
    question: "All lenses on the front of the tractor should be:",
    options: [
      "Clean, the correct color, and none missing",
      "Tinted aftermarket",
      "Cracked but working",
      "Any color as long as they light up",
    ],
    answer: 0,
    explanation: "Lenses must be clean, the correct color, and none missing.",
  },

  // ── Passenger Side Engine Compartment ───────────────────────────────────────
  {
    id: 160,
    category: "Passenger Side Engine Compartment",
    question: "Before inspecting individual engine components, you should:",
    options: [
      "Take a general overview of the whole compartment",
      "Skip straight to the belts",
      "Only check the oil",
      "Start the engine first",
    ],
    answer: 0,
    explanation: "Start with the big picture, then inspect the details. Overview first.",
  },
  {
    id: 161,
    category: "Passenger Side Engine Compartment",
    question: "Missing nuts, bolts, or fasteners in the engine compartment are:",
    options: [
      "A red flag for any examiner",
      "Normal and acceptable",
      "Only a concern on the trailer",
      "Not checked during the pre-trip",
    ],
    answer: 0,
    explanation: "Missing hardware is a red flag. A loose component can fail at highway speed.",
  },

  // ── Driver Side Engine Compartment ──────────────────────────────────────────
  {
    id: 170,
    category: "Driver Side Engine Compartment",
    question: "What does the COPS acronym help you remember?",
    options: [
      "Coolant, Oil, Power Steering",
      "Cab, Oil, Park, Stop",
      "Coolant, Oil, Park, Steering",
      "Check Oil Pressure System",
    ],
    answer: 0,
    explanation: "COPS = Coolant, Oil, Power Steering. The fluids you check in the engine compartment.",
  },
  {
    id: 172,
    category: "Driver Side Engine Compartment",
    question: "What is the proper way to check the engine oil level?",
    options: [
      "Remove the dipstick, wipe it clean, reinsert fully, remove again, read the level",
      "Look at the oil fill cap",
      "Check the dash gauge only",
      "Smell the dipstick",
    ],
    answer: 0,
    explanation: "Remove, wipe, reinsert fully, remove again, and verify the level is between ADD and FULL.",
  },
  {
    id: 173,
    category: "Driver Side Engine Compartment",
    question: "Whenever you check a fluid level, the cap should be:",
    options: [
      "On tight, and the level between ADD and FULL",
      "Loose for ventilation",
      "Removed completely",
      "Left off after checking",
    ],
    answer: 0,
    explanation: "Cap on tight, level between ADD and FULL marks, no leaks. Every fluid, every time.",
  },

  // ── Driver Side Inspection ──────────────────────────────────────────────────
  {
    id: 180,
    category: "Driver Side Inspection",
    question: "What does ABC mean when inspecting a tire sidewall?",
    options: [
      "No Abrasions, Bulges, or Cuts",
      "Air, Brake, Coolant",
      "Axle, Bearing, Cap",
      "Air Bag Condition",
    ],
    answer: 0,
    explanation: "ABC = no Abrasions, Bulges, or Cuts on the tire sidewall.",
  },
  {
    id: 181,
    category: "Driver Side Inspection",
    question: "Rust streaks or shiny threads around a lug nut indicate:",
    options: [
      "The lug nut may be loose",
      "The lug nut is properly torqued",
      "The rim is new",
      "The tire is overinflated",
    ],
    answer: 0,
    explanation: "Rust streaks or shiny (worn) threads around a lug nut suggest it may be loose.",
  },
  {
    id: 182,
    category: "Driver Side Inspection",
    question: "How should tire pressure be checked during the inspection?",
    options: [
      "With a DOT-approved tire pressure gauge",
      "By kicking the tire",
      "By looking at the sidewall",
      "By checking the tread depth",
    ],
    answer: 0,
    explanation: "Always use a DOT-approved tire pressure gauge. Never kick the tire.",
  },

  // ── Back of Tractor ─────────────────────────────────────────────────────────
  {
    id: 190,
    category: "Back of Tractor",
    question: "Illegal welds on the tractor frame are:",
    options: [
      "A sign the frame has been compromised",
      "Acceptable if they look strong",
      "Only a concern on the trailer",
      "Allowed on cross members",
    ],
    answer: 0,
    explanation: "Illegal welds hide prior damage and weaken the steel. Say it out loud to the examiner.",
  },
  {
    id: 191,
    category: "Back of Tractor",
    question: "What is the purpose of the catwalk?",
    options: [
      "A safe platform for connecting and inspecting air and electrical lines",
      "A storage area for cargo",
      "A decorative panel",
      "A step for entering the cab",
    ],
    answer: 0,
    explanation: "The catwalk is a platform for connecting and inspecting the air and electrical lines.",
  },
  {
    id: 192,
    category: "Back of Tractor",
    question: "DOT reflective tape at the back of the tractor should be:",
    options: [
      "Present, clean, and not damaged",
      "Optional on commercial vehicles",
      "Removed before driving",
      "Any color the driver prefers",
    ],
    answer: 0,
    explanation: "Reflective tape must be present, clean, and undamaged so the truck is visible at night.",
  },

  // ── CDL Numbers to Remember ─────────────────────────────────────────────────
  {
    id: 200,
    category: "CDL Numbers to Remember",
    question: "What is the minimum tread depth for STEER tires?",
    options: ["4/32 inch", "2/32 inch", "6/32 inch", "1/32 inch"],
    answer: 0,
    explanation: "Steer tires require at least 4/32 inch of tread depth.",
  },
  {
    id: 201,
    category: "CDL Numbers to Remember",
    question: "What is the minimum tread depth for all tires EXCEPT steer tires?",
    options: ["2/32 inch", "4/32 inch", "6/32 inch", "8/32 inch"],
    answer: 0,
    explanation: "All other tires require at least 2/32 inch of tread depth.",
  },
  {
    id: 202,
    category: "CDL Numbers to Remember",
    question: "At what pressure does the governor normally cut out?",
    options: ["90 to 100 PSI", "60 to 80 PSI", "150 to 170 PSI", "120 to 140 PSI"],
    answer: 3,
    explanation: "Governor cut-out normally occurs between 120 and 140 PSI.",
  },
  {
    id: 203,
    category: "CDL Numbers to Remember",
    question: "Before what pressure must the low air warning activate?",
    options: ["Before 55 PSI", "Before 80 PSI", "Before 20 PSI", "Before 100 PSI"],
    answer: 0,
    explanation: "The low air warning (light and buzzer) must activate before pressure drops below 55 PSI.",
  },
  {
    id: 204,
    category: "CDL Numbers to Remember",
    question: "Between what pressures should the parking brake valves pop out?",
    options: ["Between 45 and 20 PSI", "Between 60 and 50 PSI", "Between 15 and 5 PSI", "Below 10 PSI"],
    answer: 0,
    explanation: "The tractor and trailer parking brake valves should pop out between 45 and 20 PSI.",
  },

  // ── Coupling System ─────────────────────────────────────────────────────────
  {
    id: 209,
    category: "Coupling System",
    question: "The kingpin should be straight, securely mounted, and NOT:",
    options: [
      "Bent, cracked, broken, excessively worn, or damaged",
      "Properly greased and clean",
      "Fully seated in the apron",
      "Made of hardened steel",
    ],
    answer: 0,
    explanation: "The kingpin must be straight, securely mounted, and free of bends, cracks, breaks, excessive wear, or damage — it's the single point holding the trailer to the tractor.",
  },
  {
    id: 210,
    category: "Coupling System",
    question: "The locking jaws should close around which part of the kingpin?",
    options: [
      "The shank (not the head)",
      "The head (not the shank)",
      "The trailer apron",
      "The release arm",
    ],
    answer: 0,
    explanation: "Locking jaws must close around the shank of the kingpin, not the head.",
  },
  {
    id: 211,
    category: "Coupling System",
    question: "What does a gap between the apron and the skid plate indicate?",
    options: [
      "The trailer is not fully coupled to the fifth wheel",
      "The fifth wheel is properly greased",
      "The air lines are connected",
      "Nothing concerning",
    ],
    answer: 0,
    explanation: "A gap means the trailer is not fully seated. The kingpin may not be locked.",
  },
  {
    id: 212,
    category: "Coupling System",
    question: "What is the purpose of the safety latch on the release arm?",
    options: [
      "It prevents the release arm from accidentally opening during travel",
      "It holds the kingpin in place",
      "It greases the fifth wheel",
      "It connects the air lines",
    ],
    answer: 0,
    explanation: "The safety latch is the backup that keeps the release arm locked while driving.",
  },
  {
    id: 213,
    category: "Coupling System",
    question: "Crossed glad hands mean that:",
    options: [
      "The service and emergency lines are reversed",
      "The glad hands are properly sealed",
      "The air lines are too short",
      "The electrical line is disconnected",
    ],
    answer: 0,
    explanation: "Crossed glad hands reverse the service and emergency lines, so trailer brakes won't work correctly.",
  },

  // ── Trailer Inspection ──────────────────────────────────────────────────────
  {
    id: 220,
    category: "Trailer Inspection",
    question: "Before driving, the trailer landing gear should be:",
    options: [
      "Fully raised with the handle secured",
      "Partially lowered for stability",
      "Left in any position",
      "Removed from the trailer",
    ],
    answer: 0,
    explanation: "Landing gear must be fully raised and the crank handle secured before driving.",
  },
  {
    id: 221,
    category: "Trailer Inspection",
    question: "If tandem locking pins are not fully seated, the axles can:",
    options: [
      "Slide freely under braking or acceleration",
      "Lock up permanently",
      "Improve fuel economy",
      "Nothing happens",
    ],
    answer: 0,
    explanation: "Unseated tandem pins let the axles slide, causing sudden unpredictable weight shifts.",
  },
  {
    id: 222,
    category: "Trailer Inspection",
    question: "A missing or damaged mud flap can cause:",
    options: [
      "Rocks, debris, and road spray to hit vehicles behind you",
      "Better aerodynamics",
      "Improved braking",
      "Nothing important",
    ],
    answer: 0,
    explanation: "Mud flaps protect vehicles behind you from debris and road spray.",
  },
  {
    id: 223,
    category: "Trailer Inspection",
    question: "The trailer doors, hinges, and ties should be:",
    options: [
      "Properly mounted, not broken, and securely closed",
      "Left open for ventilation",
      "Removed before driving",
      "Checked only after loading",
    ],
    answer: 0,
    explanation: "Doors, hinges, and ties must be properly mounted, undamaged, and secure.",
  },
];
