export type SignalSource =
  | 'audio_call'
  | 'whatsapp'
  | 'sms'
  | 'social_media'
  | 'field_responder'
  | 'manual';

export type IncidentClassification = 'emergency' | 'non-emergency' | 'unverified';

export type IncidentType =
  | 'flood'
  | 'fire'
  | 'medical'
  | 'accident'
  | 'evacuation'
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus =
  | 'active'
  | 'rescue_in_progress'
  | 'resolved'
  | 'unverified';

export interface LocationIntelligence {
  raw: string;
  normalized: string;
  landmarks: string[];
  area?: string;
  direction?: string;
  nearbyBuilding?: string;
  relativePosition?: string;
  locationAliases?: string[];
  latitude: number | null;
  longitude: number | null;
  confidence: number;
  isApproximate: boolean;
}

export interface VulnerablePerson {
  type: string;
  details: string;
}

export interface PeopleIntelligence {
  affected: number | null;
  trapped: number | null;
  vulnerable: VulnerablePerson[];
}

export interface EmergencySignal {
  id: string;
  source: SignalSource;
  sender: string;
  rawText: string;
  language: string;
  timestamp: string;
  audioUrl?: string;
  imageUrl?: string;
  isDemoConnector?: boolean;
}

export interface SimilarityFactors {
  landmarkMatch: number;
  locationContext: number;
  semanticSimilarity: number;
  timeCompatibility: number;
  incidentTypeMatch: number;
}

export interface IncidentMatchResult {
  sameIncident: boolean;
  matchedIncidentId: string | null;
  similarityScore: number;
  reason: string;
  factors: SimilarityFactors;
}

export interface ConflictDetection {
  hasConflict: boolean;
  field: string | null;
  previousValue: string | number | null;
  newValue: string | number | null;
  explanation: string | null;
}

export interface ResolutionDetection {
  isResolution: boolean;
  details: string | null;
}

export interface AIExplanations {
  whySameIncident?: string;
  whyCritical?: string;
  whyApproximateLocation?: string;
}

export interface AnalysisResult {
  classification: IncidentClassification;
  classificationConfidence: number;
  incidentType: IncidentType;
  location: LocationIntelligence;
  people: PeopleIntelligence;
  urgency: UrgencyLevel;
  severity: UrgencyLevel;
  resources: string[];
  status: IncidentStatus;
  language: string;
  confidence: number;
  uncertainties: string[];
  evidence: string[];
  match: IncidentMatchResult;
  conflictDetection: ConflictDetection;
  resolutionDetection: ResolutionDetection;
  explanations: AIExplanations;
}

export interface WhatChangedEntry {
  id: string;
  timestamp: string;
  type: 'people' | 'urgency' | 'vulnerable' | 'resource' | 'status' | 'conflict' | 'note';
  label: string;
  from?: string | number | null;
  to?: string | number | null;
  sourceSignalId?: string;
  detail: string;
}

export interface Incident {
  id: string;
  title: string;
  incidentType: IncidentType;
  classification: IncidentClassification;
  location: LocationIntelligence;
  people: PeopleIntelligence;
  peopleHistory: Array<{ count: number; timestamp: string; label: string }>;
  urgency: UrgencyLevel;
  severity: UrgencyLevel;
  status: IncidentStatus;
  resources: string[];
  confidence: number;
  uncertainties: string[];
  evidence: string[];
  signals: EmergencySignal[];
  whatChanged: WhatChangedEntry[];
  createdAt: string;
  updatedAt: string;
  conflictCount: number;
  aiExplanations: AIExplanations;
}

export interface PipelineStep {
  step: 'ingest' | 'understand' | 'extract' | 'track' | 'show';
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'skipped';
  details?: string;
}
