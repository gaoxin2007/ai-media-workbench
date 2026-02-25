import os
import json
import httpx
import random
from typing import List, Dict, Any
from fastapi import HTTPException
import schemas

# Configuration
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY")
DASHSCOPE_BASE_URL = os.getenv("DASHSCOPE_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
QWEN_MODEL = os.getenv("QWEN_MODEL", "qwen-plus")

class AIService:
    @staticmethod
    async def generate_ip_positioning(input_data: schemas.IPInput) -> schemas.IPPositioningResult:
        """
        Generate IP Positioning using Qwen (DashScope) API via OpenAI-compatible interface.
        """
        if not DASHSCOPE_API_KEY:
            # Fallback to mock if no key provided, but strictly speaking we should error or warn.
            # For this task, user asked to replace mock with real LLM. 
            # If key is missing, we raise an error to prompt user configuration.
            raise HTTPException(status_code=500, detail="DASHSCOPE_API_KEY is not set in environment variables.")

        system_prompt = """
You are an expert AI Social Media Consultant. Your task is to analyze the user's input and generate a comprehensive IP Positioning Strategy.

Output MUST be a valid JSON object matching the following structure exactly. Do NOT output any text other than the JSON.

JSON Structure:
{
  "positioning_one_liner": "A catchy, concise one-sentence positioning statement.",
  "audience_profiles": [
    {
      "name": "Target Audience Segment Name",
      "pain_points": ["Pain point 1", "Pain point 2"],
      "triggers": ["Trigger 1", "Trigger 2"]
    }
  ],
  "content_pillars": [
    {
      "pillar": "Core Content Theme",
      "topics": ["Sub-topic 1", "Sub-topic 2"]
    }
  ],
  "differentiation": ["Unique selling point 1", "Unique selling point 2"],
  "monetization_path": [
    {
      "offer": "Product/Service Name",
      "price_hint": "Low/Mid/High Ticket or specific range",
      "cta": "Call to action"
    }
  ],
  "do_not_say": ["Avoid making medical claims", "Do not promise guaranteed wealth"],
  "sample_titles": ["Title 1", "Title 2", ...],
  "sample_hooks": ["Hook 1", "Hook 2", ...],
  "confidence_notes": "Explain what is inferred vs based on input. Mention any assumptions."
}

CONSTRAINTS:
1. STRICTLY JSON output. No markdown fencing (```json), no introductory text.
2. Compliance: Do NOT generate content that violates advertising laws (e.g., guaranteed cures, absolute best, get rich quick). Add these to 'do_not_say'.
3. If input is vague, use 'confidence_notes' to explain assumptions.
"""

        user_prompt = f"""
Analyze the following IP Profile Input:

Name/Brand: {input_data.name_or_brand or "Not specified"}
Bio/Background: {input_data.bio}
Target Direction: {input_data.target_direction}
Style Preference: {input_data.style_preference}
Target Audience (Optional): {input_data.target_audience or "Not specified"}
Monetization Goals (Optional): {input_data.monetization or "Not specified"}
Constraints/Boundaries (Optional): {input_data.constraints or "None"}
Platform Preference: {input_data.platform_preference}

Generate the JSON strategy.
"""

        headers = {
            "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": QWEN_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "response_format": {"type": "json_object"} # Qwen/OpenAI compatible JSON mode if supported, otherwise prompt relies on it
        }

        # Retry logic (Simple loop)
        max_retries = 2
        last_exception = None

        async with httpx.AsyncClient(timeout=60.0) as client:
            for attempt in range(max_retries + 1):
                try:
                    response = await client.post(f"{DASHSCOPE_BASE_URL}/chat/completions", headers=headers, json=payload)
                    response.raise_for_status()
                    
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    
                    # Clean up content if it contains markdown code blocks (despite prompt)
                    if content.startswith("```json"):
                        content = content[7:]
                    if content.endswith("```"):
                        content = content[:-3]
                    
                    result_dict = json.loads(content)
                    
                    # Validate against schema (Pydantic will do this)
                    return schemas.IPPositioningResult(**result_dict)
                
                except httpx.HTTPStatusError as e:
                    last_exception = e
                    print(f"API Request failed (Attempt {attempt+1}): {e.response.text}")
                except (json.JSONDecodeError, ValueError) as e:
                    last_exception = e
                    print(f"JSON Parse/Validation failed (Attempt {attempt+1}): {e}")
                except Exception as e:
                    last_exception = e
                    print(f"Unknown error (Attempt {attempt+1}): {e}")
                
                if attempt < max_retries:
                    continue # Retry
        
        # If we get here, all retries failed
        raise HTTPException(status_code=502, detail=f"Failed to generate IP Positioning after retries. Error: {str(last_exception)}")

    # --- KEEPING EXISTING MOCK METHODS FOR OTHER MODULES (Unchanged) ---
    
    @staticmethod
    def generate_ip_profile(bio: str, direction: str, style: str) -> Dict:
        """Deprecated Mock AI generation for backward compatibility if needed"""
        return {
            "persona": f"AI Expert in {direction} with a {style} tone.",
            "audience": "Tech enthusiasts, early adopters, and creators.",
            "content_pillars": [f"{direction} Trends", "Tutorials", "Analysis", "Reviews"],
            "usp": f"Combining deep technical knowledge with {style} storytelling."
        }

    @staticmethod
    def generate_benchmark_analysis(account_name: str) -> Dict:
        """Mock AI generation for benchmark analysis"""
        return {
            "analysis_reason": f"High engagement on {account_name}'s recent posts regarding AI tools.",
            "learning_points": "Clear hooks, fast-paced editing, and strong call-to-actions."
        }

    @staticmethod
    def rewrite_script(transcript: str, style: str) -> str:
        """Mock AI rewriting"""
        prefix = ""
        if style == "hook":
            prefix = "STOP SCROLLING! You won't believe this... "
        elif style == "professional":
            prefix = "In this analysis, we observe that... "
        elif style == "emotional":
            prefix = "I've been struggling with this for years, and here's what I found... "
        
        return f"{prefix} (Rewritten content based on: {transcript[:50]}...)"

class DouyinService:
    @staticmethod
    def search_accounts(keyword: str) -> List[Dict]:
        """Mock TikHub Douyin API search"""
        mock_accounts = [
            {
                "account_name": f"{keyword}_Master",
                "user_id": "user_12345",
                "profile_url": "https://www.douyin.com/user/12345"
            },
            {
                "account_name": f"Daily_{keyword}",
                "user_id": "user_67890",
                "profile_url": "https://www.douyin.com/user/67890"
            },
            {
                "account_name": f"Love_{keyword}",
                "user_id": "user_11223",
                "profile_url": "https://www.douyin.com/user/11223"
            }
        ]
        return mock_accounts

    @staticmethod
    def get_video_data(url: str) -> Dict:
        """Mock TikHub Video Data"""
        return {
            "title": "Amazing AI Tools",
            "transcript": "This is a transcript of the video content extracted from Douyin..."
        }

class AvatarService:
    @staticmethod
    def create_video(text: str, avatar_id: str, voice: str) -> str:
        """Mock Avatar Video Generation"""
        return "https://demo-avatar-video.mp4"
