"use client";

import Image from "next/image";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

type Meme = {
  title: string;
  description: string;
  media:
    | { kind: "image"; src: string; alt: string }
    | { kind: "video"; src: string; poster?: string; captions?: string };
};

const memes: Meme[] = [
  {
    title: "지금 그걸 말이라고",
    description: "표정으로 이미 다 말했을 때",
    media: {
      kind: "image",
      src: "/memes/cat.jpg",
      alt: "책상에서 옆눈으로 흘겨보는 고양이",
    },
  },
  {
    title: "일단 나부터 신남",
    description: "아직 시작도 안 했는데",
    media: {
      kind: "image",
      src: "/memes/dog.jpg",
      alt: "노란 선글라스를 낀 흰 강아지",
    },
  },
  {
    title: "나만 상황 파악 중",
    description: "다들 이해한 것 같아서 조용히 있을 때",
    media: {
      kind: "image",
      src: "/memes/duck.jpg",
      alt: "작은 모자를 쓰고 고개를 갸웃하는 오리",
    },
  },
  {
    title: "아니 그게 된다고?",
    description: "생각보다 일이 잘 풀렸을 때",
    media: {
      kind: "image",
      src: "/memes/red-panda.jpg",
      alt: "놀란 표정으로 두 앞발을 든 레서판다",
    },
  },
];

export function MemeGallery() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    Array.from(track.children).forEach((card, index) => {
      if (index !== active) card.querySelector("video")?.pause();
    });
  }, [active]);

  function showCard(index: number) {
    const track = trackRef.current;
    const card = track?.children[index];
    if (!track || !card) return;

    const offset = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + offset });
  }

  function syncActive() {
    const track = trackRef.current;
    if (!track) return;

    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.max(0, Math.min(index, memes.length - 1)));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    showCard(active + (event.key === "ArrowRight" ? 1 : -1));
  }

  return (
    <section className="gallery" aria-labelledby="shelf-label">
      <div className="shelf-top">
        <h2 id="shelf-label">올해의 밈 모아보기</h2>
        <p className="gallery-position" aria-live="polite" aria-atomic="true">
          <span className="visually-hidden">{memes[active].title} </span>
          <b>{active + 1}</b> / {memes.length}
        </p>
      </div>

      <p className="gallery-guide" id="gallery-guide">
        <svg viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 8h20M6 4 2 8l4 4m12-8 4 4-4 4" />
        </svg>
        <span className="guide-swipe">옆으로 밀어서 밈 넘기기</span>
        <span className="guide-arrows">화살표로 밈 넘기기</span>
      </p>

      <div className="gallery-stage">
        <button
          className="gallery-arrow"
          type="button"
          aria-label="이전 밈"
          aria-controls="meme-cards"
          aria-disabled={active === 0}
          onClick={() => showCard(active - 1)}
        >
          ←
        </button>

        <ul
          id="meme-cards"
          className="cards"
          aria-labelledby="shelf-label"
          aria-describedby="gallery-guide"
          tabIndex={0}
          ref={trackRef}
          onScroll={syncActive}
          onKeyDown={handleKeyDown}
        >
          {memes.map(({ title, description, media }, index) => (
            <li className="meme" key={media.src} inert={active !== index}>
              <div className="meme-media">
                {media.kind === "image" ? (
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    sizes="310px"
                    unoptimized
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <video
                    src={media.src}
                    poster={media.poster}
                    controls
                    playsInline
                    preload="none"
                    aria-label={title}
                  >
                    {media.captions && (
                      <track kind="captions" src={media.captions} srcLang="ko" label="한국어" />
                    )}
                  </video>
                )}
              </div>
              <div className="card-copy">
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="gallery-arrow"
          type="button"
          aria-label="다음 밈"
          aria-controls="meme-cards"
          aria-disabled={active === memes.length - 1}
          onClick={() => showCard(active + 1)}
        >
          →
        </button>
      </div>

      <div className="dots" role="group" aria-label="보고 싶은 밈 선택">
        {memes.map(({ media }, index) => (
          <button
            className="dot"
            key={media.src}
            type="button"
            aria-label={`${index + 1}번째 밈`}
            aria-current={active === index}
            aria-controls="meme-cards"
            onClick={() => showCard(index)}
          />
        ))}
      </div>
    </section>
  );
}
