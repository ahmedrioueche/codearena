import { IncidentI } from "../types/game/stc";

export const stcIncidents: IncidentI[] = [
  {
    id: "lionair-610",
    title: "MCAS Override Catastrophe – Lion Air 610",
    topic: "Software Systems / Safety-Critical Design",
    actuallyHappened: true,
    language: "C",
    intro:
      "A fatal crash involving a Boeing 737 MAX occurred shortly after takeoff. The investigation revealed a software system repeatedly forced the nose of the plane down, despite pilot efforts.",
    body: "The MCAS system was designed to prevent stalls by automatically adjusting the aircraft's angle of attack. However, it relied on a single angle-of-attack (AoA) sensor. When that sensor fed incorrect data, MCAS activated erroneously. The pilots fought to regain control, but the system repeatedly pushed the nose down. Ultimately, the aircraft plunged into the sea, killing all 189 on board.",
    whatToDo:
      "Analyze the logic behind the MCAS activation, identify its flawed assumptions, and propose a software fix that prioritizes safety and redundancy.",
    problematicCode: `
void activateMCAS(float aoa) {
  if (aoa > MAX_AOA_THRESHOLD) {
    trimStabilizer(NOSE_DOWN);
  }
}
  `,
    starterCode: `
void activateMCAS(float aoa, bool manualOverride) {
  // Fix this logic to ensure MCAS does not activate dangerously
}
  `,
    level: 5,
    averageTime: 15,
    points: 200,

    symptoms: [
      "Aircraft nose repeatedly pitched down unexpectedly",
      "Pilots unable to override automatic system",
      "Flight data showed repeated MCAS activation",
    ],
    logs: [
      "AoA sensor value: 74.5° (abnormally high)",
      "MCAS activated 20+ times in 10 minutes",
      "Manual trim input overridden by MCAS",
    ],
    files: [
      {
        name: "cockpit-voice-log.txt",
        type: "text",
        content:
          "PILOT: 'What's causing this?!'\nMCAS engaged.\nPILOT: 'Pull up, pull up!'\n...",
      },
      {
        name: "mcas-diagram.png",
        type: "image",
        content: "<base64-encoded image of MCAS flow diagram>",
      },
    ],
    systemInfo: [
      "MCAS software version 1.0.3",
      "Hardware: Boeing 737 MAX 8",
      "Sensor redundancy: Single AoA sensor active",
    ],
    hints: [
      "How does relying on a single sensor create risk?",
      "Could the system have checked for manual override or conflicting inputs?",
      "Think about fault tolerance in safety-critical systems.",
    ],
    tags: [
      "safety",
      "redundancy",
      "aviation",
      "real-world",
      "sensor-failure",
      "C",
    ],

    solutionCode: `
void activateMCAS(float aoa, bool manualOverride, float secondAoA) {
  if (manualOverride) return;

  float averageAoA = (aoa + secondAoA) / 2;
  float difference = fabs(aoa - secondAoA);

  if (difference > 5.0) {
    // Sensor disagreement — do not activate
    return;
  }

  if (averageAoA > MAX_AOA_THRESHOLD) {
    trimStabilizer(NOSE_DOWN);
  }
}
`,

    takeaways: [
      "Safety-critical systems should never rely on a single point of failure.",
      "Manual pilot input must take precedence over automation in emergencies.",
      "System behavior should degrade gracefully in the presence of faulty data.",
      "Transparency and pilot training are crucial when introducing new automation.",
    ],
    rootCause:
      "MCAS relied solely on a single faulty AoA sensor and lacked redundancy or sufficient pilot override safeguards.",
    fixExplanation:
      "The revised logic should verify AoA using multiple sensors, check for pilot override input, and limit the number of repeated activations. The system must fail safely and provide clear alerts when input data is suspect.",
  },
];
