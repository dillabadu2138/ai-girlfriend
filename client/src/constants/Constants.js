export const facialExpressions = {
  default: {},
  smile: {
    eyeSquintLeft: 0.45,
    eyeSquintRight: 0.45,
    noseSneerLeft: 0.15,
    noseSneerRight: 0.15,
    mouthSmileLeft: 0.5,
    mouthSmileRight: 0.5,
    jawOpen: 0.1,
  },
  happy: {
    mouthSmileLeft: 0.5,
    mouthSmileRight: 0.5,
    cheekPuff: 0.5,
    cheekSquintLeft: 0.5,
    cheekSquintRight: 0.5,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    eyeSquintLeft: 0.7,
    eyeSquintRight: 0.7,
    eyeLookDownLeft: 0.6,
    eyeLookDownRight: 0.6,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.15,
    mouthFunnel: 0.2,
    browInnerUp: 1,
  },
  angry: {
    noseSneerLeft: 1,
    noseSneerRight: 1,
    eyeSquintLeft: 0.33,
    eyeSquintRight: 0.33,
    browOuterUpLeft: 1,
    browOuterUpRight: 1,
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
  },
};

export const visemesLookUpTable = {
  // azure viseme : oculus lipsync viseme
  0: "viseme_sil", // Silence : neutral
  1: "viseme_aa", // æ, ə, ʌ : A
  2: "viseme_aa", // ɑ : A
  3: "viseme_O", // ɔ : oh
  4: "viseme_E", // ɛ, ʊ : e
  5: "viseme_aa", // ɝ : A
  6: "viseme_I", // j, i, ɪ : ih
  7: "viseme_U", // w, u : ou
  8: "viseme_O", // o : oh
  9: "viseme_aa", // aʊ : A
  10: "viseme_O", // ɔɪ : oh
  11: "viseme_aa", // aɪ : A
  12: "viseme_TH", // h : th
  13: "viseme_RR", // ɹ : r
  14: "viseme_nn", // l : n, l
  15: "viseme_SS", // s, z : s, z
  16: "viseme_CH", // ʃ, tʃ, dʒ, ʒ : tS, dZ, S
  17: "viseme_TH", // ð : th
  18: "viseme_FF", // f, v : f, v
  19: "viseme_DD", // d, t, n, θ : t, d
  20: "viseme_kk", // k, g, ŋ : k, g
  21: "viseme_PP", // p, b, m : p, b, m
};
