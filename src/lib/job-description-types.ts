// Job Description Types with HIVE Quadrant Integration

import type { QuadrantCriteria, Quadrant } from "./position-builder-types";

export interface HiveQuadrantData {
  PERSONAL: QuadrantCriteriaInput[];
  PATIENT: QuadrantCriteriaInput[];
  STAFF: QuadrantCriteriaInput[];
  KNOWLEDGE: QuadrantCriteriaInput[];
}

export interface QuadrantCriteriaInput {
  word: string;
  expectation: string;
}

export interface JobDescriptionData {
  id: string;
  title: string;
  position: string;
  location?: string;
  reportsTo?: string;
  overview?: string;
  responsibilities?: Record<string, { title: string; items: string[] }>;
  qualifications?: string[];
  preferred?: string[];
  traits?: string[];
  hiveOnboarding?: { title: string; items: string[] };
  growthOpportunities?: { title: string; items: string[] };
  // HIVE quadrant criteria extracted from job description
  hiveQuadrants: HiveQuadrantData;
}

// Default HIVE quadrant mappings for each position
export const DEFAULT_HIVE_QUADRANTS: Record<string, HiveQuadrantData> = {
  "RECEPTIONIST": {
    PERSONAL: [
      { word: "PUNCTUAL", expectation: "Arrives 10 minutes before shift, ready to serve patients" },
      { word: "PROFESSIONAL", expectation: "Maintains polished appearance and demeanor at all times" },
      { word: "RELIABLE", expectation: "Consistently dependable; covers shifts when needed" },
      { word: "ORGANIZED", expectation: "Keeps workspace clean and documentation in order" },
      { word: "CALM", expectation: "Remains composed under pressure during busy periods" },
    ],
    PATIENT: [
      { word: "WELCOMING", expectation: "Greets every patient with warmth and genuine care" },
      { word: "EMPATHETIC", expectation: "Understands patient anxiety and provides reassurance" },
      { word: "COMMUNICATIVE", expectation: "Explains processes clearly without medical jargon" },
      { word: "ATTENTIVE", expectation: "Anticipates patient needs before they ask" },
      { word: "CONFIDENTIAL", expectation: "Handles all patient information with HIPAA compliance" },
    ],
    STAFF: [
      { word: "COLLABORATIVE", expectation: "Works seamlessly with clinical and admin teams" },
      { word: "SUPPORTIVE", expectation: "Assists colleagues during high-volume periods" },
      { word: "COMMUNICATIVE", expectation: "Shares relevant patient info with care team promptly" },
      { word: "ADAPTABLE", expectation: "Adjusts to schedule changes and team needs" },
      { word: "RESPECTFUL", expectation: "Treats all staff members with professionalism" },
    ],
    KNOWLEDGE: [
      { word: "EMR PROFICIENT", expectation: "Navigates electronic medical records efficiently" },
      { word: "SCHEDULING", expectation: "Masters appointment software and optimization" },
      { word: "PROTOCOL", expectation: "Follows all clinic procedures accurately" },
      { word: "HIPAA", expectation: "Demonstrates comprehensive privacy compliance" },
      { word: "PROCEDURES", expectation: "Understands pre-op and post-op patient workflows" },
    ],
  },
  "TECH 1": {
    PERSONAL: [
      { word: "DETAIL-ORIENTED", expectation: "Catches small errors before they become issues" },
      { word: "FOCUSED", expectation: "Maintains concentration during precise procedures" },
      { word: "TEACHABLE", expectation: "Actively seeks feedback and applies corrections" },
      { word: "PUNCTUAL", expectation: "Arrives prepared and ready for first patient" },
      { word: "COMPOSED", expectation: "Stays calm during technical challenges" },
    ],
    PATIENT: [
      { word: "REASSURING", expectation: "Calms nervous patients with confident demeanor" },
      { word: "EXPLANATORY", expectation: "Describes each step clearly to patients" },
      { word: "GENTLE", expectation: "Handles patients with care during testing" },
      { word: "PATIENT", expectation: "Takes time needed without rushing anxious patients" },
      { word: "OBSERVANT", expectation: "Notices patient discomfort and responds appropriately" },
    ],
    STAFF: [
      { word: "TEAM PLAYER", expectation: "Supports fellow technicians and clinical staff" },
      { word: "COMMUNICATIVE", expectation: "Reports findings accurately to providers" },
      { word: "HELPFUL", expectation: "Assists with room turnover and setup" },
      { word: "RELIABLE", expectation: "Can be counted on during high-volume days" },
      { word: "MENTORING", expectation: "Helps train new team members" },
    ],
    KNOWLEDGE: [
      { word: "EQUIPMENT", expectation: "Operates diagnostic equipment accurately" },
      { word: "TROUBLESHOOT", expectation: "Identifies and resolves basic equipment issues" },
      { word: "MEASUREMENTS", expectation: "Takes precise readings for surgical planning" },
      { word: "SAFETY", expectation: "Follows all infection control protocols" },
      { word: "DOCUMENTATION", expectation: "Records findings accurately in patient charts" },
    ],
  },
  "TECH 2": {
    PERSONAL: [
      { word: "PRECISE", expectation: "Executes advanced procedures with exacting accuracy" },
      { word: "LEADERSHIP", expectation: "Guides junior techs by example" },
      { word: "INITIATIVE", expectation: "Anticipates needs and acts proactively" },
      { word: "ACCOUNTABLE", expectation: "Takes ownership of outcomes and errors" },
      { word: "COMPOSED", expectation: "Maintains calm during complex cases" },
    ],
    PATIENT: [
      { word: "EXPERT CARE", expectation: "Provides advanced patient support during procedures" },
      { word: "EDUCATIONAL", expectation: "Teaches patients about their conditions and care" },
      { word: "ADVOCACY", expectation: "Speaks up for patient comfort and safety" },
      { word: "FOLLOW-UP", expectation: "Ensures post-procedure patient understanding" },
      { word: "TRUST", expectation: "Builds lasting patient confidence in care" },
    ],
    STAFF: [
      { word: "MENTORING", expectation: "Actively trains and develops Tech 1 staff" },
      { word: "COORDINATING", expectation: "Manages patient flow between stations" },
      { word: "PROBLEM-SOLVING", expectation: "Resolves workflow issues quickly" },
      { word: "LEADERSHIP", expectation: "Steps up when supervisor is unavailable" },
      { word: "FEEDBACK", expectation: "Provides constructive guidance to peers" },
    ],
    KNOWLEDGE: [
      { word: "ADVANCED DIAGNOSTICS", expectation: "Performs complex testing protocols" },
      { word: "SURGICAL PREP", expectation: "Prepares patients for refractive procedures" },
      { word: "CALIBRATION", expectation: "Maintains and calibrates precision equipment" },
      { word: "OUTCOMES", expectation: "Tracks and reports procedure metrics" },
      { word: "INNOVATION", expectation: "Stays current with new techniques and technology" },
    ],
  },
  "OD": {
    PERSONAL: [
      { word: "PROFESSIONAL", expectation: "Maintains highest clinical and ethical standards" },
      { word: "EMPATHETIC", expectation: "Connects with patients on a personal level" },
      { word: "DECISIVE", expectation: "Makes confident clinical recommendations" },
      { word: "CONTINUOUS LEARNING", expectation: "Stays current with industry advancements" },
      { word: "INTEGRITY", expectation: "Provides honest assessments without upselling" },
    ],
    PATIENT: [
      { word: "DIAGNOSTIC", expectation: "Conducts thorough comprehensive exams" },
      { word: "EDUCATIONAL", expectation: "Explains conditions and options clearly" },
      { word: "CONSULTATIVE", expectation: "Guides patients to appropriate treatment paths" },
      { word: "FOLLOW-UP", expectation: "Ensures continuity of care post-procedure" },
      { word: "TRUST", expectation: "Builds lasting patient relationships" },
    ],
    STAFF: [
      { word: "COLLABORATIVE", expectation: "Works effectively with surgical team" },
      { word: "MENTORING", expectation: "Teaches and develops clinical staff" },
      { word: "COMMUNICATIVE", expectation: "Shares clinical insights clearly with team" },
      { word: "LEADERSHIP", expectation: "Sets tone for clinical excellence" },
      { word: "RESPECTFUL", expectation: "Values contributions from all team members" },
    ],
    KNOWLEDGE: [
      { word: "CLINICAL EXPERTISE", expectation: "Demonstrates comprehensive eye care knowledge" },
      { word: "REFRACTIVE", expectation: "Understands surgical candidacy criteria" },
      { word: "TECHNOLOGY", expectation: "Proficient with advanced diagnostic equipment" },
      { word: "PROTOCOLS", expectation: "Follows evidence-based clinical guidelines" },
      { word: "OUTCOMES", expectation: "Tracks and optimizes patient results" },
    ],
  },
  "SURGEON": {
    PERSONAL: [
      { word: "PRECISION", expectation: "Executes procedures with exacting accuracy" },
      { word: "COMPOSURE", expectation: "Remains calm during complex surgical cases" },
      { word: "EXCELLENCE", expectation: "Strives for optimal outcomes in every procedure" },
      { word: "INTEGRITY", expectation: "Maintains highest ethical standards" },
      { word: "INNOVATION", expectation: "Adopts and advances surgical techniques" },
    ],
    PATIENT: [
      { word: "CONSULTATIVE", expectation: "Thoroughly explains surgical options and risks" },
      { word: "TRUST", expectation: "Builds patient confidence through expertise" },
      { word: "OUTCOMES", expectation: "Prioritizes patient visual results above all" },
      { word: "CARE", expectation: "Provides attentive pre and post-op support" },
      { word: "COMMUNICATION", expectation: "Keeps patients informed throughout journey" },
    ],
    STAFF: [
      { word: "LEADERSHIP", expectation: "Guides surgical team with clarity and confidence" },
      { word: "TEACHING", expectation: "Develops clinical staff capabilities" },
      { word: "COLLABORATIVE", expectation: "Works seamlessly with OD and tech teams" },
      { word: "RESPECTFUL", expectation: "Values every team member's contribution" },
      { word: "ACCOUNTABILITY", expectation: "Takes responsibility for team performance" },
    ],
    KNOWLEDGE: [
      { word: "SURGICAL MASTERY", expectation: "Expert in LASIK and refractive procedures" },
      { word: "TECHNOLOGY", expectation: "Masters latest surgical platforms" },
      { word: "RESEARCH", expectation: "Stays current with clinical studies and outcomes" },
      { word: "SAFETY", expectation: "Maintains impeccable surgical safety record" },
      { word: "INNOVATION", expectation: "Pioneers new techniques and approaches" },
    ],
  },
  "CALL CENTER": {
    PERSONAL: [
      { word: "ARTICULATE", expectation: "Communicates clearly and professionally on calls" },
      { word: "PATIENT", expectation: "Handles challenging callers with grace" },
      { word: "PERSISTENT", expectation: "Follows through on callbacks and commitments" },
      { word: "POSITIVE", expectation: "Maintains upbeat tone throughout the day" },
      { word: "ORGANIZED", expectation: "Tracks leads and follow-ups systematically" },
    ],
    PATIENT: [
      { word: "INFORMATIVE", expectation: "Explains procedures and pricing clearly" },
      { word: "REASSURING", expectation: "Addresses concerns and anxieties confidently" },
      { word: "RESPONSIVE", expectation: "Returns calls and messages promptly" },
      { word: "CONSULTATIVE", expectation: "Qualifies patients for appropriate services" },
      { word: "CARING", expectation: "Shows genuine interest in patient goals" },
    ],
    STAFF: [
      { word: "COLLABORATIVE", expectation: "Works with clinic to optimize scheduling" },
      { word: "COMMUNICATIVE", expectation: "Shares patient insights with care team" },
      { word: "SUPPORTIVE", expectation: "Assists team members during high volume" },
      { word: "RELIABLE", expectation: "Maintains consistent call coverage" },
      { word: "FEEDBACK", expectation: "Reports trends and patient concerns" },
    ],
    KNOWLEDGE: [
      { word: "SERVICES", expectation: "Understands all treatment options offered" },
      { word: "PRICING", expectation: "Explains financing and costs accurately" },
      { word: "SCHEDULING", expectation: "Masters appointment booking system" },
      { word: "SCRIPTS", expectation: "Follows call protocols while staying natural" },
      { word: "CRM", expectation: "Maintains accurate patient records in system" },
    ],
  },
  "MANAGER": {
    PERSONAL: [
      { word: "LEADERSHIP", expectation: "Inspires team through example and vision" },
      { word: "ACCOUNTABLE", expectation: "Takes ownership of clinic performance" },
      { word: "DECISIVE", expectation: "Makes timely decisions with confidence" },
      { word: "COMPOSED", expectation: "Remains calm during challenging situations" },
      { word: "GROWTH-MINDED", expectation: "Continuously improves self and team" },
    ],
    PATIENT: [
      { word: "EXPERIENCE FOCUS", expectation: "Ensures exceptional patient journey" },
      { word: "PROBLEM-SOLVING", expectation: "Resolves patient concerns quickly" },
      { word: "QUALITY", expectation: "Maintains highest care standards" },
      { word: "ADVOCACY", expectation: "Champions patient satisfaction initiatives" },
      { word: "FEEDBACK", expectation: "Uses patient input to improve operations" },
    ],
    STAFF: [
      { word: "MENTORING", expectation: "Develops team members' careers actively" },
      { word: "CULTURE", expectation: "Builds positive, entrepreneurial work environment" },
      { word: "PERFORMANCE", expectation: "Manages through HIVE quadrant system" },
      { word: "RECOGNITION", expectation: "Celebrates team wins and individual growth" },
      { word: "COMMUNICATION", expectation: "Keeps team informed and aligned" },
    ],
    KNOWLEDGE: [
      { word: "OPERATIONS", expectation: "Masters clinic workflow and efficiency" },
      { word: "METRICS", expectation: "Tracks KPIs and drives improvement" },
      { word: "COMPLIANCE", expectation: "Ensures regulatory and policy adherence" },
      { word: "BUSINESS", expectation: "Understands P&L and clinic economics" },
      { word: "SYSTEMS", expectation: "Leverages technology for optimization" },
    ],
  },
};

// Additional AI-suggested words by quadrant for role refinement
export const ADDITIONAL_SUGGESTION_WORDS: Record<Quadrant["id"], string[]> = {
  PERSONAL: [
    "DISCIPLINED", "ADAPTABLE", "RESILIENT", "PROACTIVE", "MOTIVATED",
    "ETHICAL", "RESPECTFUL", "HUMBLE", "CONFIDENT", "DRIVEN",
    "SELF-AWARE", "GROWTH-ORIENTED", "POSITIVE", "DEDICATED", "HONEST",
    "FLEXIBLE", "RESOURCEFUL", "CONSISTENT", "PATIENT", "STRATEGIC",
  ],
  PATIENT: [
    "COMPASSIONATE", "UNDERSTANDING", "RESPONSIVE", "THOROUGH", "PERSONALIZED",
    "SUPPORTIVE", "LISTENING", "TIMELY", "PROACTIVE", "COMFORTING",
    "TRANSPARENT", "ACCESSIBLE", "DIGNIFIED", "SAFE", "HEALING",
    "HOLISTIC", "PREVENTIVE", "INCLUSIVE", "INFORMED", "CONNECTED",
  ],
  STAFF: [
    "COOPERATIVE", "ENCOURAGING", "DELEGATING", "INCLUSIVE", "EMPOWERING",
    "CONSTRUCTIVE", "DIPLOMATIC", "APPROACHABLE", "MEDIATING", "UNIFYING",
    "MOTIVATING", "COACHING", "APPRECIATIVE", "TRANSPARENT", "FAIR",
    "CROSS-FUNCTIONAL", "SYNERGISTIC", "HARMONIZING", "BUILDING", "INSPIRING",
  ],
  KNOWLEDGE: [
    "ANALYTICAL", "INNOVATIVE", "TECHNICAL", "SYSTEMATIC", "SPECIALIZED",
    "RESEARCH-DRIVEN", "DATA-INFORMED", "EVIDENCE-BASED", "CERTIFIED", "TRAINED",
    "COMPLIANT", "PROCEDURAL", "STANDARDIZED", "BENCHMARKING", "OPTIMIZING",
    "DIAGNOSTIC", "REGULATORY", "QUALITY-FOCUSED", "CONTINUOUS-LEARNING", "EXPERT",
  ],
};

// Get additional suggestions for a position (words not already in the job description)
export function getAdditionalSuggestions(
  hiveQuadrants: HiveQuadrantData,
  positionKey?: string
): string[] {
  const existingWords = new Set([
    ...hiveQuadrants.PERSONAL.map(q => q.word.toUpperCase()),
    ...hiveQuadrants.PATIENT.map(q => q.word.toUpperCase()),
    ...hiveQuadrants.STAFF.map(q => q.word.toUpperCase()),
    ...hiveQuadrants.KNOWLEDGE.map(q => q.word.toUpperCase()),
  ]);
  
  const allAdditional = [
    ...ADDITIONAL_SUGGESTION_WORDS.PERSONAL,
    ...ADDITIONAL_SUGGESTION_WORDS.PATIENT,
    ...ADDITIONAL_SUGGESTION_WORDS.STAFF,
    ...ADDITIONAL_SUGGESTION_WORDS.KNOWLEDGE,
  ];
  
  // Filter out words already in the job description
  return [...new Set(allAdditional.filter(word => !existingWords.has(word.toUpperCase())))];
}

// Generate criteria from job description data
export function generateCriteriaFromJobDescription(
  hiveQuadrants: HiveQuadrantData
): Record<Quadrant["id"], QuadrantCriteria[]> {
  const result: Record<Quadrant["id"], QuadrantCriteria[]> = {
    PERSONAL: [],
    PATIENT: [],
    STAFF: [],
    KNOWLEDGE: [],
  };

  const colorMap: Record<Quadrant["id"], QuadrantCriteria["color"]> = {
    PERSONAL: "white",
    PATIENT: "orange",
    STAFF: "yellow",
    KNOWLEDGE: "blue",
  };

  (["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"] as Quadrant["id"][]).forEach((qId) => {
    result[qId] = hiveQuadrants[qId].map((item, index) => ({
      id: `crit-${qId.toLowerCase()}-${Date.now()}-${index}`,
      label: item.word,
      definition: `${item.word} is a core competency for this role in the ${qId.toLowerCase()} quadrant.`,
      expectation: item.expectation,
      score: 0,
      color: colorMap[qId],
    }));
  });

  return result;
}
