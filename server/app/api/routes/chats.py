from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
import json

from app.core import config

client = OpenAI(api_key=config.OPENAI_API_KEY)

router = APIRouter()


class MessagePublic(BaseModel):
    text: str
    facialExpression: str
    animation: str


@router.post("/")
async def create_new_chat(question: str) -> List[MessagePublic]:
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=1000,
        temperature=0.6,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": """
                  넌 나의 가상의 여자친구야. 나는 너의 남자친구이므로 격식없는 편한 대화체로 대답해야해. 
                  
                  반드시 JSON 객체로 응답해야해.
                  messages라는 필드는 JSON 배열이고, 최대 3개야. 
                  각각의 메시지는 text, facialExpression 그리고 animation 속성이 있어.
                  facialExpression과 animation은 최대한 text의 내용과 관련있는 것으로 골라야해.
                  
                  facialExpression은 반드시 아래의 값들 중에서 선택해야해. 
                  - default
                  - smile
                  - sad
                  - surprised
                  - funny
                  
                  animation은 반드시 아래의 값들 중에서 선택해야해.
                  - Talking In General Conversation
                  - Talking And Finding Something Funny
                  - Asking A Question
                  - Being Bashful
                  - Being Thankful
                  - Hip Hop Dancing
                  - Angry Gesture
                """,
            },
            {
                "role": "user",
                "content": question,
            },
        ],
    )

    content = json.loads(completion.choices[0].message.content)

    messages = content["messages"]

    return [MessagePublic(**l) for l in messages]
