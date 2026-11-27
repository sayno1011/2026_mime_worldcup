import { useEffect, useEffectEvent, useRef, useState } from "react";

type YouTubePlayer = {
  loadVideoById: (videoId: string, startSeconds: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
};

type PlayerEvent = { target: YouTubePlayer };

declare global {
  interface Window {
    YT?: {
      Player: new (
        iframe: HTMLIFrameElement,
        options: {
          events: {
            onReady: (event: PlayerEvent) => void;
            onAutoplayBlocked: (event: PlayerEvent) => void;
            onStateChange: (event: PlayerEvent & { data: number }) => void;
            onError: () => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type YouTubeApiStatus = "loading" | "ready" | "unavailable";

type YouTubeCardProps = {
  title: string;
  videoId: string;
  active: boolean;
  apiStatus: YouTubeApiStatus;
  soundEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
};

export function YouTubeCard({ title, videoId, active, apiStatus, soundEnabled, onSoundChange }: YouTubeCardProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const playbackAttempt = useRef<"audible" | "muted" | null>(null);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [failed, setFailed] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);
  const unavailable = failed || apiStatus === "unavailable";

  const startPlayback = useEffectEvent((readyPlayer: YouTubePlayer) => {
    playbackAttempt.current = soundEnabled ? "audible" : "muted";
    if (soundEnabled) readyPlayer.unMute();
    else readyPlayer.mute();
    setSoundBlocked(false);
    setNeedsPlay(false);
    readyPlayer.loadVideoById(videoId, 0);
  });

  useEffect(() => {
    const api = window.YT;
    const host = playerHostRef.current;
    if (apiStatus !== "ready" || !api || !host) return;

    const params = new URLSearchParams({
      enablejsapi: "1",
      origin: window.location.origin,
      playsinline: "1",
      rel: "0",
    });
    const iframe = document.createElement("iframe");
    iframe.title = title;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.src = `https://www.youtube.com/embed/${videoId}?${params}`;
    host.append(iframe);

    let disposed = false;
    const timeout = window.setTimeout(() => setFailed(true), 15_000);
    const instance = new api.Player(iframe, {
      events: {
        onReady({ target }) {
          if (disposed) return;
          window.clearTimeout(timeout);
          target.mute();
          setFailed(false);
          setPlayer(target);
        },
        onAutoplayBlocked({ target }) {
          if (disposed || !activeRef.current || !playbackAttempt.current) return;
          if (playbackAttempt.current === "audible") {
            playbackAttempt.current = "muted";
            target.mute();
            setSoundBlocked(true);
            target.playVideo();
          } else {
            playbackAttempt.current = null;
            setNeedsPlay(true);
          }
        },
        onStateChange({ target, data }) {
          if (disposed || data !== api.PlayerState.PLAYING) return;
          if (!activeRef.current) {
            target.pauseVideo();
            return;
          }
          playbackAttempt.current = null;
          setNeedsPlay(false);
        },
        onError() {
          if (disposed) return;
          window.clearTimeout(timeout);
          playbackAttempt.current = null;
          setFailed(true);
        },
      },
    });

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      instance.destroy();
      iframe.remove();
    };
  }, [apiStatus, title, videoId]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!active || !player || !media || unavailable) return;

    activeRef.current = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!activeRef.current || entry.intersectionRatio < 0.51) return;

      observer.disconnect();
      startPlayback(player);
    }, { threshold: 0.51 });
    observer.observe(media);

    return () => {
      observer.disconnect();
      activeRef.current = false;
      playbackAttempt.current = null;
      if (media.isConnected) player.pauseVideo();
    };
  }, [active, player, unavailable, videoId]);

  function toggleSound() {
    if (!player) return;

    const enabled = !soundEnabled;
    onSoundChange(enabled);
    setSoundBlocked(false);
    if (enabled) {
      playbackAttempt.current = "audible";
      player.unMute();
      if (needsPlay) {
        setNeedsPlay(false);
        player.playVideo();
      }
    } else {
      if (playbackAttempt.current) playbackAttempt.current = "muted";
      player.mute();
    }
  }

  function play() {
    if (!player) return;
    playbackAttempt.current = soundEnabled ? "audible" : "muted";
    if (soundEnabled) player.unMute();
    else player.mute();
    setSoundBlocked(false);
    setNeedsPlay(false);
    player.playVideo();
  }

  return (
    <>
      <div className="meme-media" ref={mediaRef}>
        <div className="youtube-player" ref={playerHostRef} />
      </div>
      <div className="card-copy">
        <strong>{title}</strong>
        {unavailable ? (
          <p className="video-status">
            카드에서 재생할 수 없어요.{" "}
            <a href={`https://www.youtube.com/shorts/${videoId}`} target="_blank" rel="noreferrer">
              YouTube에서 보기
            </a>
          </p>
        ) : (
          <div className="video-actions">
            <button type="button" onClick={toggleSound} disabled={!player}>
              {soundEnabled ? "소리 끄기" : "소리 켜기"}
            </button>
            {(needsPlay || (soundEnabled && soundBlocked)) && (
              <button type="button" onClick={play}>
                {soundEnabled ? "소리 내서 재생" : "재생"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
