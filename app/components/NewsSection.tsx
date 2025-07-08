"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Article {
  title: string;
  url: string;
  summary: string;
  time_published: string;
  overall_sentiment_label: string;
  authors: string[];
  ticker_sentiment: {
    ticker: string;
    ticker_sentiment_label: string;
  }[];
}

function formatDate(time_published: string) {
  if (!time_published) return "";
  return new Date(
    time_published.slice(0, 4) +
      "-" +
      time_published.slice(4, 6) +
      "-" +
      time_published.slice(6, 8) +
      "T" +
      time_published.slice(9, 11) +
      ":" +
      time_published.slice(11, 13)
  ).toLocaleString();
}

function NewsCard({ article }: { article: Article }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl shadow p-6 hover:shadow-lg transition keen-slider__slide">
      <Link href={article.url} target="_blank" rel="noopener noreferrer">
        <h2 className="text-lg font-bold text-blue-800 hover:underline mb-1 line-clamp-2">
          {article.title}
        </h2>
      </Link>
      <p className="text-xs text-gray-500 mb-2">
        By {article.authors?.join(", ") || "Unknown"} • {formatDate(article.time_published)}
      </p>
      <p className="text-gray-700 text-sm mb-3 line-clamp-4">{article.summary}</p>
      <div className="flex items-center gap-2 text-xs flex-wrap mt-2">
        <span
          className={`px-2 py-1 rounded-full font-semibold ${
            article.overall_sentiment_label.includes("Bullish")
              ? "bg-green-100 text-green-800"
              : article.overall_sentiment_label.includes("Bearish")
              ? "bg-red-100 text-red-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {article.overall_sentiment_label}
        </span>
        {article.ticker_sentiment.map((ticker) => (
          <span
            key={ticker.ticker}
            className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold"
          >
            {ticker.ticker}: {ticker.ticker_sentiment_label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function NewsSection() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
    },
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then(setNews)
      .catch((err) => console.error("Failed to load news:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="font-raleway mx-auto px-10 py-20 bg-white">
      <h2 className="text-3xl text-center font-semibold mb-14 items-center gap-2">
         Market Sentiment News
      </h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="keen-slider" ref={sliderRef}>
            {news.slice(0, 9).map((article, i) => (
              <NewsCard article={article} key={i} />
            ))}
          </div>
          {/* Navigation Arrows below the carousel */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="bg-white border rounded-full shadow p-2 hover:bg-blue-100 transition"
              onClick={() => instanceRef.current?.prev()}
              aria-label="Previous"
              disabled={news.length <= 1}
            >
              &#8592;
            </button>
            <button
              className="bg-white border rounded-full shadow p-2 hover:bg-blue-100 transition"
              onClick={() => instanceRef.current?.next()}
              aria-label="Next"
              disabled={news.length <= 1}
            >
              &#8594;
            </button>
          </div>
        </>
      )}
    </section>
  );
}