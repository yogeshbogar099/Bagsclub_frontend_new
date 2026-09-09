import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
  Mail,
  Minus,
  Package,
  Palette,
  Plus,
  Printer,
  Truck,
  Upload,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { buildApiUrl } from "../../lib/apiBaseUrl.js";
import { getAuthSession, saveAuthSession } from "../../utils/auth.js";
import { getDynamicDescriptionImage } from "./dCutDescriptionImages.js";
import { bagCatalog, bagColors, bagSizeOptionsBySlug, bagTypeOptions, blackBagColorOption, getAvailableTextColorOptions, textColorTypes } from "./sharedOrderData.js";
import { calculateOrderPricing, getBagRate, GST_PERCENT_LABEL } from "./orderPricing.js";

const selectableCardClassName =
  "border bg-white text-left text-[13px] font-medium transition-all";
const MINIMUM_QUANTITY = 1000;

export default function SharedNonWovenBagOrderForm({ bagSlug, basePath, submitOrder }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const printingColorDropdownRef = useRef(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [printingColorDropdownOpen, setPrintingColorDropdownOpen] = useState(false);

  const product = bagCatalog[bagSlug] || bagCatalog["d-cut-bag"];
  const sizeOptions = useMemo(() => bagSizeOptionsBySlug[bagSlug] || bagSizeOptionsBySlug["d-cut-bag"], [bagSlug]);

  const [formData, setFormData] = useState({
    printingPress: "",
    orderName: "",
    bagType: "",
    quantity: "",
    bagSize: "",
    bagColor: "",
    textColorType: "Single color",
    textColorSelection: [],
    privacy: "Not Required",
    deliveryOption: "Dispatch By Transport",
    fileOption: "",
    fileName: "",
    fileUrl: "",
    sellingPrice: 0,
    remark: "",
    pressline: user?.businessName || user?.ownerName || user?.name || "Sandeep Printers"
  });

  const [costs, setCosts] = useState({
    bagCost: 0,
    applicableCost: 0,
    gst: 0,
    totalAmount: 0,
    privacyCharge: 0
  });

  const uploadedDesignType = useMemo(() => {
    if (!formData.fileName || !formData.fileName.includes(".")) return "";
    return formData.fileName.split(".").pop().trim().toUpperCase();
  }, [formData.fileName]);
  const designMode = useMemo(() => String(searchParams.get("design") || "").trim().toLowerCase(), [searchParams]);
  const isLockedPrintingType = useMemo(() => ["d-cut-bag", "loop-bag", "box-bag"].includes(bagSlug) && Boolean(designMode), [bagSlug, designMode]);
  const availableTextColorTypes = useMemo(() => {
    if (!isLockedPrintingType) return textColorTypes;
    return textColorTypes.filter((type) => type === formData.textColorType);
  }, [formData.textColorType, isLockedPrintingType]);
  const availableTextColorOptions = useMemo(
    () => getAvailableTextColorOptions(bagSlug, formData.textColorType),
    [bagSlug, formData.textColorType]
  );

  const pdfDiscountAmount = 0;
  const hiddenPricePerBag = useMemo(
    () =>
      !formData.bagSize
        ? 0
        :
        getBagRate({
          bagSlug,
          bagSize: formData.bagSize,
          textColorType: formData.textColorType
        }),
    [bagSlug, formData.bagSize, formData.textColorType]
  );

  useEffect(() => {
    if (!["d-cut-bag", "loop-bag", "box-bag"].includes(bagSlug) || !designMode) return;

    const nextTextColorType =
      designMode === "single" || designMode === "single-color"
        ? "Single color"
        : designMode === "two" || designMode === "two-color"
          ? "Two color"
          : designMode === "four" || designMode === "four-color"
            ? "Four color"
            : designMode === "mix" || designMode === "multi" || designMode === "multi-color"
              ? "Mix color"
              : null;

    if (!nextTextColorType) return;

    setFormData((prev) => ({
      ...prev,
      textColorType: nextTextColorType,
      textColorSelection: []
    }));
  }, [bagSlug, designMode]);

  useEffect(() => {
    const validQuantity = Number(formData.quantity);
    const { bagCost, applicableCost, gstAmount, payableBeforeDiscount, privacyCharge, sellingPrice } = calculateOrderPricing({
      quantity: Number.isFinite(validQuantity) && validQuantity >= 1000 ? validQuantity : 0,
      pricePerBag: hiddenPricePerBag,
      privacy: formData.privacy
    });

    setCosts({ bagCost, applicableCost, gst: gstAmount, totalAmount: payableBeforeDiscount, privacyCharge });
    setFormData((prev) => ({ ...prev, sellingPrice }));
  }, [formData.quantity, formData.privacy, hiddenPricePerBag]);

  useEffect(() => {
    const allowedColors = new Set(availableTextColorOptions.map((option) => option.value));

    setFormData((prev) => {
      const nextTextColorSelection = prev.textColorSelection.filter((color) => allowedColors.has(color));

      if (nextTextColorSelection.length === prev.textColorSelection.length) {
        return prev;
      }

      return {
        ...prev,
        textColorSelection: nextTextColorSelection
      };
    });
  }, [availableTextColorOptions]);

  useEffect(() => {
    setFormData((prev) => {
      const nextBagSize = sizeOptions.some((option) => option.value === prev.bagSize) ? prev.bagSize : "";
      const nextBagColor = bagColors.some((option) => option.value === prev.bagColor) ? prev.bagColor : "";
      const parsedQuantity = Number(prev.quantity);
      const nextQuantity =
        prev.quantity === ""
          ? String(MINIMUM_QUANTITY)
          : Number.isFinite(parsedQuantity)
            ? parsedQuantity
            : String(MINIMUM_QUANTITY);
      const nextPrivacy = prev.privacy === "Required" || prev.privacy === "Not Required" ? prev.privacy : "Not Required";

      if (
        nextBagSize === prev.bagSize &&
        nextBagColor === prev.bagColor &&
        nextQuantity === Number(prev.quantity) &&
        nextPrivacy === prev.privacy
      ) {
        return prev;
      }

      return {
        ...prev,
        bagSize: nextBagSize,
        bagColor: nextBagColor,
        quantity: nextQuantity,
        privacy: nextPrivacy
      };
    });
  }, [sizeOptions]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (printingColorDropdownRef.current && !printingColorDropdownRef.current.contains(event.target)) {
        setPrintingColorDropdownOpen(false);
      }
    }

    if (printingColorDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [printingColorDropdownOpen]);

  const selectedPrintingColorObjects = useMemo(
    () => formData.textColorSelection.map((value) => availableTextColorOptions.find((o) => o.value === value)).filter(Boolean),
    [formData.textColorSelection, availableTextColorOptions]
  );

  const printingTypeValue = useMemo(() => (formData.bagType === "Both sides" ? "double-side" : "single-side"), [formData.bagType]);
  const basePayableAmount = useMemo(() => Number(costs.totalAmount.toFixed(2)), [costs.totalAmount]);
  const payableAmount = useMemo(() => Number(Math.max(basePayableAmount - pdfDiscountAmount, 0).toFixed(2)), [basePayableAmount, pdfDiscountAmount]);
  const knownWalletBalance = useMemo(() => {
    const parsedBalance = Number(user?.walletBalance);
    return Number.isFinite(parsedBalance) ? parsedBalance : null;
  }, [user?.walletBalance]);
  const derivedCustomerName = String(user?.businessName || user?.ownerName || user?.name || "").trim();
  const derivedCustomerMobile = String(user?.mobile || user?.mobileNumber || "").trim();
  const hasDetailedProductDescription = bagSlug === "d-cut-bag" && Array.isArray(product.descriptionRows);
  const hasExpandedDescriptionImage =
    (bagSlug === "d-cut-bag" && ["Single color", "Two color", "Four color"].includes(formData.textColorType)) ||
    (bagSlug === "loop-bag" && formData.textColorType === "Single color");
  const availableBagColors = useMemo(() => {
    if (bagSlug === "d-cut-bag" && formData.textColorType === "Two color") {
      return [...bagColors, blackBagColorOption];
    }

    return bagColors;
  }, [bagSlug, formData.textColorType]);
  const descriptionImage = useMemo(
    () =>
      getDynamicDescriptionImage({
        bagSlug,
        bagSize: formData.bagSize,
        bagColor: formData.bagColor,
        textColorSelection: formData.textColorSelection,
        textColorType: formData.textColorType,
        defaultImage: product.image
      }),
    [bagSlug, formData.bagColor, formData.bagSize, formData.textColorSelection, formData.textColorType, product.image]
  );
  const usesDeferredDescriptionImage = useMemo(
    () => bagSlug === "d-cut-bag" && formData.textColorType === "Single color",
    [bagSlug, formData.textColorType]
  );
  const shouldShowDescriptionImage = Boolean(descriptionImage);
  const hasBagSize = Boolean(formData.bagSize);
  const hasOrderBasics = useMemo(
    () => formData.orderName.trim().length > 0 && Boolean(formData.bagSize),
    [formData.bagSize, formData.orderName]
  );
  const isCostSummaryReady = useMemo(
    () =>
      Boolean(formData.bagType) &&
      Boolean(formData.bagSize) &&
      Boolean(formData.bagColor) &&
      Boolean(formData.fileOption) &&
      Number.isFinite(Number(formData.quantity)) &&
      Number(formData.quantity) >= MINIMUM_QUANTITY &&
      costs.bagCost > 0,
    [costs.bagCost, formData.bagColor, formData.bagSize, formData.bagType, formData.fileOption, formData.quantity]
  );
  const displayedBagCost = useMemo(() => (isCostSummaryReady ? costs.bagCost : 0), [costs.bagCost, isCostSummaryReady]);
  const displayedPrivacyCharge = useMemo(() => (isCostSummaryReady ? costs.privacyCharge : 0), [costs.privacyCharge, isCostSummaryReady]);
  const displayedApplicableCost = useMemo(() => (isCostSummaryReady ? costs.applicableCost : 0), [costs.applicableCost, isCostSummaryReady]);
  const displayedGst = useMemo(() => (isCostSummaryReady ? costs.gst : 0), [costs.gst, isCostSummaryReady]);
  const displayedPayableAmount = useMemo(() => (isCostSummaryReady ? payableAmount : 0), [isCostSummaryReady, payableAmount]);
  const derivedOrderDetails = useMemo(() => {
    const colorSelection = formData.textColorSelection.length ? formData.textColorSelection.join(", ") : "Not selected";
    const details = [
      `Product: ${product.title}`,
      `Bag Type: ${formData.bagType}`,
      `Quantity: ${formData.quantity}`,
      `Size: ${formData.bagSize}`,
      `Bag Color: ${formData.bagColor}`,
      `Printing Color Type: ${formData.textColorType}`,
      `Printing Colors: ${colorSelection}`,
      `Delivery Option: ${formData.deliveryOption}`
    ];
    if (formData.printingPress) {
      details.push(`Printing Press: ${formData.printingPress}`);
    }
    details.push(`Final Payable: Rs. ${payableAmount.toFixed(2)}`);
    return details.join(" | ");
  }, [
    formData.bagType,
    formData.bagColor,
    formData.bagSize,
    formData.deliveryOption,
    formData.printingPress,
    formData.quantity,
    formData.textColorSelection,
    formData.textColorType,
    payableAmount,
    product.title,
    uploadedDesignType
  ]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === "quantity") {
      const parsed = Number(value);
      if (value !== "" && Number.isFinite(parsed) && parsed < MINIMUM_QUANTITY) {
        setStatusMessage({ type: "error", text: "Minimum quantity is 1000." });
      } else {
        setStatusMessage((prev) => (prev.text === "Minimum quantity is 1000." ? { type: "", text: "" } : prev));
      }
    }
    if (name === "bagColor") {
      setStatusMessage({ type: "", text: "" });
    }
    if (name === "bagSize") {
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          bagSize: "",
          bagType: "",
          bagColor: "",
          textColorSelection: [],
          quantity: "",
          privacy: "Not Required",
          deliveryOption: "Dispatch By Transport",
          fileOption: "",
          fileName: "",
          fileUrl: "",
          remark: ""
        }));
      } else {
        setFormData((prev) => ({ ...prev, bagSize: value }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleIncrementQuantity() {
    setStatusMessage({ type: "", text: "" });
    setFormData((prev) => {
      const currentVal = Number(prev.quantity);
      if (!Number.isFinite(currentVal) || currentVal < MINIMUM_QUANTITY) {
        return { ...prev, quantity: String(MINIMUM_QUANTITY) };
      }
      return { ...prev, quantity: String(currentVal + 100) };
    });
  }

  function handleDecrementQuantity() {
    setStatusMessage({ type: "", text: "" });
    setFormData((prev) => {
      const currentVal = Number(prev.quantity);
      if (!Number.isFinite(currentVal) || currentVal <= MINIMUM_QUANTITY) {
        setStatusMessage({ type: "error", text: `Minimum quantity is ${MINIMUM_QUANTITY}.` });
        return { ...prev, quantity: String(MINIMUM_QUANTITY) };
      }
      const nextVal = Math.max(MINIMUM_QUANTITY, currentVal - 100);
      return { ...prev, quantity: String(nextVal) };
    });
  }

  function handleQuantityBlur() {
    let nextStatusMessage = null;
    setFormData((prev) => {
      if (prev.quantity === "") {
        nextStatusMessage = { type: "error", text: "Minimum quantity is 1000." };
        return { ...prev, quantity: String(MINIMUM_QUANTITY) };
      }
      const parsedQuantity = Number(prev.quantity);
      if (!Number.isFinite(parsedQuantity) || parsedQuantity < MINIMUM_QUANTITY) {
        nextStatusMessage = { type: "error", text: "Minimum quantity is 1000." };
        return { ...prev, quantity: String(MINIMUM_QUANTITY) };
      }
      return prev;
    });
    if (nextStatusMessage) {
      setStatusMessage(nextStatusMessage);
    }
  }

  function handleSelectField(name, value) {
    setStatusMessage({ type: "", text: "" });
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleColorSelect(color) {
    const type = formData.textColorType;
    const selected = [...formData.textColorSelection];
    const index = selected.indexOf(color);

    if (index > -1) {
      selected.splice(index, 1);
    } else if (type === "Single color") {
      selected.splice(0, selected.length, color);
    } else if (type === "Two color") {
      if (selected.length >= 2) {
        setStatusMessage({ type: "error", text: "You can only select two colors for Two color type." });
        return;
      }
      selected.push(color);
    } else if (type === "Four color") {
      if (selected.length >= 4) {
        setStatusMessage({ type: "error", text: "You can only select four colors for Four color type." });
        return;
      }
      selected.push(color);
    } else if (type === "Mix color") {
      selected.push(color);
    } else {
      selected.splice(0, selected.length, color);
    }

    setStatusMessage({ type: "", text: "" });
    setFormData((prev) => ({ ...prev, textColorSelection: selected }));
    setPrintingColorDropdownOpen(false);
  }

  function handleFile(file) {
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setStatusMessage({ type: "error", text: "File size exceeds 100MB limit." });
      return;
    }

    const allowedExtensions = ["pdf", "cdr", "ai", "psd", "jpeg", "jpg", "png"];
    const extension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setStatusMessage({ type: "error", text: "Invalid file format. Please upload AI, PDF, CDR, PSD, JPEG, JPG, or PNG." });
      return;
    }

    setFileUploading(true);
    setStatusMessage({ type: "success", text: "Uploading design file..." });

    const session = getAuthSession();
    const token = session?.token;
    if (!token) {
      setFileUploading(false);
      setStatusMessage({ type: "error", text: "Login required to upload a design file." });
      return;
    }

    const body = new FormData();
    body.append("file", file);

    fetch(buildApiUrl("/api/uploads/design"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || "Failed to upload design file.");
        }
        return data;
      })
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          fileName: data.fileName || file.name,
          fileUrl: data.fileUrl || ""
        }));
        setStatusMessage({ type: "success", text: "Design file uploaded successfully." });
      })
      .catch((error) => {
        setFormData((prev) => ({ ...prev, fileName: "", fileUrl: "" }));
        setStatusMessage({ type: "error", text: error?.message || "Failed to upload design file." });
      })
      .finally(() => {
        setFileUploading(false);
      });
  }

  function handleDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  }

  function handleFileChange(event) {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedOrderName = formData.orderName.trim();
    const trimmedPressline = formData.pressline.trim();
    const quantity = Number(formData.quantity || 0);
    const sellingPrice = Number(formData.sellingPrice || 0);
    const selectedColorCount = formData.textColorSelection.length;


    if (!trimmedOrderName) {
      setStatusMessage({ type: "error", text: "Order name is required." });
      return;
    }
    if (!formData.bagType || !formData.bagSize || !formData.bagColor || !formData.textColorType || !formData.privacy || !formData.deliveryOption || !formData.fileOption) {
      setStatusMessage({ type: "error", text: "Please select all required order options." });
      return;
    }
    if (!Number.isFinite(quantity) || quantity < MINIMUM_QUANTITY) {
      setStatusMessage({ type: "error", text: "Minimum quantity is 1000." });
      return;
    }
    if (formData.textColorType === "Single color" && selectedColorCount !== 1) {
      setStatusMessage({ type: "error", text: "Please select exactly one text color." });
      return;
    }
    if (formData.textColorType === "Two color" && selectedColorCount !== 2) {
      setStatusMessage({ type: "error", text: "Please select exactly two text colors." });
      return;
    }
    if (formData.textColorType === "Four color" && selectedColorCount !== 4) {
      setStatusMessage({ type: "error", text: "Please select exactly four text colors." });
      return;
    }
    if (formData.textColorType === "Mix color" && selectedColorCount < 1) {
      setStatusMessage({ type: "error", text: "Please select at least one text color." });
      return;
    }
    if (formData.fileOption === "Attach File Online" && (!formData.fileName || !formData.fileUrl)) {
      setStatusMessage({ type: "error", text: "Please upload your design file." });
      return;
    }
    if (fileUploading) {
      setStatusMessage({ type: "error", text: "Please wait until the design file upload completes." });
      return;
    }
    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
      setStatusMessage({ type: "error", text: "Selling price is required." });
      return;
    }
    if (!trimmedPressline) {
      setStatusMessage({ type: "error", text: "Pressline is required." });
      return;
    }
    if (!derivedCustomerName || !derivedCustomerMobile) {
      setStatusMessage({ type: "error", text: "Profile details are missing. Please update your account information." });
      return;
    }
    if (knownWalletBalance !== null && knownWalletBalance < payableAmount) {
      setStatusMessage({ type: "error", text: "Insufficient balance in wallet." });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const response = await submitOrder({
        orderName: trimmedOrderName,
        customerName: derivedCustomerName,
        customerMobile: derivedCustomerMobile,
        orderDetailsOverview: derivedOrderDetails,
        bagName: product.title,
        printSide: formData.bagType,
        quantity,
        bagSize: formData.bagSize,
        bagColor: formData.bagColor,
        textColorType: formData.textColorType,
        textColors: formData.textColorSelection,
        printingPress: formData.printingPress,
        privacy: formData.privacy,
        deliveryOption: formData.deliveryOption,
        fileOption: formData.fileOption,
        sellingPrice,
        remark: formData.remark.trim(),
        pressline: trimmedPressline,
        designSubmissionSource: formData.fileOption === "Send via Email" ? "email" : "online-upload",
        designFileName: formData.fileName,
        designFileType: uploadedDesignType,
        designFileUrl: formData.fileUrl,
        referenceNo: `${product.productRef} | ${printingTypeValue} | Qty ${formData.quantity}`,
        basePayableAmount,
        pdfDiscountAmount,
        payableAmount
      });

      if (response?.walletBalance) {
        const session = getAuthSession();
        if (session?.user) {
          saveAuthSession({
            ...session,
            user: {
              ...session.user,
              walletBalance: response.walletBalance
            }
          });
        }
      }

      setStatusMessage({ type: "success", text: "Order placed successfully." });
      window.setTimeout(() => {
        navigate(basePath);
      }, 800);
    } catch (error) {
      setStatusMessage({ type: "error", text: error?.message || "Failed to place order." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f3f4f6] py-6 font-sans text-[#1f2937] px-4 sm:px-6 md:px-0 md:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-[72px]">
        {/* Header Bar */}
        <div className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(`${basePath}/non-woven-bag`)}
            className="rounded-[4px] border border-[#d4d7dd] bg-white px-3.5 py-1.5 text-xs font-bold text-[#2d58a5] transition hover:border-[#aebdce] hover:bg-[#f8fbff] shadow-xs"
          >
            Back
          </button>
          <h1 className="text-center text-[22px] sm:text-[24px] font-black uppercase tracking-[0.05em] text-[#111111]">Add Order</h1>
          <div className="w-[80px]" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8 xl:gap-10">
          {/* Left Column - Order Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Top Section Card: Order Name & Product Select */}
            <div className="rounded-[8px] border border-[#d3d7de] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[13px] sm:text-[14px] font-extrabold uppercase tracking-wide text-[#111111]">
                    ORDER NAME
                  </label>
                  <input
                    type="text"
                    name="orderName"
                    placeholder="Type customer name here to check order status easily"
                    value={formData.orderName}
                    onChange={handleInputChange}
                    className="h-[44px] w-full rounded-[4px] border border-[#d8d8d8] bg-[#f7f7f7] px-4 text-sm font-medium text-[#222222] placeholder:text-[#999999] outline-none transition focus:border-[#1f73ff] focus:bg-white focus:ring-1 focus:ring-[#1f73ff]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] sm:text-[14px] font-extrabold uppercase tracking-wide text-[#111111]">
                    SELECT PRODUCT
                  </label>
                  <select
                    name="bagSize"
                    value={formData.bagSize}
                    onChange={handleInputChange}
                    className="h-[44px] w-full rounded-[4px] border border-[#d8d8d8] bg-[#f7f7f7] px-4 text-sm font-medium text-[#222222] outline-none transition focus:border-[#1f73ff] focus:bg-white"
                  >
                    <option value="">--- Select ---</option>
                    {sizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {hasBagSize ? (
              <>
                <div className="rounded-[8px] border border-[#d3d7de] bg-white p-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="mb-4 flex flex-wrap items-center gap-[15px]">
                    <div className="text-[14px] font-semibold">Select 'Printing Press'</div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="h-[38px] w-[180px] rounded-[4px] border border-[#d4d4d4] bg-[#f7f7f7] px-3 text-sm outline-none focus:border-[#1f73ff] focus:bg-white"
                    />
                    <button type="button" className="rounded-[4px] bg-[#1f73ff] px-4 py-[10px] text-[12px] font-bold text-white transition-all hover:bg-[#0d62f1]">
                      Add New Printing Press
                    </button>
                  </div>
                  <select
                    name="printingPress"
                    value={formData.printingPress}
                    onChange={handleInputChange}
                    className="h-[42px] w-full rounded-[4px] border border-[#d8d8d8] bg-[#f7f7f7] px-4 text-sm outline-none focus:bg-white"
                  >
                    <option value="">--- Select ---</option>
                    <option value="Direct Order">Direct Order</option>
                    <option value={user?.businessName || user?.ownerName || user?.name || "Sandeep Printers"}>{user?.businessName || user?.ownerName || user?.name || "Sandeep Printers"}</option>
                  </select>
                </div>

                {/* SELECT DETAIL Container */}
                <div className="relative rounded-[8px] border border-[#d3d7de] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] z-20">
                  <div className="rounded-t-[8px] border-b border-[#e3e6eb] bg-[#fbfbfc] px-5 py-3.5 text-[15px] sm:text-[16px] font-bold uppercase tracking-wide text-[#111111]">
                    SELECT DETAIL
                  </div>

                  <div className="space-y-4 p-5">
                    {/* Quantity */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 border-b border-[#f0f2f5] pb-4">
                      <div className="w-full shrink-0 text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333333] md:w-[170px]">
                        <span className="inline-flex items-center gap-2">
                          <Package size={16} className="shrink-0 text-[#1f73ff]" />
                          <span>Quantity</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-[38px] items-center rounded-[6px] border border-[#d1d5db] bg-[#f0f2f5] focus-within:border-[#1f73ff] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#1f73ff]/20 overflow-hidden">
                          <input
                            type="number"
                            name="quantity"
                            min={MINIMUM_QUANTITY}
                            step="100"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            onBlur={handleQuantityBlur}
                            placeholder="1000"
                            className="h-full w-[80px] bg-transparent px-2 text-center text-sm font-semibold text-[#1e293b] outline-none sm:w-[90px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <div className="flex h-full flex-col border-l border-[#e2e8f0] bg-white">
                            <button
                              type="button"
                              onClick={handleIncrementQuantity}
                              className="flex flex-1 w-7 items-center justify-center text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 border-b border-[#e2e8f0]"
                              aria-label="Increase quantity by 100"
                              title="Increase quantity by 100"
                            >
                              <ChevronUp size={12} className="stroke-[3]" />
                            </button>
                            <button
                              type="button"
                              onClick={handleDecrementQuantity}
                              disabled={Number(formData.quantity) <= MINIMUM_QUANTITY}
                              className="flex flex-1 w-7 items-center justify-center text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                              aria-label="Decrease quantity by 100"
                              title="Decrease quantity by 100"
                            >
                              <ChevronDown size={12} className="stroke-[3]" />
                            </button>
                          </div>
                        </div>
                        <span className="text-xs sm:text-[13px] font-bold text-[#1f73ff] tracking-wide">
                          (Min Qty. : {MINIMUM_QUANTITY})
                        </span>
                      </div>
                    </div>

                    {/* Printing Side */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 border-b border-[#f0f2f5] pb-4">
                      <div className="w-full shrink-0 text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333333] md:w-[170px]">
                        <span className="inline-flex items-center gap-2">
                          <Printer size={16} className="shrink-0 text-[#1f73ff]" />
                          <span>Printing Side</span>
                        </span>
                      </div>
                      <select
                        name="bagType"
                        value={formData.bagType}
                        onChange={handleInputChange}
                        className="h-[38px] w-full flex-1 rounded-[6px] border border-[#d1d5db] bg-[#f0f2f5] px-3.5 text-sm font-medium text-[#1e293b] outline-none transition focus:border-[#1f73ff] focus:bg-white cursor-pointer"
                      >
                        <option value="">--Select--</option>
                        {bagTypeOptions.filter((option) => option.value !== "One side").map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value === "Both sides" ? "Both Side" : option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bag Color */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 border-b border-[#f0f2f5] pb-4">
                      <div className="w-full shrink-0 text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333333] md:w-[170px]">
                        <span className="inline-flex items-center gap-2">
                          <Palette size={16} className="shrink-0 text-[#1f73ff]" />
                          <span>Bag Color</span>
                        </span>
                      </div>
                      <select
                        name="bagColor"
                        value={formData.bagColor}
                        onChange={handleInputChange}
                        className="h-[38px] w-full flex-1 rounded-[6px] border border-[#d1d5db] bg-[#f0f2f5] px-3.5 text-sm font-medium text-[#1e293b] outline-none transition focus:border-[#1f73ff] focus:bg-white cursor-pointer"
                      >
                        <option value="">--Select--</option>
                        {availableBagColors.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Printing Color Type - INLINE */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 border-b border-[#f0f2f5] pb-4">
                      <div className="w-full shrink-0 text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333333] md:w-[170px]">
                        Printing Color Type :
                      </div>
                      <div className="flex flex-1 flex-wrap items-center gap-2">
                        {availableTextColorTypes.map((type) => {
                          const selected = formData.textColorType === type;

                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                if (isLockedPrintingType) return;
                                setFormData((prev) => ({
                                  ...prev,
                                  textColorType: type,
                                  textColorSelection: []
                                }));
                              }}
                              disabled={isLockedPrintingType && !selected}
                              className={`${selectableCardClassName} h-[34px] rounded-[6px] min-w-[96px] px-3.5 py-1 text-center text-xs sm:text-sm font-semibold text-[#111111] transition ${selected
                                ? "border-2 border-[#6b7280] bg-[#f1f5f9] text-[#111111] font-bold"
                                : "border border-[#d1d5db] bg-[#f0f2f5] text-[#111111] hover:border-[#9ca3af]"
                                } ${isLockedPrintingType && !selected ? "cursor-not-allowed opacity-60" : ""}`}
                              aria-pressed={selected}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Printing Color - INLINE */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                      <div className="w-full shrink-0 text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333333] md:w-[170px]">
                        <span className="inline-flex items-center gap-2">
                          <Palette size={16} className="shrink-0 text-[#1f73ff]" />
                          <span>Printing Color :</span>
                        </span>
                      </div>
                      <div className="flex-1 relative" ref={printingColorDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setPrintingColorDropdownOpen((o) => !o)}
                          className="flex h-[38px] w-full items-center justify-between gap-2.5 rounded-[6px] border border-[#d1d5db] bg-[#f0f2f5] px-3 sm:px-3.5 text-left text-xs sm:text-sm font-medium text-[#1e293b] outline-none transition focus:border-[#1f73ff] focus:bg-white cursor-pointer"
                          aria-haspopup="listbox"
                          aria-expanded={printingColorDropdownOpen}
                        >
                          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                            {selectedPrintingColorObjects.length === 0 ? (
                              <span className="text-slate-400">--- Select ---</span>
                            ) : (
                              selectedPrintingColorObjects.map((color) => (
                                <span
                                  key={color.value}
                                  className="inline-flex h-[24px] sm:h-[26px] shrink-0 items-center gap-1.5 sm:gap-2 rounded-[4px] border px-1.5 sm:px-2 shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
                                  style={{ borderColor: color.hex }}
                                >
                                  <span
                                    className="inline-block h-3.5 sm:h-4 w-7 sm:w-10 shrink-0 rounded-[2px]"
                                    style={{ background: color.swatchBackground }}
                                  />
                                  <span className="text-[11px] sm:text-[12px] font-semibold text-slate-700">{color.value}</span>
                                </span>
                              ))
                            )}
                          </div>
                          <ChevronDown
                            size={18}
                            className={`shrink-0 text-slate-500 transition-transform ${printingColorDropdownOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {printingColorDropdownOpen ? (
                          <ul
                            role="listbox"
                            className="absolute left-0 right-0 top-full mt-1 w-full max-h-[220px] sm:max-h-[280px] overflow-y-auto rounded-[6px] border border-[#d1d5db] bg-white py-1 shadow-[0_14px_36px_rgba(15,23,42,0.22)] ring-1 ring-black/5 z-[100]"
                          >
                            {availableTextColorOptions.map((color) => {
                              const isSelected = formData.textColorSelection.includes(color.value);
                              return (
                                <li key={color.value}>
                                  <button
                                    type="button"
                                    onClick={() => handleColorSelect(color.value)}
                                    className={`flex w-full items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 text-left transition-colors cursor-pointer min-h-[38px] ${isSelected ? "bg-[#eef5ff]" : "hover:bg-slate-50"
                                      }`}
                                    role="option"
                                    aria-selected={isSelected}
                                  >
                                    <span
                                      className="inline-block h-4 sm:h-5 w-14 sm:w-20 shrink-0 rounded-[3px] border border-black/10"
                                      style={{ background: color.swatchBackground }}
                                    />
                                    <span className="flex-1 text-xs sm:text-sm font-semibold text-slate-700 truncate">{color.value}</span>
                                    {isSelected ? (
                                      <span className="shrink-0 rounded-full bg-[#1f73ff] p-0.5 text-white">
                                        <Check size={12} strokeWidth={3} />
                                      </span>
                                    ) : null}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}

                        <div className="mt-2 text-[11px] font-bold text-gray-400">
                          {formData.textColorType === "Single color" && "Select any one color"}
                          {formData.textColorType === "Two color" && "Select any two colors"}
                          {formData.textColorType === "Four color" && "Select any four colors"}
                          {formData.textColorType === "Mix color" && "Select multiple colors"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRIVACY PACKING */}
                <div className="rounded-[8px] border border-[#d3d7de] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                  <div className="mb-3 text-[13px] sm:text-[14px] font-extrabold uppercase tracking-wide text-[#111111]">
                    PRIVACY PACKING
                  </div>
                  <div className="flex flex-wrap items-center gap-10 sm:gap-16 py-1">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-[14px] font-semibold text-[#0066cc]">
                      <Lock size={15} className="text-[#0075ff] fill-[#0075ff] shrink-0" />
                      <input
                        type="radio"
                        name="privacy"
                        value="Required"
                        checked={formData.privacy === "Required"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#0075ff] border-gray-400 focus:ring-[#0075ff] cursor-pointer"
                      />
                      <span>Required</span>
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-[14px] font-semibold text-[#0066cc]">
                      <Lock size={15} className="text-[#0075ff] fill-[#0075ff] shrink-0" />
                      <input
                        type="radio"
                        name="privacy"
                        value="Not Required"
                        checked={formData.privacy === "Not Required"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#0075ff] border-gray-400 focus:ring-[#0075ff] cursor-pointer"
                      />
                      <span>Not Required</span>
                    </label>
                  </div>
                </div>

                {/* DELIVERY OPTION */}
                <div className="rounded-[8px] border border-[#d3d7de] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                  <div className="mb-3 text-[14px] font-extrabold uppercase tracking-wide text-[#111111]">Select Delivery Option</div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#1f2937]">
                    <input type="radio" name="deliveryOption" value="Dispatch By Transport" checked={formData.deliveryOption === "Dispatch By Transport"} onChange={handleInputChange} className="h-4 w-4 text-[#1f73ff]" />
                    <Truck size={15} className="text-[#1f73ff]" />
                    Dispatch By Transport
                  </label>
                  <div className="mt-1 text-[12px] text-gray-500">Transport Charges extra as per bilty amount</div>
                </div>

                {/* FREE DELIVERY BANNER */}
                <div className="rounded-[6px] bg-[#eaf1ff] border border-[#c9d9ff] px-4 py-2.5 text-center text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.05em] text-[#12286e] shadow-[0_1px_2px_rgba(18,40,110,0.06)]">
                  CONGRATULATIONS! ORDER'S ELIGIBLE FOR FREE DELIVERY
                </div>

                {/* FILE OPTION & FINANCIAL TABLE CONTAINER */}
                <div className="rounded-[8px] border border-[#d3d7de] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
                  <div className="p-5 border-b border-[#e3e6eb]">
                    <div className="mb-3 text-[14px] font-extrabold uppercase tracking-wide text-[#111111]">SELECT FILE OPTION</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#1f2937]">
                        <input type="radio" name="fileOption" value="Attach File Online" checked={formData.fileOption === "Attach File Online"} onChange={handleInputChange} className="h-4 w-4 text-[#1f73ff]" />
                        <Upload size={15} className="text-[#1f73ff]" />
                        Attach File Online
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#1f2937]">
                        <input type="radio" name="fileOption" value="Send via Email" checked={formData.fileOption === "Send via Email"} onChange={handleInputChange} className="h-4 w-4 text-[#1f73ff]" />
                        <Mail size={15} className="text-[#1f73ff]" />
                        Send via Email
                      </label>
                    </div>
                    {formData.fileOption === "Attach File Online" ? (
                      <div
                        className={`mt-4 rounded-[8px] border-2 border-dashed p-4 text-center transition ${dragActive ? "border-[#1f73ff] bg-blue-50" : "border-[#d8d8d8] bg-[#fafafa]"}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                        <Upload className="mx-auto mb-3 text-[#1f73ff]" size={24} />
                        <div className="text-sm font-semibold text-[#1f2937]">Drag & drop your file here</div>
                        <div className="mt-1 text-xs text-gray-500">PDF, CDR, PSD, JPEG, JPG, PNG up to 100MB</div>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 rounded bg-[#1f73ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d62f1] shadow-xs">
                          Browse File
                        </button>
                        {formData.fileName ? (
                          <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-green-700">
                            <CheckCircle size={16} />
                            {formData.fileName}
                            <button type="button" onClick={() => setFormData((prev) => ({ ...prev, fileName: "", fileUrl: "" }))} className="rounded-full p-1 text-red-500 hover:bg-red-50">
                              <X size={14} />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : formData.fileOption === "Send via Email" ? (
                      <div className="mt-4 rounded-[8px] bg-[#fff9ef] border border-[#ffe4ba] p-4 text-sm text-[#9a5b00]">
                        Send file to <span className="font-bold">direct@printersclub.in</span> (Extra Charges - Rs.10.00 is applicable)
                      </div>
                    ) : null}
                  </div>

                  {/* FINANCIAL SUMMARY TABLE */}
                  <div className="divide-y divide-[#e3e6eb]">
                    <div className="flex items-center gap-4 sm:gap-6 px-5 py-2 text-[14px] text-[#374151]">
                      <span className="w-[170px] shrink-0">Applicable Cost</span>
                      <span className="font-bold text-[#111827]">Rs. {displayedBagCost.toFixed(2)}/-</span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 px-5 py-2 text-[14px] text-[#374151]">
                      <span className="w-[170px] shrink-0">GST ({GST_PERCENT_LABEL})</span>
                      <span className="font-bold text-[#111827]">Rs. {displayedGst.toFixed(2)}/-</span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 px-5 py-2 text-[15px] sm:text-[16px] font-bold text-[#111827]">
                      <span className="w-[170px] shrink-0">Amount Payable</span>
                      <span className="font-extrabold text-[#1f73ff]">Rs. {displayedPayableAmount.toFixed(2)}/-</span>
                    </div>
                    <input type="hidden" name="sellingPrice" value={formData.sellingPrice} />

                    {/* Special Remark */}
                    <div className="px-5 py-4">
                      <label className="mb-2 block text-[13px] sm:text-[14px] font-extrabold uppercase tracking-wide text-[#111111]">Special Remark (Optional)</label>
                      <textarea name="remark" value={formData.remark} onChange={handleInputChange} rows={3} placeholder="remarks for order processing team..." className="w-full rounded-[4px] border border-[#d8d8d8] bg-[#f7f7f7] p-3 text-sm text-[#222222] placeholder:text-[#999999] outline-none transition focus:border-[#1f73ff] focus:bg-white" />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON CONTAINER */}
                  <div className="p-5">
                    {statusMessage.text ? <div className={`mb-4 rounded-[6px] px-4 py-3 text-sm font-medium ${statusMessage.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{statusMessage.text}</div> : null}

                    <button type="submit" disabled={loading} className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#0075ff] text-[15px] font-bold uppercase tracking-wide text-white transition hover:bg-[#0060df] active:bg-[#0052c2] shadow-sm disabled:cursor-not-allowed disabled:opacity-70">
                      {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                      {knownWalletBalance !== null ? "Add Order (Pay From Wallet)" : "Add Order"}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </form>

          {hasBagSize ? (
            <div className="space-y-6">
              {!usesDeferredDescriptionImage && shouldShowDescriptionImage ? (
                <div className="overflow-hidden rounded-[8px] border border-[#d6d8de] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                  <div
                    className={[
                      "flex items-center justify-center bg-white p-5",
                      hasExpandedDescriptionImage ? "h-[320px] sm:h-[380px] lg:h-[440px]" : "h-[280px] sm:h-[330px]"
                    ].join(" ")}
                  >
                    <img src={descriptionImage} alt={product.title} className="max-h-full max-w-full object-contain object-center" />
                  </div>
                </div>
              ) : null}

              {usesDeferredDescriptionImage && shouldShowDescriptionImage ? (
                <div className="overflow-hidden rounded-[8px] border border-[#d6d8de] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                  <div
                    className={[
                      "flex items-center justify-center bg-white p-5",
                      hasExpandedDescriptionImage ? "h-[320px] sm:h-[380px] lg:h-[440px]" : "h-[280px] sm:h-[330px]"
                    ].join(" ")}
                  >
                    <img src={descriptionImage} alt={product.title} className="max-h-full max-w-full object-contain object-center" />
                  </div>
                </div>
              ) : null}

              {/* Info Sections Container with Vertical Blue Left Accent */}
              <div className="space-y-6 border-l-[4px] border-[#2d58a5] pl-4 sm:pl-5">
                <section>
                  <h2 className="mb-3 text-[17px] sm:text-[18px] font-bold text-[#183b8f] underline decoration-[#183b8f]/40 underline-offset-4">Product Description</h2>
                  {hasDetailedProductDescription ? (
                    <ul className="space-y-1.5 text-[13px] sm:text-[14px] leading-6 text-[#475569]">
                      {product.descriptionRows.map((item) => (
                        <li key={item.label}>
                          <strong className="text-[#1e293b]">{item.label} :</strong> {item.value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-1.5 text-[13px] sm:text-[14px] leading-6 text-[#475569]">
                      <li><strong className="text-[#1e293b]">Product Ref. :</strong> {product.productRef}</li>
                      <li><strong className="text-[#1e293b]">Product Code :</strong> {product.productCode}</li>
                      <li><strong className="text-[#1e293b]">Product Class :</strong> {product.productClass}</li>
                      <li><strong className="text-[#1e293b]">Product Core :</strong> {product.core}</li>
                      <li><strong className="text-[#1e293b]">Paper Quality :</strong> {product.material}</li>
                      <li><strong className="text-[#1e293b]">Production Time :</strong> {product.productionTime}</li>
                    </ul>
                  )}
                </section>

                <section>
                  <h2 className="mb-3 text-[17px] sm:text-[18px] font-bold text-[#183b8f] underline decoration-[#183b8f]/40 underline-offset-4">Our Specialization</h2>
                  {hasDetailedProductDescription ? (
                    <ul className="list-disc space-y-1.5 pl-5 text-[13px] sm:text-[14px] leading-6 text-[#475569]">
                      {product.specializationPoints.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="list-disc space-y-1.5 pl-5 text-[13px] sm:text-[14px] leading-6 text-[#475569]">
                      <li>We are India's trusted bag printing manufacturing partner.</li>
                      <li>Printing with latest machines and quality finishing unit.</li>
                      <li>Innovative, advanced and equipped post-printing process.</li>
                      <li>Constant quality with reasonable price and reliable delivery.</li>
                    </ul>
                  )}
                </section>

                <section>
                  <h2 className="mb-3 text-[17px] sm:text-[18px] font-bold text-[#183b8f] underline decoration-[#183b8f]/40 underline-offset-4">{hasDetailedProductDescription ? "Product Features" : "Product Specialization"}</h2>
                  <ul className="list-disc space-y-1.5 pl-5 text-[13px] sm:text-[14px] leading-6 text-[#475569]">
                    {(hasDetailedProductDescription ? product.featurePoints : product.highlights).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="mb-3 text-[17px] sm:text-[18px] font-bold text-[#183b8f] underline decoration-[#183b8f]/40 underline-offset-4">{hasDetailedProductDescription ? "Important Notes" : "Points to be Noted"}</h2>
                  {hasDetailedProductDescription ? (
                    <div className="space-y-3 text-[13px] sm:text-[14px] leading-6 text-[#475569]">
                      <div>
                        <p className="font-bold text-[#1e293b]">Size Specifications</p>
                        {product.importantNotes.sizeSpecifications.map((item) => (
                          <p key={item.label}>
                            {item.label}: <span className="font-bold text-[#ef4444]">{item.value}</span>
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="font-bold text-[#1e293b]">Printing Guidelines</p>
                        <ul className="list-disc space-y-1.5 pl-5">
                          {product.importantNotes.printingGuidelines.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-[13px] sm:text-[14px] leading-6 text-[#475569]">
                      <p className="font-bold text-[#1e293b]">Size Must be as below:</p>
                      <p>Full Design Size: <span className="font-bold text-[#ef4444]">W: 93.00 mm X H: 56.00 mm</span></p>
                      <p>Maximum Text Area: <span className="font-bold text-[#ef4444]">W: 82.00 mm X H: 45.00 mm</span></p>
                      <p>Final Size After Cutting: <span className="font-bold text-[#ef4444]">W: 90.00 mm x H: 53.00 mm</span></p>
                      <ul className="list-disc space-y-1.5 pl-5 mt-2">
                        <li>Use high-resolution artwork for the clearest and sharpest results.</li>
                        <li>Color saturation may vary slightly depending on bag color and print combination.</li>
                        <li>Delivery and transport charges are extra and based on dispatch mode.</li>
                      </ul>
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
