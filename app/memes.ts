type Meme = { id: string; title: string } & (
  | { kind: "image"; src: string; alt: string; background?: "light" }
  | { kind: "youtube" }
);

export const memes: Meme[] = [
  // 1월
  { id: "ZSCwu-raidg", kind: "youtube", title: "윤정아 윤정아 / 왜요쌤 왜요쌤" },
  { id: "G3upo-Eghtw", kind: "youtube", title: "밤티" },
  { id: "SLQa4j8G8cM", kind: "youtube", title: "샤갈/쌰갈" },

  // 2월
  {
    id: "bomdong-bibimbap",
    kind: "image",
    title: "강호동 봄동비빔밥",
    src: "/memes/bomdong-bibimbap.png",
    alt: "두쫀쿠 말고 봄동겉절이 먹자라는 문구와 1박 2일에서 봄동을 무치는 장면",
  },
  { id: "rKdsj4PAd-A", kind: "youtube", title: "간바레 챌린지" },

  // 3월
  { id: "ttc3K3AqD9A", kind: "youtube", title: "상하이 버터떡" },
  { id: "5xdlH-J2Pi8", kind: "youtube", title: "창억떡 호박인절미 / 떡픈런" },

  // 4월
  { id: "1PjvCI5Z5zg", kind: "youtube", title: "셋로그" },

  // 5월
  { id: "bmXVsFfHNHk", kind: "youtube", title: "거제 야호! / ○○ 야호!" },
  { id: "5SDI1ZSxlQ8", kind: "youtube", title: "영크크 vs 늙크크 / 올크크" },
  { id: "n-4_k88b0gw", kind: "youtube", title: "모시모시, 키코에테루?" },
  { id: "j9QcCkZ8dlg", kind: "youtube", title: "우베 / 보라색 디저트" },

  // 6월
  { id: "M7Wm8hJnHnQ", kind: "youtube", title: "모르겠고, 난 파라파라나 춰야겠다" },
  { id: "aVH5DMIiqps", kind: "youtube", title: "야르송 / 야르한 아침이다" },

  // 7월
  { id: "bAC1ppSrP0M", kind: "youtube", title: "왁뿌볼 / 왁뿌" },

  // 8월
  { id: "R6L93MQz66E", kind: "youtube", title: "피자설기" },

  // 9월
  { id: "y0YV9j6GQpc", kind: "youtube", title: "한정선 과일찹쌀떡" },

  // 10월
  {
    id: "hidden-wealth",
    kind: "image",
    title: "부라는 게 숨긴다고 숨겨지는 것도 아니고",
    src: "/memes/hidden-wealth.png",
    alt: "노릇하게 구운 햄 사진 두 장과 평범한 벌이로는 저런 생활이 불가능하다는 댓글",
    background: "light",
  },
  { id: "f87EqA1LfMU", kind: "youtube", title: "미혼앤비혼 / 이혼앤비혼" },
  { id: "XgkZijYOXMA", kind: "youtube", title: "존박 맥도날드 주문 랩 / 존박 세트" },
  { id: "6uHLAj1c0D0", kind: "youtube", title: "이거 제 이모지야" },
  { id: "VV9riLFQPmE", kind: "youtube", title: "우사기 랩" },

  // 11월
  { id: "ZTABKsZoBkM", kind: "youtube", title: "라우럴" },
  { id: "NmIY5K_mvtY", kind: "youtube", title: "남대문 스카프 아저씨 / 돈 쓰지 마" },
];
