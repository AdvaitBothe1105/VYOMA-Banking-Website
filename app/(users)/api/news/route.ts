import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.ALPHA_VANTAGE_KEY;
  const SYMBOL = "AAPL"; // or dynamic
  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${SYMBOL}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch news");

    const data = await res.json();
    return NextResponse.json(data.feed || []); // return only the article list
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ error: "News fetch failed" }, { status: 500 });
  }
}
