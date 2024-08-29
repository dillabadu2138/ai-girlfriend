from fastapi import APIRouter
from app.api.routes.messages import router as messages_router
from app.api.routes.chats import router as chats_router
from app.api.routes.tts import router as tts_router

router = APIRouter()

router.include_router(messages_router, prefix="/messages", tags=["messages"])
router.include_router(chats_router, prefix="/chats", tags=["chats"])
router.include_router(tts_router, prefix="/tts", tags=["tts"])
