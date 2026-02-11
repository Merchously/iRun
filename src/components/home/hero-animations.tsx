"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const ctx = gsap.context(() => {
      // Hero image parallax — slow scroll on the background
      gsap.to("[data-hero-image]", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Hero overlay darkens as you scroll
      gsap.to("[data-hero-overlay]", {
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Hero text entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-heading] > *", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
      })
        .from(
          "[data-hero-sub]",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          "[data-hero-cta] > *",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.4"
        );

      // Scroll-triggered fade-in for sections below the fold
      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Stagger pillar cards on scroll
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      if (cards.length) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
