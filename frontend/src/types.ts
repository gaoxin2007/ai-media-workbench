export interface AudienceProfile {
  name: string;
  pain_points: string[];
  triggers: string[];
}

export interface ContentPillar {
  pillar: string;
  topics: string[];
}

export interface MonetizationPath {
  offer: string;
  price_hint?: string;
  cta: string;
}

export interface IPPositioningResult {
  positioning_one_liner: string;
  audience_profiles: AudienceProfile[];
  content_pillars: ContentPillar[];
  differentiation: string[];
  monetization_path: MonetizationPath[];
  do_not_say: string[];
  sample_titles: string[];
  sample_hooks: string[];
  confidence_notes: string;
}

export interface IPProfile {
  id: number;
  // Legacy fields (optional now)
  persona?: string;
  audience?: string;
  content_pillars?: string[];
  usp?: string;
  // New fields
  input_json?: any;
  result_json?: IPPositioningResult;
  created_at: string;
}

export interface IPHistoryItem {
  id: number;
  created_at: string;
  positioning_one_liner?: string;
}

export interface BenchmarkAccount {
  id: number;
  platform: string;
  keyword: string;
  account_name: string;
  user_id: string;
  profile_url: string;
  analysis_reason: string;
  learning_points: string;
  created_at: string;
}

export interface Script {
  id: number;
  source_type: string;
  source_content: string;
  transcript: string;
  created_at: string;
}

export interface RewriteVersion {
  id: number;
  script_id: number;
  style: string;
  content: string;
  created_at: string;
}

export interface AvatarResponse {
  video_url: string;
}
