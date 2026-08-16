import boxBagImage from "../../assets/images/Box-Bag-Card.jpeg";
import canvasBag from "../../assets/images/Canvas_Bag.png";
import dCutImage from "../../assets/images/D-Cut-bag-card.jpg";
import hdpeBag from "../../assets/images/HDPE_Bag.png";
import loopBagImage from "../../assets/images/Loop-Bag-Card.jpeg";
import nonWovenBag from "../../assets/images/Non_Woven_Bag.png";
import paperBag from "../../assets/images/Paper_Bag.png";
import plasticBag from "../../assets/images/Plastic_Bag.png";
import sampleImage from "../../assets/images/8.jpg";

export const printingServiceCards = [
  { id: 1, title: "NON-WOVEN BAG", image: nonWovenBag },
  { id: 2, title: "PAPER BAG", image: paperBag },
  { id: 3, title: "PLASTIC BAG", image: plasticBag },
  { id: 4, title: "HDPE BAG", image: hdpeBag },
  { id: 5, title: "CANVAS BAG", image: canvasBag }
];

export const nonWovenBagCards = [
  { id: 1, title: "D-CUT BAG", slug: "d-cut-bag", image: dCutImage },
  { id: 2, title: "LOOP BAG", slug: "loop-bag", image: loopBagImage },
  { id: 3, title: "BOX BAG", slug: "box-bag", image: boxBagImage },
  { id: 4, title: "SAMPLE FILE", slug: "sample-file", image: sampleImage, isSample: true }
];

export const bagCatalog = {
  "d-cut-bag": {
    title: "D-CUT BAG",
    image: dCutImage,
    productRef: "BC/D-Cut/1st Edition (Sample File)",
    productCode: "BC-NW-DC01",
    productClass: "Regular / Heavy Duty",
    core: "Clean, modern, and eco-friendly",
    material: "100% Polypropylene Non-Woven Fabric",
    productionTime: "2-3 Business Days (Digital Mockup within 24 Hours)",
    descriptionRows: [
      { label: "Product Reference", value: "BC/D-Cut/1st Edition (Sample File)" },
      { label: "Product Code", value: "BC-NW-DC01" },
      { label: "Product Class", value: "Regular / Heavy Duty" },
      { label: "Product Material", value: "100% Polypropylene Non-Woven Fabric" },
      { label: "Fabric Quality", value: "60 GSM (Standard) / 80 GSM (Heavy Duty)" },
      { label: "Production Time", value: "2-3 Business Days (Digital Mockup within 24 Hours)" },
      { label: "Handle Type", value: "Sleek D-Cut Handle (Comfortable with Zero Tearing Risk)" },
      { label: "Product Appearance", value: "Clean, Modern, and Eco-Friendly" },
      { label: "Printing Option", value: "Single-Side and Double-Side Printing Available" }
    ],
    specializationPoints: [
      "India's No. 1 Non-Woven Bag Manufacturer.",
      "100% Eco-Friendly and Reusable Products.",
      "Advanced Printing Infrastructure with High-Fidelity Print Quality.",
      "Competitive Wholesale Pricing with a Minimum Order Quantity (MOQ) of 1,000 Pieces."
    ],
    featurePoints: [
      "Premium Quality: Manufactured using high-quality non-woven fabric that is lightweight, durable, and reusable.",
      "High-Quality Printing: Delivers sharp, vibrant, and long-lasting custom branding for logos, artwork, and business names.",
      "Advanced Printing Technology: Produced using state-of-the-art 2023 Komori Offset Printing Machines for superior precision.",
      "Eco-Friendly Solution: A sustainable, plastic-free alternative that supports environmental conservation.",
      "Customizable Options: Choose your preferred bag size, fabric colour, printing option, and quantity according to your business requirements."
    ],
    importantNotes: {
      sizeSpecifications: [
        { label: "Bag Size", value: "W: 90.00 mm x H: 53.00 mm" },
        { label: "Artwork Size", value: "W: 93.00 mm x H: 56.00 mm" }
      ],
      printingGuidelines: [
        "The bags support high colour saturation and excellent print quality, making them suitable for colourful and dark artwork.",
        "Always use high-resolution artwork to achieve the sharpest and clearest printing results."
      ]
    },
    highlights: [
      "Sharp handle cutting with neat finishing",
      "Suitable for retail packaging, exhibitions, and promotions",
      "Available in multiple color and size combinations"
    ]
  },
  "box-bag": {
    title: "BOX BAG",
    image: boxBagImage,
    productRef: "NWB/BOX/01",
    productCode: "BX-18",
    productClass: "Premium",
    core: "Structured box-style bag with premium shelf presence",
    material: "Laminated non-woven fabric",
    productionTime: "3-5 days",
    highlights: [
      "Box shape offers better product presentation",
      "Ideal for apparel stores, premium gifting, and exhibitions",
      "Supports custom branding with multi-color print options"
    ]
  },
  "loop-bag": {
    title: "LOOP BAG",
    image: loopBagImage,
    productRef: "NWB/LOOP/01",
    productCode: "LP-20",
    productClass: "Premium",
    core: "Loop-handle carry bag with durable finish and premium look",
    material: "Heavy-duty non-woven fabric",
    productionTime: "3-5 days",
    highlights: [
      "Comfortable loop handle for heavier product carrying",
      "Good choice for branded shopping and retail use",
      "Long-lasting construction with quality print support"
    ]
  }
};

export const bagTypeOptions = [
  { value: "One side", label: "One Side Printing" },
  { value: "Both sides", label: "Two Side Printing" }
];

export const quantityOptions = [200, 300, 500, 1000];

export const bagSizeOptionsBySlug = {
  "d-cut-bag": [
    { value: "10 X 14", label: "10 x 14" },
    { value: "12 X 16", label: "12 x 16" },
    { value: "14 X 19", label: "14 x 19" },
    { value: "16 X 21", label: "16 x 21" }
  ],
  "loop-bag": [
    { value: "10 X 14", label: "10 x 14" },
    { value: "12 X 16", label: "12 x 16" },
    { value: "14 X 19", label: "14 x 19" },
    { value: "16 X 21", label: "16 x 21" }
  ],
  "box-bag": [
    { value: "10 X 12 X 5", label: "10 x 12 x 5" },
    { value: "12 X 14.5 X 5", label: "12 x 14.5 x 5" },
    { value: "12 X 16.5 X 5", label: "12 x 16.5 x 5" },
    { value: "15 X 18 X 5", label: "15 x 18 x 5" }
  ]
};

export const bagRateMatrix = {
  "d-cut-bag": {
    "Single color": {
      "10 X 14": 3.4,
      "12 X 16": 4.4,
      "14 X 19": 5.4,
      "16 X 21": 6.4
    },
    "Two color": {
      "10 X 14": 4.4,
      "12 X 16": 5.4,
      "14 X 19": 6.4,
      "16 X 21": 7.4
    },
    "Four color": {
      "10 X 14": 6.4,
      "12 X 16": 7.4,
      "14 X 19": 8.4,
      "16 X 21": 9.4
    }
  },
  "loop-bag": {
    "Single color": {
      "10 X 14": 5.4,
      "12 X 16": 6.4,
      "14 X 19": 7.4,
      "16 X 21": 8.4
    },
    "Two color": {
      "10 X 14": 6.4,
      "12 X 16": 7.4,
      "14 X 19": 8.4,
      "16 X 21": 9.4
    },
    "Four color": {
      "10 X 14": 8.4,
      "12 X 16": 9.4,
      "14 X 19": 10.4,
      "16 X 21": 11.4
    }
  },
  "box-bag": {
    "Single color": {
      "10 X 12 X 5": 13,
      "12 X 14.5 X 5": 15.37,
      "12 X 16.5 X 5": 16.36,
      "15 X 18 X 5": 18.16
    },
    "Two color": {
      "10 X 12 X 5": 14,
      "12 X 14.5 X 5": 16.37,
      "12 X 16.5 X 5": 17.36,
      "15 X 18 X 5": 19.16
    },
    "Four color": {
      "10 X 12 X 5": 15,
      "12 X 14.5 X 5": 17.37,
      "12 X 16.5 X 5": 18.36,
      "15 X 18 X 5": 20.16
    }
  }
};

export const bagColors = [
  { value: "White", hex: "#ffffff", borderClassName: "border-slate-300", textClassName: "text-slate-700" },
  { value: "Off White", hex: "#f5f1e8", borderClassName: "border-stone-300", textClassName: "text-stone-700" },
  { value: "Bright Yellow", hex: "#facc15", borderClassName: "border-yellow-300", textClassName: "text-slate-800" },
  { value: "Golden Yellow", hex: "#eab308", borderClassName: "border-amber-400", textClassName: "text-slate-800" },
  { value: "Light Pink", hex: "#f9c5d1", borderClassName: "border-pink-300", textClassName: "text-slate-800" },
  { value: "Bright Red", hex: "#ef4444", borderClassName: "border-red-300", textClassName: "text-white" },
  { value: "Orange", hex: "#f97316", borderClassName: "border-orange-300", textClassName: "text-white" },
  { value: "Dark Red", hex: "#991b1b", borderClassName: "border-rose-900", textClassName: "text-white" }
];
export const blackBagColorOption = {
  value: "Black",
  hex: "#111827",
  borderClassName: "border-slate-800",
  textClassName: "text-white"
};
export const textColorTypes = ["Single color", "Two color", "Four color", "Mix color"];
export const textColorOptions = [
  { value: "Red", hex: "#dc2626", borderClassName: "border-red-300", textClassName: "text-white", swatchBackground: "#dc2626" },
  { value: "Magenta", hex: "#d946ef", borderClassName: "border-fuchsia-300", textClassName: "text-white", swatchBackground: "#d946ef" },
  { value: "Blue", hex: "#2563eb", borderClassName: "border-blue-300", textClassName: "text-white", swatchBackground: "#2563eb" },
  { value: "Black", hex: "#111827", borderClassName: "border-slate-800", textClassName: "text-white", swatchBackground: "#111827" },
  { value: "Rembo", hex: "#dc2626", borderClassName: "border-purple-400", textClassName: "text-white", swatchBackground: "linear-gradient(90deg,#dc2626 0%,#f97316 20%,#eab308 40%,#16a34a 60%,#2563eb 80%,#d946ef 100%)" }
];

export const dCutTwoColorTextColorOptions = [
  { value: "Red", hex: "#dc2626", borderClassName: "border-red-300", textClassName: "text-white", swatchBackground: "#dc2626" },
  { value: "Magenta", hex: "#d946ef", borderClassName: "border-fuchsia-300", textClassName: "text-white", swatchBackground: "#d946ef" },
  { value: "Blue", hex: "#2563eb", borderClassName: "border-blue-300", textClassName: "text-white", swatchBackground: "#2563eb" },
  { value: "Black", hex: "#111827", borderClassName: "border-slate-800", textClassName: "text-white", swatchBackground: "#111827" },
  { value: "Rembo", hex: "#dc2626", borderClassName: "border-purple-400", textClassName: "text-white", swatchBackground: "linear-gradient(90deg,#dc2626 0%,#f97316 20%,#eab308 40%,#16a34a 60%,#2563eb 80%,#d946ef 100%)" }
];

export function getAvailableTextColorOptions(bagSlug, textColorType) {
  if (bagSlug === "d-cut-bag" && textColorType === "Two color") {
    return dCutTwoColorTextColorOptions;
  }

  return textColorOptions;
}
