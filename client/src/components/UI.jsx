import { useState } from "react";
import { useAIStore } from "../stores/useAI";

export const UI = () => {
  const askAI = useAIStore((state) => state.askAI);
  const loading = useAIStore((state) => state.loading);
  const [question, setQuestion] = useState("");

  const ask = () => {
    askAI(question);
    setQuestion("");
  };

  return (
    <>
      <div className="fixed inset-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-md">
          <h1 className="font-black text-xl">나의 가상 AI 여친</h1>
          <p>무엇이든지 물어봐!</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
            <input
              className="w-full p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
              placeholder="메세지를 입력하세요..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  ask();
                }
              }}
            />
            <button
              onClick={ask}
              className={`bg-sky-500 hover:bg-sky-600 text-white text-nowrap p-4 font-semibold rounded-md`}
            >
              보내기
            </button>
          </div>
        )}
      </div>
    </>
  );
};
