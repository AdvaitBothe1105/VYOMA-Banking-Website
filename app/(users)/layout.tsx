import type { Metadata } from "next";
import { Raleway, Poppins, Libre_Baskerville, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";



const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`font-raleway antialiased ${poppins.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable}`}
      >
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
