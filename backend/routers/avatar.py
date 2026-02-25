from fastapi import APIRouter
import schemas
from services import AvatarService

router = APIRouter(prefix="/api/avatar", tags=["avatar"])

@router.post("/create", response_model=schemas.AvatarResponse)
def create_avatar_video(input: schemas.AvatarCreateRequest):
    video_url = AvatarService.create_video(input.text, input.avatar_id, input.voice_id)
    return {"video_url": video_url}
