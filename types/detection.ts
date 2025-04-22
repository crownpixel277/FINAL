export type DetectionType = 'image' | 'video' | 'audio' | 'email';

export interface DetectionResult {
  isDeepfake: boolean;
  confidence: number;
  details: {
    manipulationType: string;
    confidenceScores: {
      face: number;
      voice: number;
      video: number;
    };
  };
}

export interface DetectionRequest {
  file: File;
  type: DetectionType;
}

export interface DetectionResponse {
  detectionId: string;
  result: DetectionResult;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: {
    true_positive: number;
    true_negative: number;
    false_positive: number;
    false_negative: number;
  };
} 