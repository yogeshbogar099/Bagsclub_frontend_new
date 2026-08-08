import { useEffect, useState } from "react";
import bg02 from "../../../assets/images/bg_02.jpg";
import carousalOne from "../../../assets/images/Carousal_one.jpeg";

export default function Hero() {
  const slides = [
    {
      image: bg02,
      title: "Premium Bag Printing Solutions",
      subtitle: "Professional Printing Service",
      description: "High-quality printing with professional finishing and reliable delivery."
    },
    {
      image: carousalOne,
      title: "Trusted by Businesses",
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
    <section className="relative h-[100svh] w-full overflow-hidden text-white">
      {slides.map((slide, index) => (
        <img
          key={slide.title}
          src={slide.image}
          alt=""
          loading="eager"
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0"
          ].join(" ")}
        />
      ))}
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-start justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl pt-24 sm:pt-28 md:pt-32 lg:pt-36">
          <p className="text-sm font-semibold text-white/85 sm:text-base md:text-lg">Welcome to</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:mt-3 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-2 text-base font-semibold uppercase text-white/90 sm:mt-3 sm:text-xl md:text-2xl">
            {slides[activeIndex].subtitle}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-white/80 sm:mt-6 sm:text-sm md:text-base md:leading-7 lg:text-lg">
            {slides[activeIndex].description}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2 sm:bottom-8">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`touch-target h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
