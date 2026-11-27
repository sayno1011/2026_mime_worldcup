"use client";

import { useRef, useState } from "react";

const actions = {
  vote: {
    title: "올해의 밈 투표",
    description: "가장 인상 깊었거나 자주 썼던 밈에 한 표를 던져요.",
    icon: "M7 13 4 16v4h16v-4l-3-3M4 16h16M8 10l4-6 6 4-4 6z",
  },
  quiz: {
    title: "내가 아는 밈 테스트",
    description: "밈을 하나씩 보고 ‘안다’ 또는 ‘모른다’를 골라요.",
    icon: "M9 5H5v15h14V5h-4M9 3h6v4H9zM8.5 13l2.5 2.5 4.5-5",
  },
};

export function HomeActions() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<keyof typeof actions>("vote");

  function openDialog(nextMode: keyof typeof actions) {
    setMode(nextMode);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <div className="actions">
        {(["vote", "quiz"] as const).map((key) => (
          <button
            className={key === "quiz" ? "action secondary" : "action"}
            key={key}
            type="button"
            aria-haspopup="dialog"
            onClick={() => openDialog(key)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={actions[key].icon} />
            </svg>
            {actions[key].title}
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>

      <dialog ref={dialogRef} aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <h2 id="dialog-title">{actions[mode].title}</h2>
        <p id="dialog-description">{actions[mode].description}</p>
        <form method="dialog">
          <button type="submit">홈으로</button>
        </form>
      </dialog>
    </>
  );
}
