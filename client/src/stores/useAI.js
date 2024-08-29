import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useAIStore = create(
  devtools((set, get) => ({
    messages: [],
    currentMessage: null,
    loading: false,
    askAI: async (question) => {
      if (!question) return;

      set(
        () => ({
          loading: true,
        }),
        false,
        "ai/SET_LOADING_TRUE"
      );

      // get chat message and set current message
      const message = {
        question,
        id: get().messages.length,
      };
      const res = await fetch(`/api/chats/?question=${question}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      message.answers = data;

      set(
        () => ({
          currentMessage: message,
        }),
        false,
        "ai/SET_CURRENT_MESSGAGE"
      );

      set(
        (state) => ({
          messages: [...state.messages, message],
        }),
        false,
        "ai/UPDATE_MESSAGES"
      );

      // convert text to speech and recursively play audios in a sequence
      get().convertTextToSpeech(message.answers);
    },
    convertTextToSpeech: (answers) => {
      // get tts
      const fetchAudio = async (answer) => {
        const audioRes = await fetch(`/api/tts/?text=${answer.text}`);
        const audioBlob = await audioRes.blob();
        const visemes = JSON.parse(await audioRes.headers.get("visemes"));
        const audio = new Audio(URL.createObjectURL(audioBlob));

        answer.audio = audio;
        answer.visemes = visemes;

        return answer;
      };

      const promise = Promise.all(answers.map((answer) => fetchAudio(answer)));
      promise.then((answers) => {
        set(
          () => ({
            loading: false,
          }),
          false,
          "ai/SET_LOADING_FALSE"
        );

        set(
          (state) => ({
            currentMessage: {
              ...state.currentMessage,
              answers: [...answers],
            },
          }),
          false,
          "ai/UPDATE_CURRENT_MESSAGE_WITH_AUDIOS"
        );

        // recursively play audios
        let index = 0;
        playAudio(answers[index].audio);

        function playAudio(audio) {
          // add onended eventListner
          audio.onended = () => {
            set(
              (state) => ({
                currentMessage: {
                  ...state.currentMessage,
                  answers: state.currentMessage.answers.slice(1),
                },
              }),
              false,
              "ai/DELETE_ANSWER"
            );

            // play next audio
            index++;
            if (index < answers.length) playAudio(answers[index].audio);
            else {
              set(
                () => ({ currentMessage: null }),
                false,
                "ai/CLEAR_CURRENT_MESSAGE"
              );
            }
          };

          audio.play();
        }
      });
    },
  }))
);
