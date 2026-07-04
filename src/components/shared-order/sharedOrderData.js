import boxBagImage from "../../assets/images/BoxBag.png";
import canvasBag from "../../assets/images/CanvasBag.png";
import dCutImage from "../../assets/images/D_Cut.png";
import hdpeBag from "../../assets/images/HDPE.png";
import loopBagImage from "../../assets/images/LoopBag.png";
import nonWovenBag from "../../assets/images/NonWoven.png";
import paperBag from "../../assets/images/PaperBag.png";
import plasticBag from "../../assets/images/PlasticBag.png";

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
  { id: 3, title: "BOX BAG", slug: "box-bag", image: boxBagImage }
];

export const bagCatalog = {
  "d-cut-bag": {
    title: "D-CUT BAG",
    image: dCutImage,
    productRef: "NWB/D-CUT/01",
    productCode: "DC-14",
    productClass: "Premium",
    core: "Strong non-woven carry bag with clean die-cut handle",
    material: "Premium non-woven fabric",
    productionTime: "2-4 days",
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

export const bagSizes = ["10 X 12", "12 X 14", "14 X 16", "16 X 20"];
export const bagColors = ["Red", "Green", "Yellow", "White", "Blue", "Black"];
export const textColorTypes = ["Single color", "Two color", "Multi color"];
export const textColorOptions = ["Red", "Green", "Blue", "Black", "White", "Golden", "Silver", "Cyan", "Magenta", "Yellow"];
