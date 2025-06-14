// import { Carousel } from "@/components/ui/carousel";
import Image from "next/image";
import { HomeCarousel } from "../components/Carousel";
import { CtaSec } from "../components/CtaSec";
import Features from "../components/Features";

export default function Home() {
  return (
    <div className="bg-white">
      <HomeCarousel image_src='/Ad-1.png'/>
      <CtaSec/>
      <Features/>
    </div>
  );
}
