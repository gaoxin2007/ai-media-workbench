from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class IPProfile(Base):
    __tablename__ = "ip_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_input = Column(JSON)  # Stores initial user input (Legacy)
    input_json = Column(JSON)  # Stores full input JSON
    result_json = Column(JSON) # Stores full AI result JSON
    persona = Column(String)   # Kept for backward compatibility or summary
    audience = Column(String)
    content_pillars = Column(JSON)
    usp = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BenchmarkAccount(Base):
    __tablename__ = "benchmark_accounts"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, default="douyin")
    keyword = Column(String)
    account_name = Column(String)
    user_id = Column(String)
    profile_url = Column(String)
    analysis_reason = Column(Text)
    learning_points = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class VideoScript(Base):
    __tablename__ = "video_scripts"

    id = Column(Integer, primary_key=True, index=True)
    source_type = Column(String)  # 'link' or 'upload'
    source_content = Column(String)  # URL or filename
    transcript = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    rewrites = relationship("RewriteVersion", back_populates="original_script")

class RewriteVersion(Base):
    __tablename__ = "rewrite_versions"

    id = Column(Integer, primary_key=True, index=True)
    script_id = Column(Integer, ForeignKey("video_scripts.id"))
    style = Column(String)  # 'hook', 'professional', 'emotional'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    original_script = relationship("VideoScript", back_populates="rewrites")
