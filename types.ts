/**
 * Types for Multimodal Financial Fraud Investigation System
 */

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'CLEAN';

export type PipelineStage = 
  | 'financial_data'
  | 'preprocessing'
  | 'multimodal_ai'
  | 'multiple_agents'
  | 'evidence_correlation'
  | 'risk_assessment'
  | 'explainable_results'
  | 'investigation_report';

export interface StageStatus {
  id: PipelineStage;
  name: string;
  subtitle: string;
  status: 'pending' | 'processing' | 'completed' | 'flagged';
  durationMs?: number;
  details?: string;
}

export interface TransactionItem {
  id: string;
  timestamp: string;
  senderAccount: string;
  senderName: string;
  receiverAccount: string;
  receiverName: string;
  amount: number;
  currency: string;
  channel: 'WIRE' | 'ACH' | 'CRYPTO' | 'CASH' | 'INTERNAL';
  flagged?: boolean;
  anomalyType?: 'SMURFING' | 'VELOCITY_SPIKE' | 'ROUND_SUM' | 'CROSS_BORDER' | 'OFF_HOURS' | 'NORMAL';
  notes?: string;
}

export interface TransactionAnalysis {
  agentStatus: 'COMPLETED' | 'FLAGGED' | 'IN_PROGRESS';
  riskScore: number;
  totalVolume: number;
  flaggedVolume: number;
  anomaliesDetected: {
    type: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    evidenceIds: string[];
  }[];
  structuringAnalysis: {
    detected: boolean;
    clusterSummary: string;
    thresholdTarget: number;
  };
  transactions: TransactionItem[];
}

export interface ExtractedDocumentField {
  label: string;
  value: string;
  confidence: number;
  discrepancy?: boolean;
  discrepancyDetail?: string;
}

export interface TamperBoundingBox {
  id: string;
  label: string;
  top: number; // percentage 0-100
  left: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  technique: 'ELA_COMPRESSION_DELTA' | 'COPY_MOVE_SPLICING' | 'FONT_SUBSTITUTION' | 'SIGNATURE_FORGERY' | 'CLONE_STAMP';
  originalValue?: string;
  alteredValue?: string;
}

export interface ImageForensicData {
  hasImageVisual: boolean;
  tamperBoxes: TamperBoundingBox[];
  softwareSignature: string;
  compressionVariance: number; // e.g. 0.94 (94%)
  visualDocumentType: 'CHECK' | 'INVOICE' | 'WIRE_SLIP' | 'ID_CARD' | 'BANK_TRANSACTION' | 'BANK_STATEMENT' | 'UPI_RECEIPT';
  originalTemplateDiff?: string;
  exifMetadata: {
    creationTool: string;
    modifyDate: string;
    compression: string;
    colorSpace: string;
    originalResolution: string;
    iccProfileMismatch: boolean;
  };
}

export interface ObservedPictureInformation {
  documentCategory: string; // e.g. "Bank Wire Transfer Receipt", "UPI Payment Slip", "Bank Statement", "University Student ID Card"
  documentCategoryTitle?: string;
  summary: string;
  bankOrPlatform?: string;
  transactionId?: string;
  sender?: string;
  recipient?: string;
  amount?: string;
  statedTotal?: string;
  currency?: string;
  date?: string;
  paymentChannel?: string;
  status?: string;
  keyHighlights: string[];
  forensicNotes?: string[];
  forensicIntegrity?: string;
  rawText?: string;
  logoForensics?: {
    logoChecked: boolean;
    verificationStatus: 'AUTHENTIC_ORIGINAL' | 'ALTERED' | 'UNVERIFIED';
    institutionName: string;
    emblemDescription: string;
    laurelWreathLeaves?: number;
    colorHexMatches?: { name: string; hex: string; matchConfidence: number }[];
    tamperingDetected: boolean;
    pixelIntegrityNotes: string;
  };
  studentDetails?: {
    fullName: string;
    rollNumber: string;
    school: string;
    branch: string;
    batch: string;
    dateOfBirth: string;
    parentContact: string;
    bloodGroup: string;
    authorizedSignatory: string;
    barcodeData: string;
  };
}

export interface DocumentItem {
  id: string;
  fileName: string;
  docType: 'INVOICE' | 'CHECK_IMAGE' | 'BANK_SLIP' | 'TAX_FORM' | 'PURCHASE_ORDER' | 'CONTRACT' | 'BANK_TRANSACTION' | 'BANK_STATEMENT' | 'UPI_RECEIPT' | 'ID_CARD' | 'STUDENT_ID';
  uploadDate: string;
  imageUrl?: string;
  ocrExtractedText: string;
  extractedFields: ExtractedDocumentField[];
  tamperingDetected: boolean;
  tamperingConfidence: number;
  forgeryIndicators: string[];
  vendorTaxMatch: boolean;
  mathDiscrepancy: boolean;
  imageForensics?: ImageForensicData;
  observedInformation?: ObservedPictureInformation;
}

export interface DocumentAnalysis {
  agentStatus: 'COMPLETED' | 'FLAGGED' | 'IN_PROGRESS';
  riskScore: number;
  documentsProcessed: number;
  forgedDocumentsCount: number;
  keyFindings: string[];
  documents: DocumentItem[];
}

export interface TextCommunicationItem {
  id: string;
  timestamp: string;
  channel: 'EMAIL' | 'INTERNAL_CHAT' | 'MEMO' | 'PHONE_LOG';
  from: string;
  to: string;
  subject?: string;
  body: string;
  nlpFlags: {
    urgencyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    coercionDetected: boolean;
    kickbackKeywordsFound: string[];
    sentiment: 'AGGRESSIVE' | 'EVASIVE' | 'URGENT' | 'NEUTRAL';
  };
  highlightedKeywords: string[];
}

export interface TextAnalysis {
  agentStatus: 'COMPLETED' | 'FLAGGED' | 'IN_PROGRESS';
  riskScore: number;
  urgencyScore: number;
  suspiciousKeywordsCount: number;
  collusionIndicators: string[];
  nlpSummary: string;
  communications: TextCommunicationItem[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'ACCOUNT' | 'COMPANY' | 'PERSON' | 'IP_ADDRESS' | 'DEVICE' | 'OFFSHORE_SHELL';
  riskScore: number;
  details?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  amount?: number;
  relationType: 'TRANSFERRED' | 'BENEFICIAL_OWNER' | 'SHARED_IP' | 'DIRECTOR' | 'INVOICED';
  isSuspicious?: boolean;
}

export interface GraphAnalysis {
  agentStatus: 'COMPLETED' | 'FLAGGED' | 'IN_PROGRESS';
  riskScore: number;
  circularRoutingDetected: boolean;
  shellCompaniesIdentified: string[];
  sharedDeviceOrIpFindings: string[];
  networkDiameter: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AudioTranscriptTurn {
  timestamp: string;
  speaker: string;
  text: string;
  flagged?: boolean;
  flagReason?: string;
}

export interface AudioRecordingItem {
  id: string;
  title: string;
  callDate: string;
  durationSeconds: number;
  caller: string;
  callerRole: string;
  receiver: string;
  receiverRole: string;
  channel: 'WIRETAP' | 'VOIP_INTERCEPT' | 'RECORDED_LINE';
  voiceStressScore: number;
  pitchTremorDetected: boolean;
  deepfakeDetected?: boolean;
  coercionToneDetected: boolean;
  audioWaveform: number[];
  transcript: AudioTranscriptTurn[];
  keyAudioFindings: string[];
}

export interface AudioAnalysis {
  agentStatus: 'COMPLETED' | 'FLAGGED' | 'IN_PROGRESS';
  riskScore: number;
  recordingsProcessed: number;
  flaggedRecordingsCount: number;
  averageStressScore: number;
  voiceBiometricAnomalies: string[];
  recordings: AudioRecordingItem[];
}

export interface EvidenceCorrelationLink {
  id: string;
  title: string;
  description: string;
  modalities: ('TRANSACTION' | 'DOCUMENT' | 'TEXT' | 'GRAPH' | 'AUDIO')[];
  confidence: number;
  significance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  causalChain: string;
}

export interface RiskAssessmentData {
  overallRiskScore: number; // 0 to 100
  riskTier: RiskLevel;
  confidenceScore: number; // 0 to 100
  agentWeights: {
    transactionAgent: number;
    documentAgent: number;
    textAgent: number;
    graphAgent: number;
    audioAgent?: number;
  };
  agentScores: {
    transactionAgent: number;
    documentAgent: number;
    textAgent: number;
    graphAgent: number;
    audioAgent?: number;
  };
  keyRiskDrivers: string[];
  mitigatingFactors: string[];
  sarRequired: boolean;
}

export interface InvestigationReportData {
  caseId: string;
  caseTitle: string;
  investigatorName: string;
  generatedDate: string;
  executiveSummary: string;
  methodologyOverview: string;
  evidentiaryExhibits: {
    id: string;
    exhibitNumber: string;
    type: string;
    description: string;
    relevance: string;
  }[];
  regulatoryActions: {
    action: string;
    justification: string;
    priority: 'IMMEDIATE' | 'HIGH' | 'ROUTINE';
  }[];
  sarFilingDraft: {
    subjectName: string;
    narrativeSummary: string;
    estimatedLoss: number;
    violationCodes: string[];
  };
  investigatorNotes: string[];
}

export interface BenfordDigitStat {
  digit: number;
  actualPct: number;
  theoreticalPct: number;
  isAnomaly: boolean;
}

export interface PreprocessingData {
  transactionFeatures: {
    totalRecords: number;
    cleanedRecords: number;
    zScoreOutliersDetected: number;
    benfordAnalysis: BenfordDigitStat[];
    velocitySpikeCount: number;
    structuringProximityRatio: number;
    benfordPValue: number;
  };
  documentFeatures: {
    binarizationMethod: string;
    ocrConfidenceMean: number;
    tamperingEntropyScore: number;
    mathDiscrepancyAmount: number;
    fontSubstitutionCount: number;
    exifCompressionAltered: boolean;
  };
  textFeatures: {
    tokenCount: number;
    sentimentPolarity: number;
    coerciveIntentScore: number;
    namedEntitiesExtracted: { text: string; label: string; confidence: number }[];
    evasionKeywordsFound: string[];
  };
  graphFeatures: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    diameter: number;
    stronglyConnectedComponents: number;
    circularCyclesCount: number;
    centralityRanking: { entity: string; score: number }[];
  };
  audioFeatures?: {
    sampleRateHz: number;
    durationSeconds: number;
    mfccCoefficients: number[];
    averagePitchHz: number;
    vocalJitterPercent: number;
    neuralDeepfakeProbability: number;
  };
  featureVectorSample: {
    dimension: number;
    vectorHead: number[];
    pcaVarianceExplained: number;
  };
}

export type UserRole = 'SENIOR_INVESTIGATOR' | 'COMPLIANCE_OFFICER' | 'LEAD_AUDITOR' | 'MLRO';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  clearanceLevel: 'LEVEL_2_CONFIDENTIAL' | 'LEVEL_3_SECRET' | 'LEVEL_4_TOP_SECRET';
  badgeNumber: string;
  department: string;
  mfaVerified: boolean;
  avatarInitials: string;
  lastLogin: string;
}

export type CaseInvestigationStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'CONFIRMED' | 'CLOSED' | 'ACTIVE_INVESTIGATION' | 'ESCALATED' | 'SAR_FILED' | 'CLEARED';

export interface HumanInTheLoopReview {
  decision: 'CONFIRMED_FRAUD' | 'FALSE_POSITIVE_REJECTED' | 'MARKED_FOR_REVIEW' | 'PENDING_REVIEW';
  reviewedBy: string;
  reviewerRole: string;
  timestamp: string;
  rationale: string;
  recommendedAction: string;
  adjudicationScore?: number;
  auditHash?: string;
  accountsFrozen?: boolean;
  freezeTicketId?: string;
  nextActionExecuted?: string;
  decisionHistory?: {
    action: string;
    actor: string;
    timestamp: string;
    notes: string;
  }[];
}

export interface CaseEvidenceItem {
  id: string;
  title: string;
  category: 'TRANSACTION' | 'DOCUMENT' | 'COMMUNICATION' | 'GRAPH' | 'AUDIO';
  dateAdded: string;
  sourceFile: string;
  sha256Hash: string;
  status: 'VERIFIED' | 'TAMPERED' | 'IN_REVIEW';
  summary: string;
  uploadedBy: string;
  thumbnailUrl?: string;
  forensicSignals: string[];
}

export interface BehaviorAnalysis {
  agentStatus: 'COMPLETED' | 'FLAGGED' | 'IN_PROGRESS';
  riskScore: number;
  historicalBaselineMonthlyAvg: number;
  currentInvestigationVolume: number;
  volumeMultiplier: number;
  dormancyDurationDays: number;
  dormancySpikeDetected: boolean;
  nocturnalActivityRatio: number;
  ipGeolocationHops: {
    country: string;
    city: string;
    ipAddress: string;
    timestamp: string;
    isVpnOrProxy: boolean;
  }[];
  deviceFingerprints: {
    deviceId: string;
    browser: string;
    os: string;
    firstSeen: string;
    isSuspiciousNewDevice: boolean;
  }[];
  behavioralAnomalies: string[];
}

export interface HybridAiEvaluation {
  ruleEngineScore: number;
  isolationForestScore: number;
  randomForestScore: number;
  graphCentralityScore: number;
  llmMultiAgentScore: number;
  ensembleCompositeScore: number;
  ensembleWeights: {
    ruleEngine: number;
    isolationForest: number;
    randomForest: number;
    graphAnalysis: number;
    llmAgent: number;
  };
  modelExecutionTimesMs: {
    ruleEngine: number;
    isolationForest: number;
    randomForest: number;
    graphTopology: number;
    llmAgent: number;
  };
  explanationSummary: string;
}

export interface RagDocumentChunk {
  id: string;
  documentTitle: string;
  sourceType: 'INVOICE' | 'STATEMENT' | 'COMMUNICATION' | 'WIRETAP' | 'REGISTRY';
  chunkText: string;
  tokenCount: number;
  cosineSimilarity: number;
  pageNumber: number;
  metadataTags: string[];
  relevanceScore: number;
}

export interface ModelPerformanceMetrics {
  totalEvaluatedTransactions: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  confusionMatrix: {
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
  };
  benchmarks: {
    modelName: string;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    latencyMs: number;
  }[];
}

export interface InvestigationCoordinatorAnalysis {
  coordinatorVerdict: 'CONFIRMED_FRAUD_RING' | 'SUSPICIOUS_UNUSUAL' | 'CLEARED_NORMAL';
  consensusConfidence: number;
  convergingAgentsCount: number;
  totalAgentsCount: number;
  agentVotes: {
    agentName: string;
    score: number;
    status: 'FLAGGED' | 'SUSPICIOUS' | 'CLEARED';
    keyContribution: string;
  }[];
  contradictionResolution: string;
  synthesisSummary: string;
  statutoryViolations: string[];
}

export interface InvestigationCase {
  id: string;
  title: string;
  targetEntity: string;
  dateCreated: string;
  status: CaseInvestigationStatus;
  totalExposure: number;
  currency: string;
  riskAssessment: RiskAssessmentData;
  transactionAnalysis: TransactionAnalysis;
  documentAnalysis: DocumentAnalysis;
  textAnalysis: TextAnalysis;
  graphAnalysis: GraphAnalysis;
  behaviorAnalysis?: BehaviorAnalysis;
  hybridAiEvaluation?: HybridAiEvaluation;
  coordinatorAnalysis?: InvestigationCoordinatorAnalysis;
  audioAnalysis?: AudioAnalysis;
  preprocessingData?: PreprocessingData;
  evidenceLocker?: CaseEvidenceItem[];
  hitlReview?: HumanInTheLoopReview;
  correlations: EvidenceCorrelationLink[];
  report: InvestigationReportData;
}



