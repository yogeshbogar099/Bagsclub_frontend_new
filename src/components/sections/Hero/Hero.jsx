import { useEffect, useState } from "react";
import bg02 from "../../../assets/images/bg_02.jpg";
import carousalOne from "../../../assets/images/Carousal_one.jpeg";

export default function Hero() {
  const slides = [
    {
      image: bg02,
      title: "Premium Bag Printing Solutions",
      subtitle: "No.1 Bag Printing Service",
      description: "High-quality printing with professional finishing and reliable delivery."
    },
    {
      image: carousalOne,
      title: "BAGSCLUB",
      subtitle: "Trusted by Businesses",
      description: "Create premium branded bags that make your business stand out."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] w-[100vw] overflow-hidden text-white">
      {slides.map((slide, index) => (
        <img
          key={slide.title}
          src={slide.image}
          alt=""
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0"
          ].join(" ")}
        />
      ))}
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative z-10 flex h-full w-full items-start justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl pt-24 sm:pt-28 md:pt-32">
          <p className="text-base font-semibold text-white/85 sm:text-lg">Welcome to</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-3 text-lg font-semibold uppercase text-white/90 sm:text-2xl">
            {slides[activeIndex].subtitle}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">
            {slides[activeIndex].description}
          </p>
        </div>
      </div>
    </section>
  );
}
