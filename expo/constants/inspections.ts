import type { LucideIcon } from "lucide-react-native";
import {
  Armchair,
  Car,
  ClipboardCheck,
  Cog,
  Disc3,
  Eye,
  GaugeCircle,
  Link2,
  Truck,
  FileText,
  Lock,
  Zap,
  Brain,
} from "lucide-react-native";

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  /** Optional group label — items sharing a group render under a single heading. */
  group?: string;
};

/** A memory-tool acronym breakdown for chunked learning. */
export type MemoryToolItem = {
  id: string;
  letter: string;
  label: string;
};

/** A sub-section (chunk) within an inspection section, for Kirkland Rapid Recall Method. */
export type InspectionSubSection = {
  id: string;
  title: string;
  whyItMatters: string;
  items: ChecklistItem[];
  /** Optional: COPS-style memory acronym to display at the top of the section. */
  memoryToolAcronym?: string;
  memoryToolItems?: MemoryToolItem[];
  memoryToolCoachTip?: string;
  /** Optional: override the default section-completion messaging. */
  completionTitleOverride?: string;
  completionBodyOverride?: string;
  completionCoachMessageOverride?: string;
  /** Coach William intro message displayed at the top of the section. */
  sectionCoachIntro?: string;
};

export type FinalExaminerStatement = {
  title: string;
  statement: string;
  note: string;
};

export type InspectionSection = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  items: ChecklistItem[];
  /** Optional: chunked subsections for Kirkland Rapid Recall learning. */
  subsections?: InspectionSubSection[];
  /** Optional: a visually distinct final statement shown at the end of the section. */
  finalStatement?: FinalExaminerStatement;
};

export const inspectionSections: InspectionSection[] = [
  {
    id: "in-cab",
    title: "In-Cab Inspection",
    subtitle: "Check controls and safety equipment",
    icon: Armchair,
    items: [],
    subsections: [
      {
        id: "core_inspection_language",
        title: "Core Inspection Language",
        whyItMatters:
          "Using consistent inspection language helps students stay organized, sound confident, and avoid forgetting important phrases during the CDL test. When you use the same words every time, the examiner hears a professional who knows exactly what they're doing.",
        memoryToolAcronym: "PMS · BCD · CCF",
        memoryToolItems: [
          { id: "pms", letter: "PMS", label: "Properly Mounted and Secured" },
          { id: "bcd", letter: "BCD", label: "Not Broken, Cracked, or Damaged" },
          { id: "ccf", letter: "CCF", label: "Not Cut, Cracked, or Frayed" },
        ],
        memoryToolCoachTip:
          "PMS and BCD are your inspection friends. You'll say them so much they'll start riding shotgun.",
        items: [
          {
            id: "pms_properly_mounted_and_secured",
            title: "PMS — Properly Mounted and Secured",
            description:
              "Use PMS when inspecting solid components, mounted parts, mirrors, gauges, lights, brackets, tanks, frame parts, suspension parts, brake parts, and other physical components.",
            whyItMatters:
              "When you say 'properly mounted and secured' for every bracket, mirror, and gauge, the examiner sees a driver who knows the standard. Consistency is professional.",
          },
          {
            id: "bcd_not_broken_cracked_or_damaged",
            title: "BCD — Not Broken, Cracked, or Damaged",
            description:
              "Use BCD alongside PMS when inspecting solid parts. After confirming something is mounted, confirm it is not broken, cracked, or damaged.",
            whyItMatters:
              "PMS and BCD go together like your coffee and your thermos. Mounted + undamaged = safe. Practice pairing them until it's automatic.",
          },
          {
            id: "ccf_not_cut_cracked_or_frayed",
            title: "CCF — Not Cut, Cracked, or Frayed",
            description:
              "Use CCF when inspecting hoses, wires, lines, belts, and anything flexible or routed. These items can't be 'broken' the way a bracket can — they get cut, cracked, or frayed.",
            whyItMatters:
              "A frayed belt or a cracked hose can fail without warning at highway speed. CCF is your vocabulary for spotting flexible-component failures before they happen.",
          },
          {
            id: "no_missing_hardware",
            title: "No Missing Hardware",
            description:
              "After checking PMS and BCD, confirm there are no missing nuts, bolts, clips, or fasteners.",
            whyItMatters:
              "Missing hardware is a red flag for any examiner. One missing bolt can mean a loose component — and a loose component can mean a roadside breakdown or worse.",
          },
          {
            id: "no_evidence_of_damage",
            title: "No Evidence of Damage",
            description:
              "Look for cracks, bends, rust-through, or other signs of damage on every component you inspect.",
            whyItMatters:
              "Damage doesn't always mean broken. A spreading crack or deep rust is damage waiting to become a failure. Saying 'no evidence of damage' shows you're inspecting thoroughly, not just checking boxes.",
          },
          {
            id: "i_see_or_hear_no_leaks",
            title: "I See or Hear No Leaks",
            description:
              "This powerful phrase applies to air, fluid, and visible leak checks throughout the entire inspection. Use it for coolant, oil, power steering fluid, fuel, air lines, brake chambers, and anywhere else leaks could occur.",
            whyItMatters:
              "Leaks are early warnings. Air leaks mean lost braking power. Fluid leaks mean failing systems. Fuel leaks mean fire risk. 'I see or hear no leaks' is one of the most versatile phrases in your inspection toolkit.",
          },
        ],
      },
      {
        id: "entering_the_vehicle",
        title: "Entering the Vehicle",
        whyItMatters:
          "The way you enter the truck sets the tone for your entire inspection. Using three points of contact prevents injuries that can end a career before it starts, and your seat belt is your last line of defense if something goes wrong on the road.",
        completionBodyOverride:
          "You're building confidence with every step.",
        items: [
          {
            id: "enter_truck",
            title: "Enter Truck with Three Points of Contact",
            description:
              "Before entering the truck, always use three points of contact. Use either two hands and one foot, or two feet and one hand. Never jump from the truck.",
            whyItMatters:
              "Three points of contact helps prevent slips and falls and builds safe professional habits before the inspection even begins. Safety starts before the engine starts.",
          },
          {
            id: "seat_belt",
            title: "Seat Belt",
            description:
              "The seat belt is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is not cut, cracked, or frayed.\nIt adjusts, latches, and unlatches properly.",
            whyItMatters:
              "Your seat belt is your last line of defense in a collision. A frayed or broken belt can't protect you when it counts most — and the examiner knows it.",
          },
        ],
      },
      {
        id: "safety_equipment",
        title: "Safety Equipment",
        whyItMatters:
          "Safety equipment helps protect the driver and other motorists during emergencies. Professional drivers verify all required emergency equipment before operating the vehicle.",
        completionTitleOverride: "Excellent!",
        completionBodyOverride:
          "A professional driver prepares for emergencies before they happen.",
        items: [
          {
            id: "fire_extinguisher",
            title: "Fire Extinguisher",
            description:
              "The fire extinguisher is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is rated and dated.\nIt is fully charged.",
            whyItMatters:
              "A fire extinguisher doesn't do much good if it isn't charged.",
          },
          {
            id: "reflective_triangles",
            title: "Three Red Bi-Directional Reflective Triangles",
            description:
              "I have three red bi-directional reflective triangles.",
            whyItMatters:
              "Reflective triangles warn approaching traffic of a stopped vehicle. Without them, you and your truck are invisible at night or in low visibility.",
          },
          {
            id: "spare_electrical_protection",
            title: "Spare Electrical Protection",
            description:
              "I have spare fuses and circuit breakers.\nIf the vehicle is equipped only with circuit breakers, verify that circuit breakers are present.",
            whyItMatters:
              "Blown fuses can disable your lights or other critical systems. Having spares means you can fix the problem and keep rolling safely.",
          },
        ],
      },
      {
        id: "safe_start",
        title: "Safe Start",
        sectionCoachIntro:
          "Now let's safely start the truck and let it tell us it's ready to go to work.",
        whyItMatters:
          "The truck performs an electronic self-check before starting. The ABS warning light confirms the Anti-lock Braking System has completed its self-test. Building full air pressure before moving the vehicle ensures the braking system is operating correctly.",
        memoryToolAcronym: "SOS",
        memoryToolItems: [
          { id: "system_cycle", letter: "S", label: "System Cycle" },
          { id: "observe_abs", letter: "O", label: "Observe ABS" },
          { id: "start_engine", letter: "S", label: "Start Engine" },
        ],
        memoryToolCoachTip:
          "Safe drivers let the truck finish its checks before going to work.",
        completionTitleOverride: "Excellent!",
        completionBodyOverride:
          "Professional drivers never rush the start-up process. They verify the truck is ready before every trip.",
        items: [
          {
            id: "turn_ignition_on",
            title: "Turn Ignition to ON",
            description:
              "Turn the ignition key to the ON position. Do NOT start the engine yet.",
            whyItMatters:
              "Turning the key to ON without starting lets the electrical system wake up. Gauges sweep, lights illuminate, and the truck's computer begins its self-diagnostic routine. Skipping this step means missing critical warning signals.",
          },
          {
            id: "system_cycle_self_check",
            title: "System Cycle (Self-Check)",
            description:
              "Allow the truck's electrical system to complete its self-check. Watch the dash as warning lights cycle on and off.",
            whyItMatters:
              "The system cycle is the truck's way of verifying every warning light and sensor is working. A light that doesn't come on during the cycle is a light that can't warn you later — and that's a dangerous blind spot.",
          },
          {
            id: "observe_abs_warning_light",
            title: "Observe ABS Warning Light",
            description:
              "The ABS warning light comes on and then goes off, indicating the ABS system is operating properly.",
            whyItMatters:
              "The ABS light is your confirmation that the Anti-lock Braking System passed its self-test. If it stays on or never illuminates, your ABS may not function — and without ABS, you lose the ability to brake and steer simultaneously in an emergency.",
          },
          {
            id: "start_engine",
            title: "Start Engine",
            description:
              "Start the engine and listen for smooth operation. The engine should start promptly without excessive cranking or unusual noises.",
            whyItMatters:
              "The way an engine starts tells you a lot about battery health, starter condition, and fuel delivery. Hard starting or unusual noises are early warnings that something needs attention before it fails on the road.",
          },
          {
            id: "build_air_pressure",
            title: "Build Air Pressure — Governor Cut-Out",
            description:
              "Allow the air pressure to build. Continue monitoring both primary and secondary air gauges until the Governor Cut-Out occurs.\nThe air pressure builds to between 120 and 140 PSI.\nI hear the Governor Cut-Out.\nCoach William calls this: Sneeze #1",
            whyItMatters:
              "The Governor Cut-Out — that distinctive puff of air — confirms your air compressor and governor are working correctly. It should occur between 120 and 140 PSI. If it cuts out too low, your brakes may not have full power. If it never cuts out, the governor is stuck and the system could over-pressurize.",
          },
        ],
      },
      {
        id: "electrical_system_check",
        title: "Electrical System Check",
        whyItMatters:
          "Your dash lights and gauges are the truck's only way of communicating with you. If a warning system fails silently, you could be driving a ticking time bomb and not know it until it's too late. Every light and gauge you verify today could save your life tomorrow.",
        items: [
          {
            id: "dash_lights",
            title: "Dash Lights Fully Illuminated",
            description:
              "Turn the key to the on position without starting the engine. Verify all dash warning lights illuminate during the initial bulb check before they go out.",
            whyItMatters:
              "The bulb check confirms your warning lights actually work. A burned-out warning bulb means you won't know about a critical system failure until it's too late.",
          },
          {
            id: "def_gauge",
            title: "DEF Gauge",
            description:
              "Check that the Diesel Exhaust Fluid gauge is reading correctly and is not empty or malfunctioning.",
            whyItMatters:
              "Running out of DEF can derate your engine or prevent it from starting. In some trucks, low DEF triggers a speed limitation — and you don't want to discover that on the highway.",
          },
          {
            id: "left_turn_signal",
            title: "Left Turn Signal Indicator",
            description:
              "Activate the left turn signal and verify the green indicator on the dash flashes at the correct rate.",
            whyItMatters:
              "A fast flash usually means a burned-out bulb — and that means the cars around you don't know you're about to turn or change lanes.",
          },
          {
            id: "right_turn_signal",
            title: "Right Turn Signal Indicator",
            description:
              "Activate the right turn signal and verify the green indicator on the dash flashes at the correct rate.",
            whyItMatters:
              "Your signals are your communication system with every other vehicle on the road. Both sides must work.",
          },
          {
            id: "high_beam",
            title: "High Beam Indicator",
            description:
              "Turn on the high beam headlights and verify the blue indicator illuminates on the dash.",
            whyItMatters:
              "The blue indicator confirms your high beams are active. At night, forgetting your high beams are on can blind oncoming drivers — and that's a serious safety risk for everyone.",
          },
          {
            id: "four_way_flashers",
            title: "Four-Way Flashers",
            description:
              "Activate the hazard lights and verify both turn signal indicators on the dash flash simultaneously.",
            whyItMatters:
              "Four-way flashers are your distress signal. When you're pulled over on the shoulder or moving slowly, these lights warn other drivers. If they don't work, you're invisible when you're most vulnerable.",
          },
        ],
      },
      {
        id: "comfort_and_safety",
        title: "Comfort & Safety",
        whyItMatters:
          "Comfort isn't a luxury — it's a safety feature. A fogged windshield or freezing cab distracts you from the road. A working horn is your voice in traffic. These checks keep you comfortable, focused, and heard.",
        items: [
          {
            id: "heater",
            title: "Heater",
            description:
              "Turn the heater on and confirm it is working, producing warm air, and works properly on all speeds to keep the cab and windshield clear.",
            whyItMatters:
              "A working heater prevents windshield fogging in cold weather. Fogged glass in a 40-ton vehicle is a disaster waiting to happen.",
          },
          {
            id: "defroster",
            title: "Defroster",
            description:
              "Turn the defroster on and confirm air flows from the defrost vents, works properly on all speeds, and keeps the windshield clear of fog and ice.",
            whyItMatters:
              "The defroster is your fog-fighting tool. Without it, your windshield can cloud over in seconds — especially when temperature changes quickly, like pulling out of a warm garage into freezing air.",
          },
          {
            id: "horn",
            title: "Horn",
            description:
              "Check both the air horn and the electric horn to be sure they work and are loud enough to warn others.",
            whyItMatters:
              "Your horn is your voice on the road. When a car drifts into your lane or a pedestrian doesn't see you, those few decibels can prevent a collision.",
          },
        ],
      },
{
        id: "gauges_and_controls",
        title: "Gauges & Controls",
        whyItMatters:
          "Gauges tell you what's happening under the hood before you feel it. Steering play determines whether you react in time. These are the systems you trust with your life at every merge, every corner, every stop.",
        items: [
          {
            id: "gauges_item",
            title: "Gauges",
            description:
              "With the engine running, confirm oil pressure, air pressure, temperature, voltage, and other gauges read in the normal range.",
            whyItMatters:
              "Gauges are your truck's vital signs. Low oil pressure or overheating can destroy an engine — and more importantly, cause a breakdown or loss of control on the highway.",
          },
          {
            id: "steering_components",
            title: "Steering Components",
            description:
              "Check the steering wheel for excessive play (no more than about 10 degrees, or 2 inches on a 20-inch wheel). The steering wheel and column should be secure.",
            whyItMatters:
              "Excessive steering play means delayed response when you turn the wheel. In an emergency maneuver, those lost inches of movement translate to lost feet on the road — and that can be catastrophic.",
          },
        ],
      },
      {
        id: "visibility_check",
        title: "Visibility Check",
        sectionCoachIntro:
          "While the air pressure is building, let's scan the cab exactly the way we would during the CDL test.",
        memoryToolAcronym: "PMS · BCD",
        memoryToolItems: [
          { id: "pms", letter: "PMS", label: "Properly Mounted and Secured" },
          { id: "bcd", letter: "BCD", label: "Not Broken, Cracked, or Damaged" },
        ],
        memoryToolCoachTip:
          "Your mirrors are your eyes everywhere your windshield can't see. Before you move the truck, make sure they're clean and adjusted to you.",
        whyItMatters:
          "Professional drivers must maintain clear visibility in all weather conditions. A clean windshield, properly operating wipers, good wiper blades, and functioning washer fluid system help ensure safe driving during rain, snow, and road spray.",
        completionTitleOverride: "Excellent!",
        completionBodyOverride:
          "Clear visibility is one of a professional driver's greatest safety tools.",
        completionCoachMessageOverride:
          "If you can't see it, you can't avoid it. Your mirrors are your eyes everywhere your windshield can't see.",
        items: [
          {
            id: "vc_mirrors",
            title: "Traffic Monitoring Devices (Mirrors)",
            description:
              "My traffic monitoring devices (mirrors) are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are clean.\nThere are no illegal stickers.\nThey are adjusted to me from the inside.",
            whyItMatters:
              "Traffic monitoring devices help the driver monitor traffic, eliminate blind spots, and safely change lanes, turn, and back the vehicle. Professional drivers verify that mirrors are properly mounted, clean, adjusted, and free of damage before every trip. Use PMS for properly mounted and secured, and BCD — not broken, cracked, or damaged.",
          },
          {
            id: "vc_windshield",
            title: "Windshield",
            description:
              "The windshield is clean.\nThere are no illegal stickers, cracks or damage.\nMy view is not obstructed.",
            whyItMatters:
              "A clean, undamaged windshield is your primary window to the road. Cracks and obstructions delay your reaction time — and in a commercial vehicle, every fraction of a second counts.",
          },
          {
            id: "vc_wipers",
            title: "Windshield Wipers",
            description:
              "The windshield wipers are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey operate properly and work on all speeds.",
            whyItMatters:
              "Wipers that don't work in rain or snow leave you blind at highway speed. This is a quick check that can prevent a catastrophe.",
          },
          {
            id: "wiper_blades",
            title: "Wiper Blades",
            description:
              "The wiper blades are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThe rubber is in good condition and flush with the windshield.",
            whyItMatters:
              "Loose or damaged wiper blades won't make proper contact with the glass. In heavy weather, that means streaks and reduced visibility — exactly when you need them most. PMS and BCD apply here: properly mounted means they stay on at highway speed, and undamaged rubber means a clean sweep every time.",
          },
          {
            id: "washer_fluid",
            title: "Washer Fluid",
            description:
              "The windshield washer fluid system is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt operates properly.",
            whyItMatters:
              "Road spray, bugs, and dust can coat your windshield in seconds. Working washer fluid clears your view instantly — without it, you're driving blind until you can pull over safely.",
          },
        ],
      },
    ],
  },
  {
    id: "service-brake",
    title: "Service Brake Test",
    subtitle: "Explain how the service brake test is performed",
    icon: FileText,
    items: [],
    subsections: [
      {
        id: "service_brake_test",
        title: "Service Brake Test",
        sectionCoachIntro:
          "There isn't enough room to safely perform the actual Service Brake Test, so during the CDL test we explain how we would perform it.",
        whyItMatters:
          "These tests verify that the parking brakes and service brakes operate properly before the vehicle is driven. A service brake that pulls to one side, grabs unevenly, or fails to stop the vehicle smoothly is a danger to the driver and everyone on the road.",
        completionTitleOverride: "Excellent!",
        completionBodyOverride:
          "Professional drivers verify that every braking system is working correctly before every trip.",
        items: [
          {
            id: "service_brake_test_procedure",
            title: "Service Brake Test Procedure",
            description:
              "With both air tanks at pressure cut-off, I would release both the tractor and trailer parking brakes.\nShift into a forward gear.\nGently accelerate to approximately 5 MPH.\nApply the service brakes.\nThe vehicle should stop smoothly without pulling to the left or right, which would indicate a brake problem.\nThe vehicle should come to a complete stop.",
            whyItMatters:
              "The service brake test checks that your main braking system works evenly and smoothly. If the vehicle pulls to one side under braking, you have a brake imbalance — and in an emergency stop at highway speed, that imbalance can cause a jackknife or rollover. This test catches brake problems before they catch you on the road.",
          },
        ],
      },
    ],
  },
  {
    id: "parking-brake-tug",
    title: "Parking Brake (Tug) Test",
    subtitle: "Verify each parking brake holds the vehicle",
    icon: Lock,
    items: [],
    subsections: [
      {
        id: "parking_brake_tug",
        title: "Parking Brake (Tug) Test",
        sectionCoachIntro:
          "Now let's verify each parking brake can hold the vehicle independently.",
        whyItMatters:
          "These tug tests verify that the parking brakes can hold the vehicle independently. If either parking brake fails to hold during a simple tug test, it will fail on a grade with a full load — and that puts everyone on the road at risk. Professional drivers verify their brakes before every trip.",
        items: [
          {
            id: "tractor_parking_brake_tug",
            title: "Tractor Parking Brake Applied (Button OUT)",
            description:
              "Apply the Tractor Parking Brake (Button OUT).\nRelease the Trailer Parking Brake (Button IN).\nShift into a forward gear.\nGently tug against the tractor parking brake.\nThe tractor parking brake holds.",
            whyItMatters:
              "The tractor parking brake must hold the vehicle on its own. If it slips during the tug test, it won't hold on a grade either. This is your first line of defense when parked — make sure it's solid.",
          },
          {
            id: "trailer_parking_brake_tug",
            title: "Trailer Parking Brake Applied (Button OUT)",
            description:
              "Apply the Trailer Parking Brake (Button OUT).\nRelease the Tractor Parking Brake (Button IN).\nShift into a forward gear.\nGently tug against the trailer parking brake.\nThe trailer parking brake holds.",
            whyItMatters:
              "The trailer parking brake is equally important. A fully loaded trailer on a grade needs its own parking brake to hold — the tractor brake alone may not be enough. Testing both independently proves each system works.",
          },
          {
            id: "rebuild_air_pressure_sneeze2",
            title: "Governor Cut-Out (Sneeze #2)",
            description:
              "After completing both tug tests:\nApply both parking brakes.\nPlace the transmission in Neutral.\nAllow the air pressure to rebuild until the Governor Cut-Out occurs at approximately 120 to 140 PSI.\nCoach William calls this: Governor Cut-Out (Sneeze #2)",
            whyItMatters:
              "After using air during the tug tests, the system needs to recharge before the Air Brake Test. The Governor Cut-Out confirms the compressor and governor are working correctly. Coach William calls this Sneeze #2 — a friendly reminder that the air system is fully charged and ready for the next test.",
          },
        ],
      },
    ],
  },
  {
    id: "light-ops",
    title: "Light Operations Check",
    subtitle: "Verify all lights operate correctly",
    icon: Zap,
    items: [],
    subsections: [
      {
        id: "light_operations_check",
        title: "Light Operations Check",
        sectionCoachIntro:
          "Before exiting the truck, let's perform the Light Operations Check exactly as you would during the CDL examination.",
        whyItMatters:
          "Professional drivers verify that all required lights operate correctly so other motorists can clearly see their intentions and the vehicle remains compliant with safety regulations.",
        completionTitleOverride: "Excellent!",
        completionBodyOverride:
          "You completed the Light Operations Check just as you would during the CDL examination.\n\nNow let's move to the Front of Tractor Inspection.",
        items: [
          {
            id: "light_check_intro",
            title: "Tell the Examiner",
            description:
              "I will now perform the Light Operations Check.\nI will be checking:\n• Headlights (Low Beams and High Beams)\n• Left and Right Turn Signals\n• Four-Way Flashers\n• Clearance and Marker Lights\n• Tail Lights\n• Brake Lights",
            whyItMatters:
              "Announcing each light category before you begin shows the examiner you have a structured plan. The examiner knows exactly what to expect — and that confidence starts before the first switch is flipped.",
          },
          {
            id: "light_check_examiner_position",
            title: "Position the Examiner",
            description:
              "Please exit the vehicle and go to the front of the tractor to assist me with the light check.",
            whyItMatters:
              "The examiner needs to physically see each light as you activate it. Positioning them correctly before you start keeps the check efficient and professional — no wasted time, no confusion.",
          },
          {
            id: "light_check_window_down",
            title: "Roll Window Down — Key to ON",
            description:
              "Roll the driver's side window down.\nTurn the ignition key to the ON position — do NOT start the engine.\nCoach William says: keep the window down so the examiner can clearly hear every command.",
            whyItMatters:
              "With the window down and key on, the examiner can hear every light command clearly. A muffled voice through closed glass creates confusion — and confusion creates doubt in the examiner's mind.",
          },
          {
            id: "light_check_ask_examiner",
            title: "Ask the Examiner",
            description:
              "Ask the examiner in a loud, clear voice:\n\"Examiner, are my lights on?\"\nAfter the examiner confirms, begin the Light Operations Check by announcing each light one at a time.",
            whyItMatters:
              "This simple question does two things: it confirms the examiner is in position and ready, and it projects confidence. Coach William teaches that a loud, clear voice is the mark of a driver in command of their vehicle — and their test.",
          },
          {
            id: "front_of_tractor_lights",
            title: "Front of Tractor",
            description:
              "Speak in a loud, clear voice as you activate each light:\n• Low Beam Headlights\n• High Beam Headlights\n• Left Turn Signal\n• Right Turn Signal\n• Four-Way Flashers\n• Clearance Lights\n• Marker Lights",
            whyItMatters:
              "The front of the tractor is your first impression of the light check. Speaking each light loudly and clearly shows the examiner you're methodical and thorough — the hallmarks of a professional driver.",
          },
          {
            id: "side_of_tractor_lights",
            title: "Side of Tractor",
            description:
              "Verify all applicable lights are operating properly on both sides of the tractor.",
            whyItMatters:
              "Side marker and turn signal lights are what other drivers see when you're changing lanes or merging. A burned-out side light means the car beside you doesn't know your intentions.",
          },
          {
            id: "side_of_trailer_lights",
            title: "Side of Trailer",
            description:
              "Verify all applicable marker and clearance lights are operating properly on both sides of the trailer.",
            whyItMatters:
              "A 53-foot trailer needs side marker lights so other drivers can see its full length at night. Without them, the trailer becomes invisible from the side — a lethal hazard on dark highways and in bad weather.",
          },
          {
            id: "rear_of_trailer_lights",
            title: "Rear of Trailer",
            description:
              "Verify:\n• Tail Lights\n• Brake Lights\n• Left Turn Signal\n• Right Turn Signal\n• Four-Way Flashers\n• Clearance Lights",
            whyItMatters:
              "The rear lights are the most critical — they tell the driver behind you whether you're stopping, turning, or just cruising. A missing brake light means the car behind you won't know you're slowing down until it's too late.",
          },
          {
            id: "light_check_cleanup",
            title: "After the Light Check",
            description:
              "Turn the ignition key to the OFF position.\nExit the truck using Three Points of Contact.\nPlace the key in the outside door lock.\nCoach William says: now we're ready to begin the Front of Tractor Inspection.",
            whyItMatters:
              "Finishing the light check cleanly — key off, three points of contact, key secured — shows the examiner you're consistent from start to finish. Every step matters, including the last one before you step outside.",
          },
        ],
      },
    ],
  },
  {
    id: "front",
    title: "Front of Tractor Inspection",
    subtitle: "Start with the big picture",
    icon: Car,
    items: [],
    subsections: [
      {
        id: "front_of_tractor_overview",
        title: "Front of Tractor Overview",
        sectionCoachIntro:
          "Hero, before we inspect the details, take a look at the whole truck. A professional driver always starts with the big picture.",
        whyItMatters:
          "Start with the big picture, then inspect the details. Before walking around checking individual lights and components, a professional driver takes in the whole truck — looking for anything out of place, leaning, or leaking. This overview builds the habit of seeing the truck as a complete vehicle, not just a collection of parts.",
        memoryToolAcronym: "PMS · BCD",
        memoryToolItems: [
          { id: "pms", letter: "PMS", label: "Properly Mounted and Secured" },
          { id: "bcd", letter: "BCD", label: "Not Broken, Cracked, or Damaged" },
        ],
        memoryToolCoachTip:
          "PMS and BCD are your inspection friends. You'll say them so much they'll start riding shotgun.",
        items: [
          {
            id: "front_overview_inspection",
            title: "Front of Tractor Overview",
            description:
              "All my lights and reflectors are properly mounted and secured and not broken, cracked, or damaged.\nAll lenses are clean, are the correct color, and none are missing.\nThere are no leaks or puddles of fluid under my truck.\nThere is nothing hanging from underneath the truck.\nThe truck is not leaning to the left or right, which could indicate a suspension problem.",
            whyItMatters:
              "The Front of Tractor Overview is your first impression of the vehicle from the outside. A puddle of fluid could mean a brake, coolant, or oil leak. A truck leaning to one side could mean a broken spring — and that's a safety hazard before you even turn the key. Take in the whole picture before you inspect the details.",
          },
        ],
      },
    ],
  },
  {
    id: "passenger-side-engine",
    title: "Passenger Side Engine Compartment",
    subtitle: "General overview before individual components",
    icon: Eye,
    items: [],
    subsections: [
      {
        id: "passenger_side_overview",
        title: "Passenger Side Engine Compartment",
        sectionCoachIntro:
          "Before we inspect individual components, let's take a look at the engine compartment as a whole.",
        whyItMatters:
          "Start with the big picture, then inspect the details. That's how professional drivers avoid missing something important. This overview introduces the Core Inspection Language before inspecting individual engine components — PMS, BCD, CCF, no missing hardware, no evidence of damage, and I see or hear no leaks.",
        items: [
          {
            id: "general_engine_overview",
            title: "General Engine Compartment Overview",
            description:
              "All general hoses and hardware are present, properly mounted and secured, not broken, cracked, or damaged, and I see or hear no leaks.\nNo missing nuts, bolts or parts.",
            whyItMatters:
              "This overview applies the Core Inspection Language to the engine compartment as a whole. By starting broad before going deep, students build confidence and demonstrate the systematic approach that CDL examiners expect.",
          },
          {
            id: "passenger_all_hardware_present",
            title: "All Hardware Present",
            description:
              "All hardware is properly mounted and secured.\nThere is no missing hardware.\nThere are no missing nuts, bolts, or parts.\nVerify that all nuts, bolts, brackets, and fasteners are present, tight, and secure with nothing missing or loose.",
            whyItMatters:
              "Missing hardware is a red flag for any examiner — and for good reason. One missing bolt can mean a loose component, and a loose component at highway speed can become a catastrophic failure. Checking hardware early sets the tone for a thorough inspection.",
          },
        ],
      },
    ],
  },
  {
    id: "engine",
    title: "Driver Side Engine Compartment",
    subtitle: "Top-down inspection by system",
    icon: Cog,
    items: [],
    subsections: [
      {
        id: "engine_compartment",
        title: "Engine Compartment",
        sectionCoachIntro:
          "Hero, we're going to inspect from the top down. Stay with the same pattern every time, and you'll never miss anything.",
        whyItMatters:
          "The engine compartment contains the systems that keep your truck running and safe. Proper fluid levels prevent catastrophic engine failure. Secure hoses and hardware prevent leaks and breakdowns. A professional driver checks from the top down so nothing gets missed.",
        memoryToolAcronym: "COPS",
        memoryToolItems: [
          { id: "coolant", letter: "C", label: "Coolant" },
          { id: "oil", letter: "O", label: "Oil" },
          { id: "power_steering", letter: "P", label: "Power Steering" },
        ],
        memoryToolCoachTip:
          "Don't memorize three separate items. Remember COPS and let the acronym do the work.\n\nHero... whenever you check a fluid level, remember:\n• Cap on tight.\n• Between the ADD and FULL marks.\n• No leaks.",
        items: [
          {
            id: "general_hoses",
            title: "All General Hoses",
            description:
              "All general hoses are properly mounted and secured.\nThey are not cut, cracked, or frayed.\nThey are in good condition.\nI see or hear no leaks.",
            whyItMatters:
              "Hoses carry coolant, oil, air, and fuel throughout the engine. A single burst hose can spray boiling fluid, drain your cooling system, or cut off power steering — any of which can leave you stranded or cause a loss of control at highway speed. CCF is your vocabulary for flexible components: not cut, cracked, or frayed.",
          },
          {
            id: "all_hardware_present",
            title: "All Hardware Present",
            description:
              "All hardware is properly mounted and secured.\nThere is no missing hardware.\nThere are no missing nuts, bolts, or parts.",
            whyItMatters:
              "Missing hardware is a red flag for any examiner — and for good reason. One missing bolt can mean a loose component, and a loose component at highway speed can become a catastrophic failure. Checking hardware early sets the tone for a thorough inspection.",
          },
          {
            id: "coolant",
            title: "Coolant",
            description:
              "The coolant reservoir is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThe cap is on tight.\nThe coolant level is between the ADD and FULL marks.\nI see no leaks.",
            whyItMatters:
              "Coolant keeps your engine from overheating or freezing. A low level means a leak somewhere — and a leak can leave you stranded on the side of the road, or worse, cause an engine fire. Checking the cap is just as important as checking the level.",
          },
          {
            id: "engine_oil",
            title: "Oil",
            description:
              "I see no leaks.\nThe oil fill cap is present and tight.\nTo check the oil level, I remove the dipstick, wipe it clean, reinsert it completely, remove it again, and verify the oil level is between the ADD and FULL marks.",
            whyItMatters:
              "Oil is the lifeblood of your engine. Without it, metal grinds against metal until the engine seizes — and that can happen without warning at highway speed. The dipstick procedure matters: wiping it clean and reinserting fully ensures an accurate reading every time.",
          },
          {
            id: "power_steering_fluid",
            title: "Power Steering Fluid",
            description:
              "The power steering reservoir is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThe cap is on tight.\nThe fluid level is between the ADD and FULL marks.\nI see no leaks.",
            whyItMatters:
              "Losing power steering in a car is bad. Losing it in an 80,000-pound truck is a nightmare. The steering wheel becomes nearly impossible to turn, and if it happens in a curve or during a lane change, you may not have time to recover. Check that fluid every time.",
          },
        ],
      },
      {
        id: "steering_system",
        title: "Steering System",
        whyItMatters:
          "Your steering system is your primary connection to the road. Every component from the steering column to the cotter pins must be secure and undamaged. A failure in any part of the steering linkage means you lose control of the vehicle — and at highway speed, that's something you don't get a second chance to fix.",
        items: [
          {
            id: "steering_column",
            title: "Steering Column",
            description:
              "The steering column is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is securely attached to the dash and firewall.\nNo missing hardware.",
            whyItMatters:
              "The steering column transfers your input from the steering wheel to the steering gear box. A loose or damaged column means delayed or unpredictable steering response — and in an emergency maneuver, every fraction of a second counts.",
          },
          {
            id: "steering_gear_box",
            title: "Steering Gear Box",
            description:
              "The steering gear box is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is securely mounted to the frame.\nNo missing nuts, bolts, or parts.\nI see or hear no leaks.",
            whyItMatters:
              "The steering gear box converts rotation of the steering column into the lateral movement that turns your wheels. A loose steering gear box can cause excessive play in the steering, making the vehicle harder to control. Leaks from the gear box mean lost power steering fluid and eventually, no power assist.",
          },
          {
            id: "power_steering_hose",
            title: "Power Steering Hose",
            description:
              "The power steering hose is properly mounted and secured.\nIt is not cut, cracked, or frayed.\nIt is in good condition.\nI see or hear no leaks.",
            whyItMatters:
              "The power steering hose carries pressurized fluid from the pump to the gear box. A burst hose means instant loss of power steering — and at highway speed, that's a life-threatening emergency. CCF applies here: check that it's not cut, cracked, or frayed.",
          },
          {
            id: "steering_linkages",
            title: "Steering Linkages",
            description:
              "The steering linkages are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey have no excessive play.\nNo missing hardware.",
            whyItMatters:
              "Steering linkages connect the gear box to the wheels. Wear or looseness here translates directly to unresponsive steering. During the CDL test, the examiner will watch you physically check for play in every joint — because they know that's where dangerous wear shows up first.",
          },
          {
            id: "three_castle_nuts",
            title: "Three Castle Nuts",
            description:
              "All three castle nuts are present.\nThey are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are properly torqued.\nNo missing hardware.",
            whyItMatters:
              "Castle nuts secure critical steering linkage joints. If a castle nut backs off or is missing, the steering linkage can separate — and that means complete loss of steering control. Three castle nuts, three cotter pins: check every one.",
          },
          {
            id: "three_cotter_pins",
            title: "Three Cotter Pins",
            description:
              "All three cotter pins are present.\nThey are properly installed through the castle nuts.\nThey are not broken, cracked, or damaged.\nNo missing hardware.",
            whyItMatters:
              "Cotter pins lock castle nuts in place. A missing cotter pin means the castle nut can vibrate loose over time — and a loose castle nut can lead to steering linkage separation. This is one of the smallest parts you inspect, but one of the most important.",
          },
        ],
      },
      {
        id: "steer_axle_suspension_brakes",
        title: "Steer Axle / Suspension / Brakes",
        whyItMatters:
          "The steer axle, suspension, and brakes work together to keep your truck stable, controlled, and able to stop safely. Every component here carries enormous forces — a failure in any one part can cause a loss of control. Professional drivers inspect these systems knowing that everything riding on the steer axle is critical.",
        items: [
          {
            id: "leaf_springs",
            title: "Leaf Springs",
            description:
              "The leaf springs are properly mounted and secured.\nThey are not shifted.\nThey are not broken, cracked, or damaged.\nThere are no missing leaves.\nNo missing hardware.",
            whyItMatters:
              "Leaf springs carry the weight of the vehicle and its load. A shifted, cracked, or broken leaf spring compromises the entire suspension — throwing off handling, tire wear, and braking stability. PMS and BCD: every leaf must be intact and in position.",
          },
          {
            id: "spring_hangers",
            title: "Spring Hangers",
            description:
              "The spring hangers are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThere are no cracked or missing bolts.\nNo missing hardware.",
            whyItMatters:
              "Spring hangers anchor the leaf springs to the frame. If a hanger mount cracks or its bolts fail, the spring can separate from the frame — and that means immediate loss of suspension support. Every suspension component should pass the PMS and BCD test.",
          },
          {
            id: "spring_mounts",
            title: "Spring Mounts",
            description:
              "The spring mounts are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are securely attached to the frame.\nNo missing nuts, bolts, or parts.\nNo missing hardware.",
            whyItMatters:
              "Spring mounts transfer the vehicle's weight from the springs to the frame. A cracked mount can fail without warning, dropping the suspension and shifting the load — a catastrophic event at any speed. Check every mount bolt and bracket thoroughly.",
          },
          {
            id: "u_bolts",
            title: "U-Bolts",
            description:
              "The U-bolts are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are properly torqued.\nNo missing nuts.\nNo missing hardware.",
            whyItMatters:
              "U-bolts clamp the leaf springs to the axle. Loose or missing U-bolt nuts allow the axle to shift relative to the springs — changing your steering alignment instantly. On a steer axle, that means the truck can pull hard to one side. Check every nut.",
          },
          {
            id: "shock_absorber",
            title: "Shock Absorber",
            description:
              "The shock absorber is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is securely attached at both ends.\nI see or hear no leaks.\nNo missing hardware.",
            whyItMatters:
              "Shock absorbers control spring movement to keep your tires in contact with the road. A leaking or broken shock means the wheel bounces uncontrollably after every bump — reducing traction, increasing stopping distance, and making the truck harder to control.",
          },
          {
            id: "air_bags",
            title: "Air Bags (if equipped)",
            description:
              "The air bags are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are properly inflated — not collapsed.\nI see or hear no leaks.\nNo missing hardware.",
            whyItMatters:
              "Air bags supplement or replace leaf springs on many modern trucks for improved ride quality and load leveling. A collapsed or leaking air bag means the suspension can't support the vehicle's weight properly — causing uneven tire wear, poor handling, and potential component damage.",
          },
          {
            id: "brake_hoses",
            title: "Brake Hose",
            description:
              "The brake hose is properly mounted and secured.\nIt is not cut, cracked, or frayed.\nIt is in good condition.\nI see or hear no air leaks.\nNo missing hardware.",
            whyItMatters:
              "Brake hoses carry compressed air to the brake chambers. A cut or cracked hose means lost air pressure — and lost air pressure means lost braking power. CCF applies here: every inch of brake hose must pass the cut, cracked, or frayed check. Your brakes are only as strong as the hoses that feed them.",
          },
          {
            id: "brake_chamber",
            title: "Brake Chamber",
            description:
              "The brake chamber is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is securely attached to the axle.\nThe slack adjuster is properly set.\nI see or hear no air leaks.\nNo missing hardware.",
            whyItMatters:
              "The brake chamber converts air pressure into the mechanical force that applies your brakes. A leaking chamber means lost braking power at that wheel — and a brake imbalance at highway speed can cause a jackknife or rollover. Listen for air leaks and check that the chamber is securely mounted.",
          },
          {
            id: "brake_drum",
            title: "Brake Drum",
            description:
              "The brake drum is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt has no heat cracks or scoring.\nNo missing hardware.",
            whyItMatters:
              "Brake drums take enormous heat and friction every time you stop. Cracks in a drum can spread rapidly under heavy braking, causing the drum to shatter. Heat cracks and scoring reduce braking efficiency — meaning longer stopping distances when you need them shortest.",
          },
          {
            id: "brake_linings",
            title: "Brake Linings",
            description:
              "The brake linings are properly mounted and secured.\nThey are not worn dangerously thin.\nThere is no oil or grease on the brake linings.\nNo missing hardware.",
            whyItMatters:
              "Brake linings are the friction material that stops the truck. Worn linings mean longer stopping distances. Oil or grease contamination on the linings means that wheel won't brake at all — and a brake imbalance at highway speed can cause a jackknife or rollover. This check is non-negotiable.",
          },
        ],
      },
    ],
  },
  {
    id: "driver-side",
    title: "Driver Side Inspection",
    subtitle: "Tires, wheels, brakes and fuel",
    icon: Disc3,
    items: [
      {
        id: "tire_condition",
        title: "Tire Condition",
        description:
          "The tire is properly inflated.\nTo verify the tire pressure, I would use a DOT-approved tire pressure gauge.\nThe tire sidewall has no Abrasions, Bulges, or Cuts (ABC).\nThere are no exposed cords.\nThe tire has even wear.",
        whyItMatters:
          "Your steer tires are the ONLY thing connecting 80,000 pounds to the road. A blowout on a steer tire at highway speed is one of the most dangerous situations a truck driver can face. Bulges and cuts are blowouts waiting to happen.\n\nCoach William's Memory Tool:\nABC\nA = No Abrasions\nB = No Bulges\nC = No Cuts",
      },
      {
        id: "tread_depth",
        title: "Tread Depth",
        description:
          "To verify tread depth, I would use a DOT-approved tire tread depth gauge.\nSteer tires must have a minimum tread depth of 4/32 of an inch.\nAll other tires on the vehicle must have a minimum tread depth of 2/32 of an inch.",
        whyItMatters:
          "Tread depth is your grip on the road. Worn tires can't channel water away, dramatically increasing the risk of hydroplaning. Steer tires carry the most critical load — that's why they require twice the tread depth.\n\nCoach William says: Remember, Hero — Steer Tires = 4/32, All Other Tires = 2/32.",
      },
      {
        id: "rims_and_lug_nuts",
        title: "Rims & Lug Nuts",
        description:
          "The rims and lug nuts are properly mounted and secured.\nThe rims are not bent or cracked.\nAll lug nuts are present, not loose, and free of rust streaks or shiny threads.\nNo missing hardware.",
        whyItMatters:
          "Rust streaks and shiny threads are signs of loose lug nuts. A wheel coming off at highway speed is a lethal projectile — to you and everyone around you. This is non-negotiable.",
      },
      {
        id: "door_and_mirror",
        title: "Door & Mirror",
        description:
          "The driver door and mirror are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThe door opens, closes, and latches properly.\nThe mirror and bracket are secure and clean.",
        whyItMatters:
          "A door that won't latch is an ejection risk in a collision. A loose mirror can vibrate so badly you can't see anything — and that's your primary view of what's beside you.",
      },
      {
        id: "fuel_tank",
        title: "Fuel Tank",
        description:
          "The fuel tank is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThe cap is tight.\nI see or hear no leaks from the tank or lines.",
        whyItMatters:
          "A leaking fuel tank is a rolling fire hazard. Diesel on the roadway is also a skid risk for every vehicle behind you. A secure cap prevents both spillage and contamination.",
      },
      {
        id: "def_tank",
        title: "DEF Tank",
        description:
          "The DEF tank is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThe cap is present and secure.\nI see or hear no leaks.",
        whyItMatters:
          "DEF (Diesel Exhaust Fluid) is required for modern diesel engines to meet emissions standards. A cracked or leaking DEF tank means contaminated fluid, which can trigger engine derate or prevent the engine from starting. PMS and BCD apply here — properly mounted and secured, not broken, cracked, or damaged.",
      },
      {
        id: "battery_box",
        title: "Battery Box",
        description:
          "The battery box is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThe battery box cover is securely fastened.\nThe battery cable connections are tight.\nThere is no corrosion present on the battery terminals.\nI see no leaks or damage.",
        whyItMatters:
          "The battery box protects your batteries from road debris, weather, and vibration. A loose cover can fly off and become a hazard for vehicles behind you. Corrosion on the terminals reduces electrical conductivity — meaning hard starts, dim lights, and unreliable electronics. Loose cable connections can cause intermittent power loss to critical systems while you're driving.",
      },
    ],
  },
  {
    id: "back",
    title: "Rear of Tractor",
    subtitle: "Lights, floor, and frame structure",
    icon: Eye,
    items: [],
    subsections: [
      {
        id: "back_of_tractor_overview",
        title: "Back of Tractor",
        sectionCoachIntro:
          "Now let's walk around to the back of the tractor. Start with the lights and work down to the structure.",
        whyItMatters:
          "The back of the tractor is where the coupling system lives. Before inspecting the fifth wheel and air lines, professional drivers check that all rear lights, lenses, and DOT reflective tape are in order — then verify the floor and frame are sound. A cracked frame or missing reflective tape can fail an inspection before you even reach the trailer.",
        memoryToolAcronym: "PMS · BCD",
        memoryToolItems: [
          { id: "pms", letter: "PMS", label: "Properly Mounted and Secured" },
          { id: "bcd", letter: "BCD", label: "Not Broken, Cracked, or Damaged" },
        ],
        memoryToolCoachTip:
          "PMS and BCD ride with you everywhere. The back of the tractor is no different — check every light, every reflector, every lens the same way.",
        items: [
          {
            id: "back_overview_lights",
            title: "Back of Tractor Overview",
            description:
              "All my lights, lenses, and DOT reflective tape are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nAll lenses are clean, the correct color, and none are missing.",
            whyItMatters:
              "The back of the tractor faces every vehicle behind you. Clean, correct-color lenses and DOT reflective tape make your truck visible at night and in bad weather. Missing or damaged reflective tape can lead to a citation — and more importantly, a driver who can't see you until it's too late.",
          },
        ],
      },
      {
        id: "floor_check",
        title: "Floor Check",
        whyItMatters:
          "The floor of the tractor and trailer must be capable of supporting passengers and cargo. A cracked, rusted, or weakened floor is a structural failure waiting to happen — and in a collision, it can mean the difference between the cab holding together and coming apart.",
        items: [
          {
            id: "floor_check_item",
            title: "Floor Check",
            description:
              "The floor of my tractor is not broken, cracked, or damaged and is capable of supporting passengers.\nThe floor of my trailer is not broken, cracked, or damaged and is capable of supporting cargo.",
            whyItMatters:
              "The floor is what separates you from the road — and your cargo from everyone behind you. Rust-through, cracks, or soft spots mean the floor has lost its structural integrity. A trailer floor that fails under load can drop cargo onto the highway, creating a lethal hazard for every vehicle behind you.",
          },
        ],
      },
      {
        id: "tractor_structure",
        title: "Tractor Structure",
        whyItMatters:
          "Steel is strong, but it's not invincible. Cracks spread. Rust weakens. Illegal welds hide damage that should have been properly repaired. Illegal holes compromise the frame's engineered strength. Professional drivers inspect every structural member knowing that the frame is the backbone of the rig.",
        memoryToolAcronym: "PMS · BCD",
        memoryToolItems: [
          { id: "pms", letter: "PMS", label: "Properly Mounted and Secured" },
          { id: "bcd", letter: "BCD", label: "Not Broken, Cracked, or Damaged" },
        ],
        memoryToolCoachTip:
          "Steel doesn't lie to you. If you see an illegal weld or an illegal hole, that frame has been compromised. Say it out loud — the examiner expects to hear it.",
        items: [
          {
            id: "frame_of_tractor",
            title: "Frame of the Tractor",
            description:
              "It is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThere are no illegal welds.\nThere are no illegal holes.",
            whyItMatters:
              "The frame is the truck's skeleton. Cracks in the frame rails can spread until the frame separates — a catastrophic failure that leaves you with no control. Illegal welds hide prior damage and weaken the steel. Illegal holes drilled for aftermarket equipment compromise the engineered strength of the frame. Check every inch you can see.",
          },
          {
            id: "cross_members",
            title: "Cross Members",
            description:
              "It is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThere are no illegal welds.\nThere are no illegal holes.",
            whyItMatters:
              "Cross members tie the frame rails together and prevent twisting. A cracked or missing cross member lets the frame flex beyond its design limits — and that flexing concentrates stress on the remaining members until they fail too. One bad cross member can trigger a chain reaction of frame damage.",
          },
          {
            id: "catwalk",
            title: "Catwalk",
            description:
              "It is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThere are no illegal welds.\nThere are no illegal holes.",
            whyItMatters:
              "The catwalk provides a safe, secure platform for the driver to stand on while connecting, disconnecting, or inspecting the air and electrical lines between the tractor and trailer. A weakened or rusted catwalk can collapse under your weight — and a fall from the back of a tractor means broken bones or worse. Illegal welds and holes turn a safety platform into a trap.",
          },
        ],
      },
    ],
  },
  {
    id: "coupling",
    title: "Coupling System",
    subtitle: "Bottom-up inspection of the fifth wheel and connections",
    icon: Link2,
    items: [],
    subsections: [
      {
        id: "coupling_system",
        title: "Coupling System",
        sectionCoachIntro:
          "Hero, inspect the coupling system from the bottom up. Follow the same order every time.",
        whyItMatters:
          "The coupling system is the only connection between the tractor and trailer. Every component — from the air lines to the locking jaws — must be secure and undamaged. A failure here means trailer separation, and that's one of the most dangerous events in trucking. Professional drivers inspect the coupling system from the bottom up so nothing gets overlooked.",
        memoryToolAcronym: "PMS · BCD · CCF",
        memoryToolItems: [
          { id: "pms", letter: "PMS", label: "Properly Mounted and Secured" },
          { id: "bcd", letter: "BCD", label: "Not Broken, Cracked, or Damaged" },
          { id: "ccf", letter: "CCF", label: "Not Cut, Cracked, or Frayed" },
        ],
        memoryToolCoachTip:
          "Hero, inspect the coupling system from the bottom up. Follow the same order every time.",
        completionTitleOverride: "Solid Connection!",
        completionBodyOverride:
          "You've mastered the coupling system — the most critical connection on the rig.",
        items: [
          {
            id: "air_lines",
            title: "Air Lines",
            description:
              "The air lines are connected from the tractor to the trailer.\nThey are properly mounted and secured.\nThey are not cut, cracked, or frayed.\nThey are not chafed, spliced, taped, or excessively worn.\nThey are not pinched, tangled, or crimped.\nThey are not rubbing or touching the catwalk.\nThe rubber seals (grommets) are present, in good condition, and provide a proper seal.\nThe glad hands are properly connected.\nI hear no air leaks.",
            whyItMatters:
              "Your trailer brakes depend on these air lines. A kinked, pinched, or disconnected air line means no trailer brakes — and without trailer brakes, you can't stop safely with a load. Chafing against the catwalk is one of the most common causes of air line failure. CCF applies here: every inch of hose must pass the cut, cracked, or frayed check.",
          },
          {
            id: "electrical_line",
            title: "Electrical Line",
            description:
              "The electrical line is connected from the tractor to the trailer.\nIt is properly mounted and secured.\nIt is not cut, cracked, or frayed.\nIt is not chafed, spliced, taped, or excessively worn.\nIt is not pinched, tangled, or crimped.\nIt is not rubbing or touching the catwalk.\nThe electrical connector is securely connected.",
            whyItMatters:
              "The electrical line powers every light on your trailer. Chafing, pinching, or exposed wiring can cause intermittent or failed lights — and a trailer without lights at night is invisible. CCF applies: inspect the entire length from the tractor to the trailer for cuts, cracks, or frayed insulation.",
          },
          {
            id: "glad_hands",
            title: "Glad Hands",
            description:
              "The glad hands are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThe rubber seals are in good condition — not dry, cracked, or worn.\nThey are securely connected and not crossed.\nI see or hear no air leaks.\nNo missing hardware.",
            whyItMatters:
              "Glad hands are the quick-connect fittings that join the tractor and trailer air systems. Worn seals cause air leaks that reduce braking power. Crossed glad hands reverse the service and emergency lines — meaning your trailer brakes won't work when you need them most. PMS and BCD: check every seal, every connection.",
          },
          {
            id: "electrical_connector",
            title: "Electrical Connector",
            description:
              "The electrical connector is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nThe pins are clean and not corroded or bent.\nIt is securely connected with a good seal.\nNo missing hardware.",
            whyItMatters:
              "The electrical connector powers every light on your trailer. Corroded or bent pins cause intermittent or failed lights — and a trailer without lights at night is invisible. A good seal keeps moisture and road salt out of the connection.",
          },
          {
            id: "apron",
            title: "Apron",
            description:
              "The apron is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is not bent or warped.\nIt rests firmly on the fifth wheel skid plate.\nNo missing hardware.",
            whyItMatters:
              "The apron is the flat plate on the underside of the trailer that sits on the fifth wheel. A bent or warped apron won't make full contact with the skid plate — creating uneven wear and an unstable connection. This is where the trailer's weight transfers to the tractor.",
          },
          {
            id: "skid_plate",
            title: "Skid Plate",
            description:
              "The skid plate is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is properly greased.\nThere is no gap between the apron and the skid plate, indicating the trailer is properly coupled to the fifth wheel.\nNo missing hardware.",
            whyItMatters:
              "The skid plate is the fifth wheel's contact surface. Without proper grease, metal grinds against metal — creating friction, heat, and dangerous wear. If you see a gap between the apron and the skid plate, the trailer is not fully seated on the fifth wheel. That gap means the kingpin may not be locked, and that trailer could separate at any moment.",
          },
          {
            id: "fifth_wheel",
            title: "Fifth Wheel",
            description:
              "The fifth wheel is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is properly greased.\nThere is no visible space between the upper and lower fifth wheel plates.\nNo missing hardware.",
            whyItMatters:
              "The fifth wheel is the heart of the coupling system — it carries the front of the trailer and allows it to pivot during turns. Grease is essential for smooth articulation. Space between the upper and lower plates means wear or damage that compromises the entire connection.",
          },
          {
            id: "fifth_wheel_mounts",
            title: "Fifth Wheel Mounts",
            description:
              "The fifth wheel mounts and mounting bolts are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nAll mounting bolts are present and tight.\nNo missing hardware.\nNo missing nuts, bolts, or parts.",
            whyItMatters:
              "The fifth wheel mounts anchor the entire coupling system to the tractor frame. If those mounting bolts fail, the fifth wheel — and your trailer — separates from the tractor. There is no recovering from that at highway speed. Check every bolt.",
          },
          {
            id: "fifth_wheel_platform",
            title: "Fifth Wheel Platform",
            description:
              "The fifth wheel platform is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is securely attached to the tractor frame.\nNo missing hardware.\nNo missing nuts, bolts, or parts.",
            whyItMatters:
              "The fifth wheel platform is the structural base that supports the fifth wheel and transfers the trailer's weight to the tractor frame. Cracks or loose attachments here compromise the entire coupling system — and a platform failure under load is catastrophic.",
          },
          {
            id: "kingpin",
            title: "Kingpin",
            description:
              "The kingpin should be straight, securely mounted, and not bent, cracked, broken, excessively worn, or damaged.",
            whyItMatters:
              "The kingpin is the steel pin that locks the trailer to the fifth wheel — it's the single point that holds the entire trailer to the tractor. A bent, cracked, or worn kingpin can shear off under load, and a sheared kingpin means instant trailer separation. This is the most critical connection on the entire rig: if the kingpin fails, nothing else matters.",
          },
          {
            id: "locking_jaws",
            title: "Locking Jaws",
            description:
              "The locking jaws are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are fully closed and locked around the shank of the kingpin — not the head of the kingpin.\nNo missing hardware.",
            whyItMatters:
              "The locking jaws grip the kingpin to secure the trailer to the fifth wheel. If the jaws close around the head instead of the shank, the kingpin can pull free when you accelerate or hit a bump. That's a trailer separation — one of the most dangerous events in trucking. Always verify the jaws are locked around the shank.",
          },
          {
            id: "release_arm_safety_latch",
            title: "Release Arm and Safety Latch",
            description:
              "The release arm and safety latch are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThe release arm is in the locked position.\nThe safety latch is engaged over the release arm.\nNo missing hardware.",
            whyItMatters:
              "The safety latch is the backup that prevents the release arm from accidentally opening during travel. Without it, road vibration can work the arm loose over hundreds of miles — and a loose release arm means a loose trailer. This small latch is your last line of defense against an accidental uncoupling.",
          },
          {
            id: "sliding_fifth_wheel",
            title: "Sliding Fifth Wheel",
            description:
              "The sliding fifth wheel is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is properly positioned and locked.\nThe locking pins are fully seated.\nIt is not so far back that it strikes the cab or landing gear.\nNo missing hardware.",
            whyItMatters:
              "The sliding fifth wheel lets you adjust weight distribution between the steer and drive axles. If it's too far back, you lose steer axle traction — dangerous in turns and braking. Too far forward and it can strike the cab or landing gear on tight turns. Check that the locking pins are fully seated before every trip.",
          },
          {
            id: "fifth_wheel_position",
            title: "Fifth Wheel Position",
            description:
              "The fifth wheel is positioned properly, allowing the tractor to clear the landing gear during turns.",
            whyItMatters:
              "The fifth wheel position determines how much space exists between the tractor and the trailer. If it's too far forward, the tractor frame can strike the landing gear or trailer during sharp turns. If it's too far back, you lose proper weight distribution on the steer axle. A properly positioned fifth wheel ensures safe turning clearance and stable handling.",
          },
        ],
      },
    ],
  },
  {
    id: "trailer",
    title: "Trailer Inspection",
    subtitle: "Frame, gear, doors and lights",
    icon: Truck,
    items: [
      {
        id: "landing_gear",
        title: "Landing Gear",
        description:
          "The landing gear is properly mounted and secured.\nIt is not broken, cracked, or damaged.\nIt is fully raised and the handle is secured.\nThe support frame and crank handle are not damaged or missing.\nNo missing hardware.",
        whyItMatters:
          "Landing gear that isn't fully raised can catch on railroad crossings, speed bumps, or uneven pavement — potentially ripping the landing gear off or destabilizing the trailer.",
      },
      {
        id: "frame_cross_members",
        title: "Frame & Cross Members",
        description:
          "The trailer frame, cross members, and support braces are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are not bent or rusted through.",
        whyItMatters:
          "The frame is the trailer's skeleton. Cracks and rust weaken it until it fails — and when a trailer frame fails under load, the results are catastrophic for you and everyone around you.",
      },
      {
        id: "tandem_release_arm",
        title: "Tandem Release Button (Arm)",
        description:
          "The tandem release button (arm) and locking pins are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThe tandem release operates properly.\nThe locking pins fully engage when the tandems are locked.",
        whyItMatters:
          "If the tandem pins aren't fully seated, the axles can slide freely under braking or acceleration. That means sudden, unpredictable weight shifts — and possible loss of control.",
      },
      {
        id: "trailer_tires",
        title: "Tires, Rims & Lug Nuts",
        description:
          "The trailer tires, rims, and lug nuts are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nTread depth is at least 2/32 inch with correct inflation.\nAll lug nuts are present and tight.\nNo missing hardware.",
        whyItMatters:
          "Trailer tire blowouts are common and dangerous. A blown trailer tire can throw debris, damage other vehicles, and cause the trailer to sway violently — potentially jackknifing the entire rig.",
      },
      {
        id: "trailer_brakes",
        title: "Brakes & Suspension",
        description:
          "The trailer brakes and suspension are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThe hoses are not cut, cracked, or frayed.\nBrake chambers, drums, and slack adjusters are in good condition.\nSprings, hangers, and U-bolts are undamaged.\nI see or hear no leaks.",
        whyItMatters:
          "Your trailer carries the load — and its brakes do half the stopping. Damaged trailer brakes force the tractor to do all the work, dramatically increasing stopping distance and the risk of jackknifing.",
      },
      {
        id: "trailer_lights",
        title: "Lights & Reflectors",
        group: "Rear of Trailer",
        description:
          "The trailer lights and reflectors are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are clean, the proper color, and working.",
        whyItMatters:
          "At night, your lights and reflectors tell other drivers where your trailer begins and ends. A missing light can make your 53-foot trailer invisible from the side — and side-impact collisions with trailers are often fatal.",
      },
      {
        id: "doors_and_ties",
        title: "Doors & Ties",
        group: "Rear of Trailer",
        description:
          "The trailer doors, hinges, and ties are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nCargo, if any, is properly secured.",
        whyItMatters:
          "A trailer door that swings open on the highway is a lethal hazard. Unsecured cargo can shift, fall out, or cause the trailer to become unbalanced — endangering everyone on the road.",
      },
      {
        id: "mud_flaps",
        title: "Mud Flaps & Splash Guards",
        group: "Rear of Trailer",
        description:
          "The mud flaps and splash guards are properly mounted and secured.\nThey are not broken, cracked, or damaged.\nThey are not torn, dragging, or missing.",
        whyItMatters:
          "Mud flaps protect vehicles behind you from rocks, debris, and road spray. A missing flap means you're spraying everything behind you — and in rain, that spray can blind the driver behind you completely.",
      },
    ],
    finalStatement: {
      title: "Final Examiner Statement",
      statement: "This concludes my Outside Pre-Trip Inspection.",
      note: "Before saying this, if you think you may have forgotten an inspection item, you are allowed to return and inspect it before telling the examiner you have finished.",
    },
  },
  {
    id: "cdl-numbers",
    title: "CDL Numbers to Remember",
    subtitle: "Key measurements and pressure values",
    icon: Brain,
    items: [],
    subsections: [
      {
        id: "cdl_numbers_to_remember",
        title: "CDL Numbers to Remember",
        sectionCoachIntro:
          "Hero, don't try to memorize the whole inspection. Memorize the important numbers, and the rest will start falling into place.",
        whyItMatters:
          "Many students lose points simply because they forget important measurements and pressure values. Reviewing these numbers together helps build confidence and improves recall during the CDL examination.",
        memoryToolAcronym: "Key Numbers",
        memoryToolItems: [
          { id: "steer_tread_depth", letter: "Steer Tires", label: "4/32 inch" },
          { id: "other_tread_depth", letter: "All Other Tires", label: "2/32 inch" },
          { id: "governor_cutout", letter: "Governor Cut-Out", label: "120 to 140 PSI" },
          { id: "low_air_warning", letter: "Low Air Warning", label: "Before 55 PSI" },
          { id: "parking_popout", letter: "Parking Brake Pop-Out", label: "45–20 PSI" },
          { id: "air_leakage", letter: "Air Leakage Rate Test", label: "Max 4 PSI / 1 min" },
        ],
        memoryToolCoachTip:
          "Don't memorize words—understand the inspection. When you know why you're checking each part, it's much easier to remember.",
        completionTitleOverride: "Excellent!",
        completionBodyOverride:
          "These numbers will serve you well during the CDL examination and throughout your career as a professional driver.",
        completionCoachMessageOverride:
          "When the examiner asks for a number, you'll know it cold. That's what preparation looks like.",
        items: [],
      },
    ],
  },
];

export const airBrakeMeta = {
  id: "air-brake",
  title: "Air Brake Test Coach",
  subtitle: "Learn, recall, practice, pass",
  icon: GaugeCircle,
};

// ── Guided Learning Flow ────────────────────────────────────────────────────
// The ordered list of inspection sections a student works through from start to
// finish. The Trailer Inspection is the final step — completing it triggers the
// Coach William Graduation screen instead of navigating forward.
export type GuidedFlowEntry = {
  id: string;
  title: string;
  /** Route to open the section. */
  route: string;
};

export const guidedFlow: GuidedFlowEntry[] = [
  { id: "in-cab", title: "In-Cab Inspection", route: "/inspection/in-cab" },
  { id: "service-brake", title: "Service Brake Test", route: "/inspection/service-brake" },
  { id: "parking-brake-tug", title: "Parking Brake (Tug) Test", route: "/inspection/parking-brake-tug" },
  { id: "light-ops", title: "Light Operations Check", route: "/inspection/light-ops" },
  { id: "front", title: "Front of Tractor", route: "/inspection/front" },
  { id: "passenger-side-engine", title: "Passenger Side Engine Compartment", route: "/inspection/passenger-side-engine" },
  { id: "engine", title: "Engine Compartment", route: "/inspection/engine" },
  { id: "driver-side", title: "Driver Side Inspection", route: "/inspection/driver-side" },
  { id: "back", title: "Back of Tractor", route: "/inspection/back" },
  { id: "coupling", title: "Coupling System", route: "/inspection/coupling" },
  { id: "trailer", title: "Trailer Inspection", route: "/inspection/trailer" },
];

/** Returns the next guided-flow entry after the given section id, or null if it is the final section. */
export function nextGuidedSection(currentId: string): GuidedFlowEntry | null {
  const idx = guidedFlow.findIndex((e) => e.id === currentId);
  if (idx < 0 || idx >= guidedFlow.length - 1) return null;
  return guidedFlow[idx + 1];
}

/** Returns the guided-flow entry for the given section id, or null. */
export function guidedSection(currentId: string): GuidedFlowEntry | null {
  return guidedFlow.find((e) => e.id === currentId) ?? null;
}

export const practiceMeta = {
  id: "practice",
  title: "Practice Test",
  subtitle: "Multiple-choice inspection quiz",
  icon: ClipboardCheck,
};

export const pressureChallengeMeta = {
  id: "pressure-challenge",
  title: "Pressure Challenge",
  subtitle: "Answer quickly under test pressure",
  icon: Zap,
};

export type AirBrakeStep = {
  step: number;
  title: string;
  description: string;
};

export const airBrakeSteps: AirBrakeStep[] = [
  {
    step: 1,
    title: "Build air pressure to governor cut-out",
    description:
      "Start the engine and let air pressure build to the governor cut-out level, usually between 140 and 120 psi. The air compressor should stop loading at cut-out.",
  },
  {
    step: 2,
    title: "Turn the engine off",
    description:
      "With the parking brakes released and the wheels chocked, shut the engine off so you can perform the static tests without the compressor running.",
  },
  {
    step: 3,
    title: "Turn the key on (engine off)",
    description:
      "Turn the electrical key to the on position without starting the engine so the warning buzzer and dash lights are powered for testing.",
  },
  {
    step: 4,
    title: "Push in both parking brake valves",
    description:
      "Push in the tractor and trailer parking brake valves to release the parking brakes for the Air Leakage Rate Test. Step on and hold the brake pedal (service brakes).",
  },
  {
    step: 5,
    title: "Perform the Air Leakage Rate Test",
    description:
      "With both parking brake valves pushed in, apply and hold the service brake pedal for one full minute while checking the rate of air leakage. A single vehicle should lose no more than 3 PSI, and a combination vehicle should lose no more than 4 PSI during that one-minute period.",
  },
  {
    step: 6,
    title: "Perform the low air warning test",
    description:
      "Fan the brakes by pumping the brake pedal to reduce air pressure. The low air warning light and buzzer must come on before pressure drops below 60 psi.",
  },
  {
    step: 7,
    title: "Perform the parking brake pop-out test",
    description:
      "Continue fanning the brakes to lower the air pressure. The tractor and trailer parking brake valves should pop out (close) between 45 and 20 psi.",
  },
];
