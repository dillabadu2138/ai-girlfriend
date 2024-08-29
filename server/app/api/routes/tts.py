from typing import List
from fastapi import APIRouter, Response
import azure.cognitiveservices.speech as speechsdk
import json

from app.core import config


router = APIRouter()


@router.get("/")
async def get_tts(text: str):
    # Define configurations for speech synthesis
    speech_config = speechsdk.SpeechConfig(
        subscription=config.SPEECH_KEY,
        region=config.SPEECH_REGION,
    )

    # Specify the voice of speech_config to match your input text
    # speech_config.speech_synthesis_voice_name = "ko-KR-SunHiNeural"
    # speech_config.speech_synthesis_voice_name = "ko-KR-JiMinNeural"
    # speech_config.speech_synthesis_voice_name = "ko-KR-SeoHyeonNeural"
    speech_config.speech_synthesis_voice_name = "ko-KR-SoonBokNeural"
    # speech_config.speech_synthesis_voice_name = "ko-KR-YuJinNeural"

    # Create a SpeechSynthesizer object.
    speech_synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=None,
    )

    visemes = []

    def viseme_cb(evt):
        # print(
        #     "Viseme event received: audio offset: {}ms, viseme id: {}.".format(
        #         evt.audio_offset / 10000, evt.viseme_id
        #     )
        # )

        visemes.append([evt.audio_offset / 10000, evt.viseme_id])

    # Subscribes to viseme received event
    speech_synthesizer.viseme_received.connect(viseme_cb)

    # Synthesize speech
    speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()

    return Response(
        content=speech_synthesis_result.audio_data,
        headers={
            "Content-Type": "audio/mpeg",
            "Content-Disposition": 'inline; filename="tts.mp3"',
            # send additional data in headers
            "Visemes": json.dumps(visemes),
        },
        media_type="audio/mpeg",
    )
