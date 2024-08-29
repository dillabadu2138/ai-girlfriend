from typing import List
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_all_messages() -> List[dict]:
	messages = [
		{
      "text": "안녕",
    },
    {
      "text": "오늘부터 나는 너의 AI 여친이야!",
    },
    {
      "text": "내가 무엇을 도와줄까?",
    },
  ]
	
	return messages