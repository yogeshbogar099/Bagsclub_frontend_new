import fourColor10x14 from "../../assets/images/10x14.jpeg";
import fourColor12x16 from "../../assets/images/12x16.jpeg";
import fourColor14x19 from "../../assets/images/14x19.jpeg";
import fourColor16x21 from "../../assets/images/16x21.jpeg";
import babypink10x14 from "../../assets/images/babypink_10x14.jpeg";
import babypink12x16 from "../../assets/images/babypink_12x16.jpeg";
import babypink14x19 from "../../assets/images/babypink_14x19.jpeg";
import babypink16x21 from "../../assets/images/babypink_16x21.jpeg";
import blackAndPink14x19 from "../../assets/images/black_and_pink14x19.jpeg";
import golden10x14 from "../../assets/images/golden_10x14.jpeg";
import golden12x16 from "../../assets/images/golden_12x16.jpeg";
import golden14x19 from "../../assets/images/golden_14x19.jpeg";
import golden16x21 from "../../assets/images/golden_16x21.jpeg";
import offwhite10x14 from "../../assets/images/offwhite_10x14.jpeg";
import offwhite12x16 from "../../assets/images/offwhite_12x16.jpeg";
import offwhite14x19 from "../../assets/images/offwhite_14x19.jpeg";
import orangeAndBlack10x14 from "../../assets/images/orange_and_black10x14.jpeg";
import pinkAndBlue12x16 from "../../assets/images/pink_and_blue12x16.jpeg";
import pinkAndBlue14x19 from "../../assets/images/pink_and_blue14x19.jpeg";
import pinkAndBlue16x21 from "../../assets/images/pink_and_blue16x21.jpeg";
import pinkAndWhite16x21 from "../../assets/images/pink_and_white16x21.jpeg";
import loopBagTwoColor12x16 from "../../assets/images/twocolorloop12x16.jpeg";
import loopBagTwoColor14x19 from "../../assets/images/twocolorloop14x19.jpeg";
import loopBagTwoColor16x21 from "../../assets/images/twocolorloop16x21.jpeg";
import loopBagFourColor12x16 from "../../assets/images/fourcolorloop12x16.jpeg";
import loopBagFourColor14x19 from "../../assets/images/fourcolorloop14x19.jpeg";
import loopBagFourColor16x21 from "../../assets/images/fourcolorloop16x21.jpeg";
import loopBagWhite10x14 from "../../assets/images/white10x14.jpeg";
import loopBagWhite12x16 from "../../assets/images/white12x16.jpeg";
import loopBagWhite14x19 from "../../assets/images/white14x19.jpeg";
import loopBagWhite16x21 from "../../assets/images/white16x21.jpeg";
import white10x14 from "../../assets/images/white_10x14.jpeg";
import white12x16 from "../../assets/images/white_12x16.jpeg";
import white14x19 from "../../assets/images/white_14x19.jpeg";
import white16x21 from "../../assets/images/white_16x21.jpeg";
import whiteAndBlack10x14 from "../../assets/images/white_and_black10x14.jpeg";
import yellow10x14 from "../../assets/images/yellow_10x14.jpeg";
import yellow12x16 from "../../assets/images/yellow_12x16.jpeg";
import yellow14x19 from "../../assets/images/yellow_14x19.jpeg";
import yellow16x21 from "../../assets/images/yellow_16x21.jpeg";

const nonWovenSingleColorDescriptionImageMatrix = {
  "10 X 14": {
    babypink: babypink10x14,
    golden: golden10x14,
    offwhite: offwhite10x14,
    white: white10x14,
    yellow: yellow10x14
  },
  "12 X 16": {
    babypink: babypink12x16,
    golden: golden12x16,
    offwhite: offwhite12x16,
    white: white12x16,
    yellow: yellow12x16
  },
  "14 X 19": {
    babypink: babypink14x19,
    golden: golden14x19,
    offwhite: offwhite14x19,
    white: white14x19,
    yellow: yellow14x19
  },
  "16 X 21": {
    babypink: babypink16x21,
    golden: golden16x21,
    white: white16x21,
    yellow: yellow16x21
  }
};

const dCutTwoColorDescriptionImageMatrix = {
  "10 X 14": {
    "black|orange": orangeAndBlack10x14,
    "black|white": whiteAndBlack10x14
  },
  "12 X 16": {
    "blue|pink": pinkAndBlue12x16
  },
  "14 X 19": {
    "black|pink": blackAndPink14x19,
    "blue|pink": pinkAndBlue14x19
  },
  "16 X 21": {
    "blue|pink": pinkAndBlue16x21,
    "pink|white": pinkAndWhite16x21
  }
};

const dCutFourColorDescriptionImageMatrix = {
  "10 X 14": fourColor10x14,
  "12 X 16": fourColor12x16,
  "14 X 19": fourColor14x19,
  "16 X 21": fourColor16x21
};

const loopBagSingleColorDescriptionImageMatrix = {
  "10 X 14": loopBagWhite10x14,
  "12 X 16": loopBagWhite12x16,
  "14 X 19": loopBagWhite14x19,
  "16 X 21": loopBagWhite16x21
};

const loopBagTwoColorDescriptionImageMatrix = {
  "12 X 16": loopBagTwoColor12x16,
  "14 X 19": loopBagTwoColor14x19,
  "16 X 21": loopBagTwoColor16x21
};

const loopBagFourColorDescriptionImageMatrix = {
  "12 X 16": loopBagFourColor12x16,
  "14 X 19": loopBagFourColor14x19,
  "16 X 21": loopBagFourColor16x21
};

function normalizeNonWovenBagColorKey(bagColor = "") {
  const normalizedValue = String(bagColor || "").trim().toLowerCase();

  if (normalizedValue.includes("golden")) return "golden";
  if (normalizedValue.includes("yellow")) return "yellow";
  if (normalizedValue.includes("pink")) return "babypink";
  if (normalizedValue.includes("off white") || normalizedValue.includes("offwhite")) return "offwhite";
  if (normalizedValue === "white") return "white";

  return "";
}

function normalizeTextColorKey(textColor = "") {
  return String(textColor || "").trim().toLowerCase();
}

function buildTwoColorSelectionKey(textColorSelection = []) {
  if (!Array.isArray(textColorSelection) || textColorSelection.length !== 2) return "";

  return [...textColorSelection]
    .map(normalizeTextColorKey)
    .filter(Boolean)
    .sort()
    .join("|");
}

export function getDynamicDescriptionImage({ bagSlug, bagSize, bagColor, textColorSelection, textColorType, defaultImage }) {
  if (!["d-cut-bag", "loop-bag"].includes(bagSlug)) {
    return defaultImage;
  }

  if (bagSlug === "loop-bag" && textColorType === "Single color") {
    return loopBagSingleColorDescriptionImageMatrix[bagSize] || defaultImage;
  }

  if (bagSlug === "loop-bag" && textColorType === "Two color") {
    return loopBagTwoColorDescriptionImageMatrix[bagSize] || defaultImage;
  }

  if (bagSlug === "loop-bag" && textColorType === "Four color") {
    return loopBagFourColorDescriptionImageMatrix[bagSize] || defaultImage;
  }

  if (bagSlug === "d-cut-bag" && textColorType === "Four color") {
    return dCutFourColorDescriptionImageMatrix[bagSize] || defaultImage;
  }

  if (bagSlug === "d-cut-bag" && textColorType === "Two color") {
    const twoColorSelectionKey = buildTwoColorSelectionKey(textColorSelection);

    return dCutTwoColorDescriptionImageMatrix[bagSize]?.[twoColorSelectionKey] || defaultImage;
  }

  if (textColorType !== "Single color") {
    return defaultImage;
  }

  const normalizedBagColor = normalizeNonWovenBagColorKey(bagColor);

  return nonWovenSingleColorDescriptionImageMatrix[bagSize]?.[normalizedBagColor] || defaultImage;
}
