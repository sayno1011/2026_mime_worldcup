"use client";

import Image from "next/image";
import Script from "next/script";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { memes } from "./memes";
import { type YouTubeApiStatus, YouTubeCard } from "./youtube-card";

const hasVideos = memes.some(({ kind }) => kind === "youtube");
const soundStorageKey = "meme-gallery-sound";

export function MemeGallery() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [active, setActive] = useState(0);
  const [apiStatus, setApiStatus] = useState<YouTubeApiStatus>("loading");

  useEffect(() => {
    try {
      setSoundEnabled(window.sessionStorage.getItem(soundStorageKey) === "enabled");
    } catch {
      // The setting still works while the page is open if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (!hasVideos || apiStatus !== "loading") return;
    const timeout = window.setTimeout(() => setApiStatus("unavailable"), 15_000);
    return () => window.clearTimeout(timeout);
  }, [apiStatus]);

  function initializeYouTube() {
    if (window.YT?.Player) {
      setApiStatus("ready");
    } else {
      window.onYouTubeIframeAPIReady = () => setApiStatus("ready");
    }
  }

  function updateSoundPreference(enabled: boolean) {
    setSoundEnabled(enabled);
    try {
      window.sessionStorage.setItem(soundStorageKey, enabled ? "enabled" : "muted");
    } catch {
      // Keep using the in-memory setting.
    }
  }

  function showCard(index: number) {
    const track = trackRef.current;
    const card = track?.children[index];
    if (!track || !card) return;

    const offset = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + offset - track.clientLeft });
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
      {hasVideos && (
        <Script
          src="https://www.youtube.com/iframe_api"
          onReady={initializeYouTube}
          onError={() => setApiStatus("unavailable")}
        />
      )}
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
        <span>화살표로 밈 넘기기</span>
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
          {memes.map((meme, index) => (
            <li className="meme" key={meme.id} inert={active !== index}>
              {meme.kind === "image" ? (
                <>
                  <div className="meme-media" data-background={meme.background}>
                    <Image
                      src={meme.src}
                      alt={meme.alt}
                      fill
                      unoptimized
                      draggable={false}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="card-copy">
                    <strong>{meme.title}</strong>
                  </div>
                </>
              ) : Math.abs(index - active) <= 1 ? (
                <YouTubeCard
                  title={meme.title}
                  videoId={meme.id}
                  active={active === index}
                  apiStatus={apiStatus}
                  soundEnabled={soundEnabled}
                  onSoundChange={updateSoundPreference}
                />
              ) : (
                <>
                  <div className="meme-media" />
                  <div className="card-copy">
                    <strong>{meme.title}</strong>
                  </div>
                </>
              )}
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
    </section>
  );
}
