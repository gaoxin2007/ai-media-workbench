from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# --- IP Positioning ---

# Output Schema (Strict JSON)
class AudienceProfile(BaseModel):
    name: str
    pain_points: List[str]
    triggers: List[str]

class ContentPillar(BaseModel):
    pillar: str
    topics: List[str]

class MonetizationPath(BaseModel):
    offer: str
    price_hint: Optional[str] = None
    cta: str

class IPPositioningResult(BaseModel):
    positioning_one_liner: str
    audience_profiles: List[AudienceProfile]
    content_pillars: List[ContentPillar]
    differentiation: List[str]
    monetization_path: List[MonetizationPath]
    do_not_say: List[str]
    sample_titles: List[str]
    sample_hooks: List[str]
    confidence_notes: str

# Input Schema
class IPInput(BaseModel):
    name_or_brand: Optional[str] = None
    bio: str
    target_direction: str
    style_preference: str
    target_audience: Optional[str] = None
    monetization: Optional[str] = None
    constraints: Optional[str] = None
    platform_preference: Optional[str] = "douyin"

# Database Response Schema
class IPProfileResponse(BaseModel):
    id: int
    input_json: Optional[Dict] = None
    result_json: Optional[IPPositioningResult] = None
    persona: Optional[str] = None
    audience: Optional[str] = None
    content_pillars: Optional[List[str]] = None
    usp: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class IPHistoryItem(BaseModel):
    id: int
    created_at: datetime
    positioning_one_liner: Optional[str] = None

    class Config:
        from_attributes = True

# --- Benchmark Accounts ---
class BenchmarkSearch(BaseModel):
    keyword: str

class BenchmarkAccountBase(BaseModel):
    account_name: str
    user_id: str
    profile_url: str
    analysis_reason: str
    learning_points: str

class BenchmarkAccountResponse(BenchmarkAccountBase):
    id: int
    platform: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Script Extraction & Rewrite ---
class ScriptExtractRequest(BaseModel):
    url: Optional[str] = None
    # For file upload, we'll handle it in the controller separately

class ScriptResponse(BaseModel):
    id: int
    source_type: str
    source_content: str
    transcript: str
    created_at: datetime

    class Config:
        from_attributes = True

class RewriteRequest(BaseModel):
    script_id: int
    ip_context: Optional[str] = None # Optional context to guide rewrite

class RewriteVersionResponse(BaseModel):
    id: int
    style: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Digital Human ---
class AvatarCreateRequest(BaseModel):
    text: str
    avatar_id: str
    voice_id: str

class AvatarResponse(BaseModel):
    video_url: str
