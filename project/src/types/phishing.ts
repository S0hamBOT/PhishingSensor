export type RiskLevel = 'safe' | 'suspicious' | 'dangerous' | 'unknown' | 'error';

export interface ExplanationFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

export interface PhishingStatus {
  score: number;
  risk: RiskLevel;
  explanation: ExplanationFactor[];
  url: string;
  timestamp: Date;
}

export interface SiteInfo {
  url: string;
  domain: string;
  title: string;
  favicon: string;
}

export interface FeedbackData {
  url: string;
  userClassification: RiskLevel;
  systemClassification: RiskLevel;
  reason?: string;
  timestamp: Date;
}

export interface DetectionHistory {
  items: PhishingStatus[];
  lastUpdated: Date;
}

export interface PhishingFeatures {
  url_features: Record<string, number>;
  text_features: Record<string, number>;
  html_features: Record<string, number>;
}