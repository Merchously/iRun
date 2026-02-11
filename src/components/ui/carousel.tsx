"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useRef } from "react";

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  showArrows?: boolean;
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, showArrows = true, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    function scroll(direction: "left" | "right") {
      const container = scrollRef.current;
      if (!container) return;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }

    return (
      <div ref={ref} className={cn("group relative", className)} {...props}>
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto scroll-snap-x-mandatory md:gap-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {children}
        </div>
        {showArrows && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur-sm transition-opacity hover:bg-background group-hover:md:flex"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur-sm transition-opacity hover:bg-background group-hover:md:flex"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-72 flex-none md:w-80", className)}
      style={{ scrollSnapAlign: "start" }}
      {...props}
    />
  )
);
CarouselItem.displayName = "CarouselItem";

export { Carousel, CarouselItem };
