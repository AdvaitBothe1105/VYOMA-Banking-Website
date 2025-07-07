import type { Metadata } from "next";
import { Raleway} from "next/font/google";
import "../globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";



const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons:{
    icon: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-raleway antialiased`}
      >
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
