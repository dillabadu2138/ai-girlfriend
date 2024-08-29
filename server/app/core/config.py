from starlette.config import Config

config = Config(".env")
OPENAI_API_KEY = config("OPENAI_API_KEY")
SPEECH_KEY = config("SPEECH_KEY")
SPEECH_REGION = config("SPEECH_REGION")

PROJECT_NAME = "AI 가상여친"
VERSION = "1.0.0"
API_PREFIX = "/api"
