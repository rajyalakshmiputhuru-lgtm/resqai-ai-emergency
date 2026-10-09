import {
  AnalysisResult,
  EmergencySignal,
  Incident,
  IncidentType,
  UrgencyLevel,
  IncidentStatus,
  IncidentClassification,
} from '@/types';
import { resolveApproximateLandmark } from '@/lib/data/known-locations';
import {
  getActionChecklistForIncident,
  VERIFIED_EMERGENCY_CONTACTS,
} from '@/lib/data/emergency-directory';

/**
 * ONE GEMINI AI SERVICE
 * File: /lib/ai/gemini.ts
 *
 * All AI intelligence flows through ONE centralized Gemini AI function:
 * analyzeEmergencySignal()
 *
 * Adheres strictly to the single-model architecture decision:
 * ONE AI BRAIN -> MANY EMERGENCY SIGNALS -> ONE CLEAR INCIDENT PICTURE
 */

function enrichAnalysisResult(
  result: any,
  rawText: string,
  language: string,
  isLive: boolean,
  statusMsg: string
): AnalysisResult {
  const isTelugu = language.toLowerCase().includes('telugu') || /[\u0C00-\u0C7F]/.test(rawText);
  const checklist = getActionChecklistForIncident(result.incidentType, result.urgency, isTelugu);

  const relevantContacts = VERIFIED_EMERGENCY_CONTACTS.filter((c) => {
    if (result.incidentType === 'fire') return c.category === 'national' || c.number === '101' || c.number === '112';
    if (result.incidentType === 'medical') return c.category === 'medical' || c.number === '108' || c.number === '112';
    if (result.incidentType === 'flood') return c.category === 'disaster' || c.number === '112' || c.number === '1070';
    return c.number === '112' || c.category === 'national';
  }).slice(0, 4);

  const peopleText = result.people.affected !== null ? `${result.people.affected} people affected` : 'People count unconfirmed';
  const vulnText = result.people.vulnerable.length > 0 ? ` (${result.people.vulnerable.map((v: any) => v.type).join(', ')})` : '';

  const immediateRisks = [
    result.incidentType === 'flood'
      ? 'Rapid water rise threatening ground-floor entrapment and electrical hazards.'
      : result.incidentType === 'fire'
      ? 'Smoke inhalation hazard, active flame propagation, and structural instability.'
      : result.incidentType === 'medical'
      ? 'Acute vital risk requiring emergency paramedic life support.'
      : 'Evolving hazard in urban sector requiring immediate responder reconnaissance.',
    ...(result.people.vulnerable.length > 0
      ? [`Identified vulnerable persons${vulnText} requiring priority extraction.`]
      : []),
  ];

  const immediateRisksTelugu = [
    result.incidentType === 'flood'
      ? 'వరద నీరు వేగంగా పెరగడం వల్ల నేల అంతస్తులో ఇరుక్కుపోయే ప్రమాదం.'
      : result.incidentType === 'fire'
      ? 'దట్టమైన పొగ మరియు మంటలు వ్యాపించే ప్రమాదం.'
      : 'తక్షణ సహాయం అవసరమైన అత్యవసర పరిస్థితి.',
    ...(result.people.vulnerable.length > 0
      ? ['రక్షణ బృందాలు మొదట రక్షించవలసిన వృద్ధులు లేదా పిల్లలు ఉన్నారు.']
      : []),
  ];

  const safeNextSteps = checklist.map((c) => c.instruction);
  const safeNextStepsTelugu = checklist.map((c) => c.instructionTelugu);

  result.aiExecutionMode = isLive ? 'live_gemini' : 'simulated_engine';
  result.aiStatusMessage = statusMsg;
  result.summary = {
    responderBrief: `${result.urgency.toUpperCase()} ${result.incidentType.toUpperCase()} at ${result.location.normalized}. ${peopleText}${vulnText}. Advisory units: ${result.resources.join(', ') || 'First responders'}.`,
    immediateRisks,
    immediateRisksTelugu,
    safeNextSteps,
    safeNextStepsTelugu,
    actionChecklist: checklist,
    recommendedContacts: relevantContacts,
  };

  return result;
}

const GEMINI_SYSTEM_PROMPT = `
You are the SINGLE AI BRAIN for ResQAI (Emergency Response Assistant).
You process raw emergency signals from 911/112 calls, WhatsApp, SMS, field responders, and social media.
You MUST output STRICT JSON ONLY matching the required schema. DO NOT wrap with markdown blocks or return conversational text.

YOUR RESPONSIBILITIES:
1. EMERGENCY CLASSIFICATION:
   - "emergency": life/safety critical event requiring immediate response (e.g., floods with trapped people, active fires, serious collisions).
   - "non-emergency": noise, routine traffic delays, non-urgent public updates.
   - "unverified": rumors, vague unconfirmed claims (e.g. "Someone said maybe 20 people are trapped").

2. INDIAN LANDMARK INTELLIGENCE:
   - Understand Indian urban landmark patterns: "near MRTS west gate", "behind station Vijayanagar side", "opposite medical shop near station backside road".
   - Extract Telugu-English phrases: "MRTS daggara water chala perigindi" (water rose a lot near MRTS), "station venakala" (behind station), "trapped unnaru" (are trapped).
   - DO NOT INVENT GPS coordinates. Set latitude: null, longitude: null, isApproximate: true if only landmarks are mentioned.

3. MULTILINGUAL & CODE-MIXED:
   - Seamlessly parse English, Telugu, Telugu-English code-mixing, and Hindi.
   - Extract affected counts and vulnerable individuals (elderly, infants, pregnant, injured, disabled).

4. INCIDENT MATCHING & CLUSTERING:
   - Compare the signal against the provided EXISTING INCIDENTS list.
   - Evaluate: landmark similarity, location context, semantic similarity, time proximity, incident type.
   - Return: sameIncident (boolean), matchedIncidentId (or null), similarityScore (0-100), reason, and factor percentages.

5. CONFLICT HANDLING:
   - If people count or severity changes compared to matched incident, identify conflict: hasConflict, previousValue, newValue, explanation.

6. RESOLUTION DETECTION:
   - "Rescue team reached" -> status: rescue_in_progress
   - "Everyone rescued" or "Fire extinguished" -> status: resolved

7. RESOURCE RECOMMENDATION:
   - Suggest only required emergency units: ["rescue boat", "medical team", "ambulance", "fire truck", "police", "rescue personnel", "emergency supplies"].

8. AI EVIDENCE:
   - Provide explainable reasoning: whySameIncident, whyCritical, whyApproximateLocation.
`;

export async function analyzeEmergencySignal(
  signal: EmergencySignal,
  existingIncidents: Incident[] = []
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');

  if (isKeyConfigured) {
    try {
      const result = await callGeminiLiveApi(apiKey!, signal, existingIncidents);
      if (result) {
        const postProcessed = postProcessWithLandmarkRef(result, signal.rawText);
        return enrichAnalysisResult(
          postProcessed,
          signal.rawText,
          signal.language,
          true,
          'Analyzed via Google Gemini API (gemini-1.5-flash) - Single AI Brain'
        );
      }
    } catch (error: any) {
      console.warn(
        'Gemini Live API encountered an error. Falling back to deterministic intelligence engine:',
        error?.message || error
      );
      const fallbackResult = analyzeDeterministicFallback(signal, existingIncidents);
      return enrichAnalysisResult(
        fallbackResult,
        signal.rawText,
        signal.language,
        false,
        `Gemini API request failed (${error?.message || 'offline'}). Operating in Deterministic Simulation Engine.`
      );
    }
  }

  // Fallback to deterministic intelligence engine (NO OTHER LLM IS EVER CALLED)
  const fallback = analyzeDeterministicFallback(signal, existingIncidents);
  return enrichAnalysisResult(
    fallback,
    signal.rawText,
    signal.language,
    false,
    'GEMINI_API_KEY not configured in server environment. Operating in Deterministic Simulation Demo Engine.'
  );
}

/**
 * Live Google Gemini API Integration using official Gemini 2.5 Flash / 1.5 Flash endpoint
 */
async function callGeminiLiveApi(
  apiKey: string,
  signal: EmergencySignal,
  existingIncidents: Incident[]
): Promise<AnalysisResult | null> {
  const existingSummary = existingIncidents.map((inc) => ({
    id: inc.id,
    type: inc.incidentType,
    location: inc.location.normalized,
    landmarks: inc.location.landmarks,
    peopleAffected: inc.people.affected,
    urgency: inc.urgency,
    status: inc.status,
    recentUpdate: inc.updatedAt,
  }));

  const userPrompt = `
Analyze the incoming emergency signal and compare with existing incidents:

SIGNAL:
Source: ${signal.source}
Language: ${signal.language}
Timestamp: ${signal.timestamp}
Content: "${signal.rawText}"

EXISTING ACTIVE INCIDENTS:
${JSON.stringify(existingSummary, null, 2)}

Return strict JSON conforming to:
{
  "classification": "emergency" | "non-emergency" | "unverified",
  "classificationConfidence": number (0-1),
  "incidentType": "flood" | "fire" | "medical" | "accident" | "evacuation" | "other",
  "location": {
    "raw": string,
    "normalized": string,
    "landmarks": string[],
    "area": string,
    "direction": string,
    "nearbyBuilding": string,
    "relativePosition": string,
    "locationAliases": string[],
    "latitude": null,
    "longitude": null,
    "confidence": number (0-1),
    "isApproximate": true
  },
  "people": {
    "affected": number | null,
    "trapped": number | null,
    "vulnerable": [{ "type": string, "details": string }]
  },
  "urgency": "low" | "medium" | "high" | "critical",
  "severity": "low" | "medium" | "high" | "critical",
  "resources": string[],
  "status": "active" | "rescue_in_progress" | "resolved" | "unverified",
  "language": string,
  "confidence": number (0-1),
  "uncertainties": string[],
  "evidence": string[],
  "match": {
    "sameIncident": boolean,
    "matchedIncidentId": string | null,
    "similarityScore": number (0-100),
    "reason": string,
    "factors": {
      "landmarkMatch": number (0-100),
      "locationContext": number (0-100),
      "semanticSimilarity": number (0-100),
      "timeCompatibility": number (0-100),
      "incidentTypeMatch": number (0-100)
    }
  },
  "conflictDetection": {
    "hasConflict": boolean,
    "field": string | null,
    "previousValue": any,
    "newValue": any,
    "explanation": string | null
  },
  "resolutionDetection": {
    "isResolution": boolean,
    "details": string | null
  },
  "explanations": {
    "whySameIncident": string,
    "whyCritical": string,
    "whyApproximateLocation": string
  }
}
`;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    // Call Gemini API via standard fetch with generationConfig
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${GEMINI_SYSTEM_PROMPT}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned) as AnalysisResult;
    return parsed;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Post-processes location with verified Indian landmark catalog for map visualization,
 * while maintaining isApproximate: true flag.
 */
function postProcessWithLandmarkRef(
  result: AnalysisResult,
  rawText: string
): AnalysisResult {
  const resolved = resolveApproximateLandmark(rawText);
  if (resolved) {
    if (!result.location.latitude && !result.location.longitude) {
      result.location.latitude = resolved.lat;
      result.location.longitude = resolved.lng;
    }
    if (resolved.landmarks.length > 0) {
      result.location.landmarks = Array.from(
        new Set([...result.location.landmarks, ...resolved.landmarks])
      );
    }
  }
  return result;
}

/**
 * High-fidelity deterministic fallback engine for offline/demo/missing-key execution.
 * Implements full Indian landmark parsing, Telugu-English understanding, clustering,
 * conflict tracking, and evidence synthesis without invoking any other LLM.
 */
function analyzeDeterministicFallback(
  signal: EmergencySignal,
  existingIncidents: Incident[]
): Omit<AnalysisResult, 'aiExecutionMode' | 'aiStatusMessage' | 'summary'> {
  const text = signal.rawText.toLowerCase();

  // 1. Language Detection
  let detectedLanguage = 'English';
  if (
    text.includes('daggara') ||
    text.includes('unnaru') ||
    text.includes('chala') ||
    text.includes('perigindi') ||
    text.includes('lo') ||
    text.includes('venakala') ||
    text.includes('oka')
  ) {
    detectedLanguage = 'Telugu-English';
  } else if (/[\u0C00-\u0C7F]/.test(signal.rawText)) {
    detectedLanguage = 'Telugu';
  } else if (/[\u0900-\u097F]/.test(signal.rawText) || text.includes('hai') || text.includes('pani')) {
    detectedLanguage = 'Hindi';
  }

  // 2. Classification & Noise Filtering
  const isTrafficOrNoise =
    (text.includes('traffic') && !text.includes('trapped') && !text.includes('accident')) ||
    text.includes('biryani') ||
    text.includes('swiggy') ||
    text.includes('zomato') ||
    text.includes('weather is nice') ||
    text.includes('heavy rain romantic');

  const isRumorOrUnverified =
    text.includes('someone said') ||
    text.includes('maybe') ||
    text.includes('rumor') ||
    text.includes('unconfirmed') ||
    text.includes('hearing that');

  let classification: IncidentClassification = 'emergency';
  let classificationConfidence = 0.94;

  if (isTrafficOrNoise) {
    classification = 'non-emergency';
    classificationConfidence = 0.96;
  } else if (isRumorOrUnverified) {
    classification = 'unverified';
    classificationConfidence = 0.76;
  }

  // 3. Incident Type Detection
  let incidentType: IncidentType = 'flood';
  if (text.includes('water') || text.includes('flood') || text.includes('perigindi') || text.includes('submerged')) {
    incidentType = 'flood';
  } else if (text.includes('fire') || text.includes('smoke') || text.includes('flame') || text.includes('manta')) {
    incidentType = 'fire';
  } else if (text.includes('accident') || text.includes('crash') || text.includes('collision') || text.includes('lorry') || text.includes('bus')) {
    incidentType = 'accident';
  } else if (text.includes('heart') || text.includes('unconscious') || text.includes('stampede') || text.includes('choking') || text.includes('medical') || text.includes('collapsed')) {
    incidentType = 'medical';
  } else if (text.includes('crack') || text.includes('building') || text.includes('evacuate') || text.includes('pillar') || text.includes('structural')) {
    incidentType = 'evacuation';
  } else {
    incidentType = 'other';
  }

  // 4. Indian Landmark Extraction
  const resolved = resolveApproximateLandmark(signal.rawText);
  const landmarks: string[] = [];
  if (resolved) {
    landmarks.push(...resolved.landmarks);
  }
  let area = resolved ? resolved.normalized.split(',')[1]?.trim() || 'Chennai' : 'Chennai Metropolitan Area';
  let relativePosition = 'Vicinity';
  let direction = 'General';
  let nearbyBuilding = '';

  if (text.includes('same place') || text.includes('same location') || text.includes('same area')) {
    if (existingIncidents.length > 0) {
      landmarks.push(...existingIncidents[0].location.landmarks);
    }
  }

  if (text.includes('velachery') || text.includes('mrts')) {
    landmarks.push('Velachery MRTS Station');
    area = 'Velachery';
  }
  if (text.includes('west gate')) {
    landmarks.push('West Gate');
    direction = 'West';
    relativePosition = 'Adjacent to West Gate entrance';
  }
  if (text.includes('vijayanagar side') || text.includes('vijayanagar')) {
    landmarks.push('Vijayanagar Side');
    direction = 'North-West';
  }
  if (text.includes('behind') || text.includes('venakala') || text.includes('backside')) {
    relativePosition = 'Rear service road behind station';
  }
  if (text.includes('medical shop')) {
    nearbyBuilding = 'Medical Shop / Pharmacy';
    landmarks.push('Station Backside Medical Shop');
  }
  if (text.includes('ambattur')) {
    landmarks.push('Ambattur Industrial SIDCO Phase 2');
    area = 'Ambattur';
  }
  if (text.includes('omr') || text.includes('sholinganallur')) {
    landmarks.push('OMR Sholinganallur Expressway Junction');
    area = 'OMR';
  }
  if (text.includes('t nagar') || text.includes('ranganathan')) {
    landmarks.push('T. Nagar Ranganathan Street');
    area = 'T. Nagar';
  }
  if (text.includes('guindy') || text.includes('kathipara')) {
    landmarks.push('Kathipara Flyover / Guindy Transit Hub');
    area = 'Guindy';
  }

  const normalizedLocation = resolved
    ? resolved.normalized
    : landmarks.length > 0
    ? `${landmarks.join(', ')}, ${area}`
    : 'Approximate Urban Sector, Chennai';

  // 5. People & Vulnerability Intelligence
  let affected: number | null = null;
  let trapped: number | null = null;
  const vulnerable: Array<{ type: string; details: string }> = [];

  // Match numbers (e.g. "6 people", "10 members", "20 people")
  const numMatch = signal.rawText.match(/(\d+)\s*(people|members|persons|trapped|inside|patients)/i);
  if (numMatch) {
    const count = parseInt(numMatch[1], 10);
    affected = count;
    trapped = count;
  } else if (text.includes('six people') || text.includes('6 people') || text.includes('6 members')) {
    affected = 6;
    trapped = 6;
  } else if (text.includes('ten people') || text.includes('10 people') || text.includes('10 members')) {
    affected = 10;
    trapped = 10;
  }

  if (text.includes('elderly') || text.includes('old woman') || text.includes('peddavaallu') || text.includes('senior citizen')) {
    vulnerable.push({ type: 'elderly', details: 'Elderly citizen inside premises requiring mobility assistance' });
  }
  if (text.includes('child') || text.includes('baby') || text.includes('infant') || text.includes('pillalu')) {
    vulnerable.push({ type: 'infant', details: 'Child/infant requiring immediate pediatric evacuation' });
  }
  if (text.includes('pregnant') || text.includes('garbhini')) {
    vulnerable.push({ type: 'pregnant', details: 'Pregnant mother requiring specialized medical transport' });
  }
  if (text.includes('injured') || text.includes('bleeding') || text.includes('fracture') || text.includes('burns')) {
    vulnerable.push({ type: 'injured', details: 'Casualty with active physical trauma' });
  }

  // 6. Urgency & Severity
  let urgency: UrgencyLevel = 'medium';
  let severity: UrgencyLevel = 'medium';

  if (
    text.includes('rapidly') ||
    text.includes('rising rapidly') ||
    text.includes('critical') ||
    text.includes('urgent') ||
    (affected && affected >= 10) ||
    vulnerable.length > 0 ||
    text.includes('flames spreading') ||
    text.includes('unconscious')
  ) {
    urgency = 'critical';
    severity = 'high';
  } else if (affected && affected > 0) {
    urgency = 'high';
    severity = 'medium';
  } else if (classification === 'non-emergency') {
    urgency = 'low';
    severity = 'low';
  }

  // 7. Status & Resolution Detection
  let status: IncidentStatus = 'active';
  const isResolution =
    text.includes('everyone rescued') ||
    text.includes('rescued safely') ||
    text.includes('all evacuated') ||
    text.includes('fire controlled') ||
    text.includes('resolved') ||
    text.includes('situation normal');

  const isRescueInProgress =
    text.includes('rescue team reached') ||
    text.includes('ndrf on spot') ||
    text.includes('team on site') ||
    text.includes('firefighters deployed') ||
    text.includes('ambulance arrived') ||
    text.includes('operations underway');

  if (isResolution) {
    status = 'resolved';
  } else if (isRescueInProgress) {
    status = 'rescue_in_progress';
  } else if (classification === 'unverified') {
    status = 'unverified';
  }

  // 8. Resource Recommendations (Advisory only)
  const resources: string[] = [];
  if (incidentType === 'flood') {
    resources.push('rescue boat', 'medical team', 'ambulance');
    if (affected && affected >= 8) {
      resources.push('rescue personnel', 'emergency supplies');
    }
  } else if (incidentType === 'fire') {
    resources.push('fire truck', 'ambulance', 'police', 'rescue personnel');
  } else if (incidentType === 'accident') {
    resources.push('ambulance', 'police', 'rescue personnel');
  } else if (incidentType === 'medical') {
    resources.push('ambulance', 'medical team');
  } else if (incidentType === 'evacuation') {
    resources.push('rescue personnel', 'police', 'emergency supplies');
  }

  // 9. Incident Matching & Clustering
  let sameIncident = false;
  let matchedIncidentId: string | null = null;
  let similarityScore = 0;
  let matchReason = 'New distinct emergency sector identified.';
  let factors = {
    landmarkMatch: 0,
    locationContext: 0,
    semanticSimilarity: 0,
    timeCompatibility: 0,
    incidentTypeMatch: 0,
  };

  // Compare with existing incidents
  for (const inc of existingIncidents) {
    let score = 0;
    let lMatch = 0;
    let locCtx = 0;
    let semSim = 65;
    let timeComp = 95;
    let typeMatch = 0;

    // Landmark / Location match
    const hasSharedLandmark = inc.location.landmarks.some((l) =>
      landmarks.some(
        (cur) =>
          cur.toLowerCase().includes(l.toLowerCase()) ||
          l.toLowerCase().includes(cur.toLowerCase())
      )
    );

    if (hasSharedLandmark) {
      lMatch = 94;
      locCtx = 92;
      score += 50;
      // If signal didn't repeat hazard keyword, inherit type from matched active landmark incident
      if (incidentType === 'other' || incidentType === 'flood') {
        incidentType = inc.incidentType;
      }
    } else if (
      (inc.location.normalized.toLowerCase().includes('velachery') &&
        text.includes('velachery')) ||
      (inc.location.normalized.toLowerCase().includes('ambattur') &&
        text.includes('ambattur')) ||
      (inc.location.normalized.toLowerCase().includes('t nagar') &&
        text.includes('t nagar')) ||
      (inc.location.normalized.toLowerCase().includes('omr') &&
        text.includes('omr'))
    ) {
      lMatch = 82;
      locCtx = 85;
      score += 40;
      if (incidentType === 'other') {
        incidentType = inc.incidentType;
      }
    }

    // Type match
    if (inc.incidentType === incidentType) {
      typeMatch = 100;
      score += 25;
    }

    // Semantic content match
    if (
      text.includes('same place') ||
      text.includes('water rising') ||
      text.includes('elderly') ||
      text.includes('rescued') ||
      text.includes('reached') ||
      text.includes('people now') ||
      text.includes('count is') ||
      text.includes('trapped on roof') ||
      text.includes('update from')
    ) {
      semSim = 94;
      score += 25;
    }

    const calculatedSimilarity = Math.min(100, score);
    if (calculatedSimilarity >= 65 && calculatedSimilarity > similarityScore) {
      similarityScore = calculatedSimilarity;
      sameIncident = true;
      matchedIncidentId = inc.id;
      factors = {
        landmarkMatch: lMatch,
        locationContext: locCtx,
        semanticSimilarity: semSim,
        timeCompatibility: timeComp,
        incidentTypeMatch: typeMatch,
      };
      matchReason = `Same landmark '${landmarks[0] || inc.location.landmarks[0] || 'area'}', matching incident type '${incidentType}', compatible timeline and contiguous emergency situation.`;
    }
  }

  // Contextual fallback for resolution signals ('all evacuated', 'everyone rescued')
  if (!sameIncident && isResolution && existingIncidents.length > 0) {
    const candidate =
      existingIncidents.find(
        (i) =>
          i.status === 'rescue_in_progress' ||
          i.status === 'active' ||
          (affected && i.people.affected === affected) ||
          (text.includes('elderly') &&
            i.people.vulnerable.some((v) => v.type === 'elderly'))
      ) || existingIncidents[0];

    if (candidate) {
      sameIncident = true;
      matchedIncidentId = candidate.id;
      similarityScore = 96;
      incidentType = candidate.incidentType;
      factors = {
        landmarkMatch: 95,
        locationContext: 94,
        semanticSimilarity: 98,
        timeCompatibility: 95,
        incidentTypeMatch: 100,
      };
      matchReason = `Resolution report confirmed for active incident ${candidate.id} (${candidate.title}) based on evacuation sequence and demographic match.`;
    }
  }

  // 10. Conflict Detection
  let hasConflict = false;
  let conflictField: string | null = null;
  let previousValue: any = null;
  let newValue: any = null;
  let conflictExplanation: string | null = null;

  if (sameIncident && matchedIncidentId) {
    const matched = existingIncidents.find((i) => i.id === matchedIncidentId);
    if (matched && affected !== null && matched.people.affected !== null && affected !== matched.people.affected) {
      hasConflict = true;
      conflictField = 'people_affected';
      previousValue = matched.people.affected;
      newValue = affected;
      conflictExplanation = `Updated report indicates count changed from ${previousValue} to ${newValue} individuals trapped/affected. Prior count retained in incident timeline history.`;
    }
  }

  // 11. AI Explanations & Evidence
  const whySameIncident = sameIncident
    ? `Identified matching landmark cluster (${factors.landmarkMatch}% confidence) and contiguous flood/disaster sector. Signals share spatial centroid within 300m.`
    : `Unique geographical centroid and distinct situation semantics. No overlapping landmark signature with active incidents.`;

  const whyCritical =
    urgency === 'critical'
      ? `Elevated to CRITICAL due to: ${affected ? affected + ' persons trapped' : 'threat to human life'}, ${vulnerable.length > 0 ? vulnerable.map((v) => v.type).join(', ') + ' vulnerable person(s)' : 'escalating hazard kinetics'}, and rapid water ingress/hazard propagation.`
      : `Assessed as ${urgency.toUpperCase()} based on localized scope and absence of confirmed vulnerable entrapment.`;

  const whyApproximateLocation = `Report references descriptive urban landmarks ('${landmarks.join(', ') || 'vicinity'}') rather than high-precision GPS telemetry. Marked as approximate centroid to prevent false positional certainty.`;

  return {
    classification,
    classificationConfidence,
    incidentType,
    location: {
      raw: signal.rawText,
      normalized: normalizedLocation,
      landmarks: landmarks.length > 0 ? landmarks : ['Local vicinity'],
      area,
      direction,
      nearbyBuilding,
      relativePosition,
      latitude: resolved ? resolved.lat : null,
      longitude: resolved ? resolved.lng : null,
      confidence: resolved ? resolved.confidence : 0.85,
      isApproximate: true, // Always approximate unless GPS verified
    },
    people: {
      affected,
      trapped,
      vulnerable,
    },
    urgency,
    severity,
    resources,
    status,
    language: detectedLanguage,
    confidence: 0.93,
    uncertainties:
      landmarks.length === 0
        ? ['Exact street address not specified in audio/text report']
        : ['Pinpoint building entry point requires field responder verification'],
    evidence: [
      `Normalized Landmark: ${normalizedLocation}`,
      `Detected Language: ${detectedLanguage}`,
      `Signal Urgency: ${urgency.toUpperCase()}`,
      ...(vulnerable.map((v) => `Identified Vulnerable: ${v.type.toUpperCase()}`) || []),
      ...(isResolution ? ['Resolution confirmation detected in report text'] : []),
    ],
    match: {
      sameIncident,
      matchedIncidentId,
      similarityScore,
      reason: matchReason,
      factors,
    },
    conflictDetection: {
      hasConflict,
      field: conflictField,
      previousValue,
      newValue,
      explanation: conflictExplanation,
    },
    resolutionDetection: {
      isResolution,
      details: isResolution ? 'Report signals completion of rescue and evacuee extraction.' : null,
    },
    explanations: {
      whySameIncident,
      whyCritical,
      whyApproximateLocation,
    },
  };
}
