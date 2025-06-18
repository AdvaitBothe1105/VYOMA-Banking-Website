import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel"
import Image from "next/image"

interface Props {
  image_src: string;
}

export const HomeCarousel = ({image_src}: Props) => {
  console.log(image_src);
  
  return (
    <Carousel className="md:w-[90%] md:ml-20 md:mt-10 md:mb-10 ">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
              <Image src={image_src} width={1920} height={1080} alt="" 	style={{objectFit: "contain"}} className="rounded-3xl" quality={100}/>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
