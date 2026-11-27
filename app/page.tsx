import { MemeGallery } from "./meme-gallery";
import { HomeActions } from "./home-actions";

export default function Home() {
  return (
    <main className="home">
      <header className="header">
        <span className="mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 0c1.6 8.4 3.6 10.4 12 12-8.4 1.6-10.4 3.6-12 12C10.4 15.6 8.4 13.6 0 12 8.4 10.4 10.4 8.4 12 0Z"
            />
          </svg>
        </span>
        2026 밈 월드컵
      </header>

      <section className="hero" aria-labelledby="title">
        <div>
          <h1 id="title">
            <span className="year">2026</span>{" "}밈 월드컵
          </h1>
        </div>
        <div className="art" aria-hidden="true">
          <b>ㅋㅋ</b>
          <svg viewBox="0 0 40 40">
            <path
              fill="currentColor"
              stroke="var(--line)"
              strokeWidth="1.6"
              d="M20 1c2.5 12 7 16.5 19 19-12 2.5-16.5 7-19 19C17.5 27 13 22.5 1 20 13 17.5 17.5 13 20 1Z"
            />
          </svg>
        </div>
      </section>

      <MemeGallery />
      <HomeActions />
    </main>
  );
}
