import { bagRateMatrix } from "./sharedOrderData.js";

export const GST_RATE = 0.05;
export const GST_PERCENT_LABEL = "5%";
export const PRIVACY_PACKING_CHARGE = 100;

export function normalizePricingType(textColorType = "") {
  const normalizedValue = String(textColorType || "").trim().toLowerCase();

  if (normalizedValue === "two color") return "Two color";
  if (normalizedValue === "four color" || normalizedValue === "mix color" || normalizedValue === "multi color") return "Four color";
  return "Single color";
}

export function getBagRate({ bagSlug, bagSize, textColorType }) {
  const normalizedBagSlug = bagRateMatrix[bagSlug] ? bagSlug : "d-cut-bag";
  const normalizedPricingType = normalizePricingType(textColorType);

  return Number(bagRateMatrix[normalizedBagSlug]?.[normalizedPricingType]?.[bagSize] || 0);
}

export function calculateOrderPricing({ quantity, pricePerBag, privacy }) {
  const safeQuantity = Number(quantity || 0);
  const safePricePerBag = Number(pricePerBag || 0);
  const privacyCharge = privacy === "Required" ? PRIVACY_PACKING_CHARGE : 0;
  const bagCost = safeQuantity * safePricePerBag;
  const applicableCost = bagCost + privacyCharge;
  const gstAmount = applicableCost * GST_RATE;
  const payableAmount = applicableCost + gstAmount;

  return {
    bagCost,
    sellingPrice: applicableCost,
    applicableCost,
    gstAmount,
    payableBeforeDiscount: payableAmount,
    payableAmount,
    privacyCharge
  };
}
