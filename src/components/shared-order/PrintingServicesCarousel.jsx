import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COMING_SOON_TITLES = new Set(["PLASTIC BAG", "PAPER BAG", "HDPE BAG", "CANVAS BAG"]);
const CARD_GAP = "clamp(100px, 10vw, 120px)";

export default function PrintingServicesCarousel({ cards = [], onSelectCard, initialSelectedId, activeIndex: controlledActiveIndex, onActiveIndexChange }) {
  const safeInitialIndex = useMemo(() => {
    if (!cards.length) return 0;
    const selectedIndex = cards.findIndex((card) => card.id === initialSelectedId);
    return selectedIndex >= 0 ? selectedIndex : 0;
  }, [cards, initialSelectedId]);

  const [internalActiveIndex, setInternalActiveIndex] = useState(safeInitialIndex);
  const [failedImages, setFailedImages] = useState({});
  const [motion, setMotion] = useState("idle");
  const animationTimeoutRef = useRef(null);
  const ANIMATION_DURATION_MS = 520;
  const activeIndex = typeof controlledActiveIndex === "number" ? controlledActiveIndex : internalActiveIndex;

  useEffect(() => {
    if (typeof controlledActiveIndex !== "number") {
      setInternalActiveIndex(safeInitialIndex);
    }
  }, [safeInitialIndex]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const getWrappedIndex = useMemo(
    () => (index) => {
      if (!cards.length) return 0;
      return (index + cards.length) % cards.length;
    },
    [cards]
  );

  const visibleCards = useMemo(() => {
    if (!cards.length) return [];

    return [
      { slot: "hiddenLeft", card: cards[getWrappedIndex(activeIndex - 2)], index: getWrappedIndex(activeIndex - 2) },
      { slot: "left", card: cards[getWrappedIndex(activeIndex - 1)], index: getWrappedIndex(activeIndex - 1) },
      { slot: "center", card: cards[activeIndex], index: activeIndex },
      { slot: "right", card: cards[getWrappedIndex(activeIndex + 1)], index: getWrappedIndex(activeIndex + 1) },
      { slot: "hiddenRight", card: cards[getWrappedIndex(activeIndex + 2)], index: getWrappedIndex(activeIndex + 2) }
    ];
  }, [activeIndex, cards, getWrappedIndex]);

  function getSlotVisual(slot, currentMotion) {
    const idleState = {
      hiddenLeft: { offset: `calc(-144% - clamp(0px, 12vw, 192px) - ${CARD_GAP})`, scale: 0.82, opacity: 0, zIndex: 0 },
      left: { offset: `calc(-72% - clamp(0px, 6vw, 96px) - (${CARD_GAP} / 2))`, scale: 0.86, opacity: 0.62, zIndex: 10 },
      center: { offset: "0%", scale: 1, opacity: 1, zIndex: 30 },
      right: { offset: `calc(72% + clamp(0px, 6vw, 96px) + (${CARD_GAP} / 2))`, scale: 0.86, opacity: 0.62, zIndex: 10 },
      hiddenRight: { offset: `calc(144% + clamp(0px, 12vw, 192px) + ${CARD_GAP})`, scale: 0.82, opacity: 0, zIndex: 0 }
    };

    if (currentMotion === "next") {
      return {
        hiddenLeft: idleState.hiddenLeft,
        left: idleState.hiddenLeft,
        center: idleState.left,
        right: idleState.center,
        hiddenRight: idleState.right
      }[slot];
    }

    if (currentMotion === "prev") {
      return {
        hiddenLeft: idleState.left,
        left: idleState.center,
        center: idleState.right,
        right: idleState.hiddenRight,
        hiddenRight: idleState.hiddenRight
      }[slot];
    }

    return idleState[slot];
  }

  function handleCardClick(card, index) {
    if (!cards.length || motion !== "idle") return;

    const previousIndex = getWrappedIndex(activeIndex - 1);
    const nextIndex = getWrappedIndex(activeIndex + 1);

    if (index === previousIndex) {
      moveSelection("prev");
      return;
    }

    if (index === nextIndex) {
      moveSelection("next");
      return;
    }

    if (index === activeIndex) {
      onSelectCard?.(card, index);
    }
  }

  function commitActiveIndex(nextIndex) {
    if (typeof controlledActiveIndex !== "number") {
      setInternalActiveIndex(nextIndex);
    }

    onActiveIndexChange?.(nextIndex, cards[nextIndex]);
  }

  function moveSelection(direction) {
    if (!cards.length || cards.length < 2 || motion !== "idle") return;

    setMotion(direction);

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      const nextIndex = getWrappedIndex(activeIndex + (direction === "next" ? 1 : -1));
      commitActiveIndex(nextIndex);
      setMotion("idle");
    }, ANIMATION_DURATION_MS);
  }

  if (!cards.length) return null;

  return (
    <div className="mx-auto w-full">
      <div className="relative overflow-hidden">
        <div className="relative h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px]">
          {visibleCards.map(({ slot, card, index }) => {
            const isActive = slot === "center";
            const visual = getSlotVisual(slot, motion);

            return (
              <button
                key={`${card.id}-${slot}-${index}`}
                type="button"
                onClick={() => handleCardClick(card, index)}
                className={`group absolute left-1/2 top-1/2 w-fit max-w-[82vw] overflow-hidden rounded-[28px] border transition-[transform,opacity,box-shadow,border-color] duration-[520ms] ease-in-out sm:max-w-[76vw] md:max-w-[70vw] lg:max-w-[64vw] xl:max-w-[58vw] ${isActive
                    ? "border-[#c8d4e4] bg-[#edf1f6] shadow-[0_24px_48px_rgba(148,163,184,0.32)] ring-2 ring-[#2d58a5]/18"
                    : "border-white/70 bg-[#f4f6fa] shadow-[0_14px_30px_rgba(148,163,184,0.18)]"
                  } ${slot === "hiddenLeft" || slot === "hiddenRight" ? "pointer-events-none" : ""}`}
                style={{
                  transform: `translate(calc(-50% + ${visual.offset}), -50%) scale(${visual.scale})`,
                  opacity: visual.opacity,
                  zIndex: visual.zIndex
                }}
                aria-hidden={slot === "hiddenLeft" || slot === "hiddenRight"}
              >
                <div className="relative flex items-center justify-center overflow-hidden bg-white">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f8f9fc] via-white to-[#eef3f8]" aria-hidden="true" />
                  {COMING_SOON_TITLES.has(card.title) ? (
                    <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-[#c62828] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_rgba(198,40,40,0.28)] sm:right-4 sm:top-4 sm:px-3.5 sm:py-1.5 sm:text-xs">
                      Coming Soon
                    </div>
                  ) : null}
                  <div className="relative z-10 flex items-center justify-center">
                    {failedImages[card.id] ? (
                      <div className="flex min-h-[180px] w-[70vw] max-w-[720px] items-center justify-center bg-[#eef2f7] px-6 text-center sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
                        <span className="text-sm font-bold uppercase tracking-[0.12em] text-[#5f6673] sm:text-base">
                          {card.title}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={card.image}
                        alt={card.title}
                        onError={() => {
                          setFailedImages((current) => {
                            if (current[card.id]) return current;
                            return { ...current, [card.id]: true };
                          });
                        }}
                        className={`block h-auto max-h-[220px] w-auto max-w-[82vw] object-contain object-center transition-transform duration-[520ms] ease-in-out sm:max-h-[260px] sm:max-w-[76vw] md:max-h-[300px] md:max-w-[70vw] lg:max-h-[340px] lg:max-w-[64vw] xl:max-w-[58vw] ${isActive ? "scale-100" : "scale-[0.96]"
                          }`}
                      />
                    )}
                  </div>
                  {card.title === "NON-WOVEN BAG" ? (
                    <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 sm:bottom-4 md:bottom-5 lg:bottom-6">
                      <span className="animate-add-order-cta inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.95),0_8px_24px_rgba(220,38,38,0.65)] sm:px-5 sm:py-2 sm:text-xs md:px-6 md:py-2.5 md:text-sm lg:px-7 lg:py-3 lg:text-base whitespace-nowrap">
                        ADD ORDER NOW
                      </span>
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => moveSelection("prev")}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d2dae5] bg-white text-[#305CA7] shadow-sm transition hover:-translate-y-0.5 hover:border-[#305CA7] hover:bg-[#f8fbff]"
          aria-label="Previous product"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => moveSelection("next")}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d2dae5] bg-white text-[#305CA7] shadow-sm transition hover:-translate-y-0.5 hover:border-[#305CA7] hover:bg-[#f8fbff]"
          aria-label="Next product"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
