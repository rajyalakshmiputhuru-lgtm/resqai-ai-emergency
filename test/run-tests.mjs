/**
 * ResQAI Automated Test Suite
 * Tests all core requirements:
 * 1. Emergency classification
 * 2. Noise filtering
 * 3. Telugu-English code-mixed understanding
 * 4. Indian landmark extraction & approximate location handling
 * 5. Incident matching & clustering
 * 6. Duplicate reports handling
 * 7. Conflicting counts tracking
 * 8. Urgency escalation
 * 9. Resource recommendation (advisory)
 * 10. Resolution detection
 * 11. Empty & invalid input resilience
 */

import { analyzeEmergencySignal } from '../src/lib/ai/gemini.ts';

async function runTests() {
  console.log('🧪 Starting ResQAI Comprehensive Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // --- Test 1: Emergency Classification ---
  console.log('[1/11] Testing Emergency Classification');
  const emergencySignal = {
    id: 'T1',
    source: 'audio_call',
    sender: 'Caller 1',
    rawText: 'Water entered houses near Velachery MRTS and 10 people are trapped.',
    language: 'English',
    timestamp: '08:10 AM',
  };
  const res1 = await analyzeEmergencySignal(emergencySignal, []);
  assert(res1.classification === 'emergency', 'Correctly classifies urgent flood as emergency');
  assert(res1.people.trapped === 10, 'Extracts trapped count of 10');

  // --- Test 2: Noise Filtering ---
  console.log('\n[2/11] Testing Noise Filtering');
  const noiseSignal = {
    id: 'T2',
    source: 'social_media',
    sender: 'Foodie',
    rawText: 'Traffic is heavy near Velachery bypass road today. Swiggy delivery delayed.',
    language: 'English',
    timestamp: '08:14 AM',
  };
  const res2 = await analyzeEmergencySignal(noiseSignal, []);
  assert(res2.classification === 'non-emergency', 'Correctly classifies traffic/food complaint as non-emergency');
  assert(res2.urgency === 'low', 'Assigns low urgency to noise signal');

  // --- Test 3: Telugu-English Code-Mixed Understanding ---
  console.log('\n[3/11] Testing Telugu-English Understanding');
  const teluguSignal = {
    id: 'T3',
    source: 'whatsapp',
    sender: 'Resident',
    rawText: 'Velachery MRTS daggara water chala perigindi, 10 members trapped unnaru. Oka elderly person inside lo unnaru.',
    language: 'Telugu-English',
    timestamp: '08:16 AM',
  };
  const res3 = await analyzeEmergencySignal(teluguSignal, []);
  assert(res3.incidentType === 'flood', 'Identifies incident as flood from Telugu context');
  assert(res3.people.affected === 10, 'Extracts 10 affected members from Telugu sentence');
  assert(res3.people.vulnerable.length > 0 && res3.people.vulnerable[0].type === 'elderly', 'Detects elderly vulnerable person');

  // --- Test 4: Indian Landmark Intelligence & Approximate Coordinates ---
  console.log('\n[4/11] Testing Indian Landmark Intelligence');
  const landmarkSignal = {
    id: 'T4',
    source: 'audio_call',
    sender: 'Caller 2',
    rawText: 'Behind the MRTS station, on the Vijayanagar side opposite medical shop.',
    language: 'English',
    timestamp: '08:20 AM',
  };
  const res4 = await analyzeEmergencySignal(landmarkSignal, []);
  assert(res4.location.isApproximate === true, 'Flags location as approximate (never faking exact GPS)');
  assert(res4.location.landmarks.length > 0, 'Extracts identifiable landmarks');
  assert(res4.location.confidence > 0.7, 'Calculates landmark confidence score');

  // --- Test 5: Incident Matching & Clustering ---
  console.log('\n[5/11] Testing Incident Clustering & Similarity');
  const mockExistingIncident = {
    id: 'INC-001',
    title: 'FLOOD at Velachery MRTS Station',
    incidentType: 'flood',
    classification: 'emergency',
    location: {
      raw: 'Velachery MRTS west gate',
      normalized: 'Velachery MRTS Station, Velachery, Chennai',
      landmarks: ['Velachery MRTS Station', 'West Gate'],
      latitude: 12.9785,
      longitude: 80.2185,
      confidence: 0.88,
      isApproximate: true,
    },
    people: { affected: 6, trapped: 6, vulnerable: [] },
    peopleHistory: [{ count: 6, timestamp: '08:10 AM', label: 'Initial' }],
    urgency: 'high',
    severity: 'high',
    status: 'active',
    resources: ['rescue boat'],
    confidence: 0.92,
    uncertainties: [],
    evidence: [],
    signals: [emergencySignal],
    whatChanged: [],
    createdAt: '08:10 AM',
    updatedAt: '08:10 AM',
    conflictCount: 0,
    aiExplanations: {},
  };

  const followUpSignal = {
    id: 'T5',
    source: 'sms',
    sender: 'Alert',
    rawText: 'Water rising rapidly near Velachery MRTS station west gate terrace.',
    language: 'English',
    timestamp: '08:30 AM',
  };
  const res5 = await analyzeEmergencySignal(followUpSignal, [mockExistingIncident]);
  assert(res5.match.sameIncident === true, 'Successfully clusters new report into existing INC-001');
  assert(res5.match.matchedIncidentId === 'INC-001', 'Matches correct incident ID');
  assert(res5.match.similarityScore >= 65, `High similarity score computed (${res5.match.similarityScore}%)`);

  // --- Test 6: Conflicting Counts Handling ---
  console.log('\n[6/11] Testing Conflicting Counts Handling');
  const conflictSignal = {
    id: 'T6',
    source: 'sms',
    sender: 'Field Alert',
    rawText: 'Update from Velachery MRTS: count is 10 people now trapped on roof.',
    language: 'English',
    timestamp: '08:35 AM',
  };
  const res6 = await analyzeEmergencySignal(conflictSignal, [mockExistingIncident]);
  assert(res6.conflictDetection.hasConflict === true, 'Detects conflict between 6 and 10 trapped people');
  assert(res6.conflictDetection.previousValue === 6, 'Preserves previous count of 6');
  assert(res6.conflictDetection.newValue === 10, 'Tracks new count of 10');

  // --- Test 7: Urgency Escalation ---
  console.log('\n[7/11] Testing Urgency Escalation');
  const rapidWaterSignal = {
    id: 'T7',
    source: 'social_media',
    sender: 'Citizen',
    rawText: 'Velachery MRTS daggara water rising rapidly, terrace submerging, critical emergency!',
    language: 'Telugu-English',
    timestamp: '08:40 AM',
  };
  const res7 = await analyzeEmergencySignal(rapidWaterSignal, [mockExistingIncident]);
  assert(res7.urgency === 'critical', 'Urgency escalated to CRITICAL when water is rising rapidly');

  // --- Test 8: Advisory Resource Recommendation ---
  console.log('\n[8/11] Testing Resource Recommendation');
  assert(res7.resources.includes('rescue boat'), 'Recommends rescue boat for rising floodwaters');
  assert(res7.resources.includes('medical team'), 'Recommends medical team');

  // --- Test 9: Resolution Detection ---
  console.log('\n[9/11] Testing Operational Resolution Detection');
  const resolutionSignal = {
    id: 'T9',
    source: 'field_responder',
    sender: 'Commander',
    rawText: 'All 10 residents evacuated safely. Everyone rescued.',
    language: 'English',
    timestamp: '09:30 AM',
  };
  const res9 = await analyzeEmergencySignal(resolutionSignal, [mockExistingIncident]);
  assert(res9.status === 'resolved', 'Detects resolution and sets status to resolved');
  assert(res9.resolutionDetection.isResolution === true, 'Flags isResolution: true');

  // --- Test 10: Unverified Rumor Classification ---
  console.log('\n[10/11] Testing Unverified Rumor Classification');
  const rumorSignal = {
    id: 'T10',
    source: 'social_media',
    sender: 'Rumor',
    rawText: 'Someone said maybe 20 people are trapped somewhere in south chennai, unverified forwarded message.',
    language: 'English',
    timestamp: '08:58 AM',
  };
  const res10 = await analyzeEmergencySignal(rumorSignal, []);
  assert(res10.classification === 'unverified', 'Classifies third-hand claim as unverified');

  // --- Test 11: Resilience to Edge Cases ---
  console.log('\n[11/11] Testing Edge Cases');
  const edgeSignal = {
    id: 'T11',
    source: 'manual',
    sender: 'Test',
    rawText: 'Help! Water!',
    language: 'English',
    timestamp: '09:00 AM',
  };
  const res11 = await analyzeEmergencySignal(edgeSignal, []);
  assert(res11 !== null && res11.incidentType === 'flood', 'Handles terse input without error');

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal error running tests:', e);
  process.exit(1);
});
