import React, { useEffect, useState } from "react";
import Carousal_three from "../../assets/images/Carousal_three.jpeg";
import banner_2 from "../../assets/images/banner_2.jpeg";

const OrderCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: Carousal_three },
    { id: 2, image: banner_2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full flex justify-center bg-white">
      <div
        className="relative overflow-hidden w-full"
        style={{
          maxWidth: "100%",
          aspectRatio: "706 / 150",
          height: "auto"
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={slide.image} alt={`Slide ${slide.id}`} className="h-full w-full object-cover" />
          </div>
        ))}

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCarousel;
