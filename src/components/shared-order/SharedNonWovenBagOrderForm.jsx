import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  Truck,
  Upload,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { buildApiUrl } from "../../lib/apiBaseUrl.js";
import { getAuthSession, saveAuthSession } from "../../utils/auth.js";
import { getDynamicDescriptionImage } from "./dCutDescriptionImages.js";
import { bagCatalog, bagColors, bagSizeOptionsBySlug, bagTypeOptions, blackBagColorOption, getAvailableTextColorOptions, quantityOptions, textColorTypes } from "./sharedOrderData.js";
import { calculateOrderPricing, getBagRate, GST_PERCENT_LABEL } from "./orderPricing.js";

const selectableCardClassName =
  "border bg-white text-left text-[13px] font-medium transition-all";

export default function SharedNonWovenBagOrderForm({ bagSlug, basePath, submitOrder }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const product = bagCatalog[bagSlug] || bagCatalog["d-cut-bag"];
  const sizeOptions = useMemo(() => bagSizeOptionsBySlug[bagSlug] || bagSizeOptionsBySlug["d-cut-bag"], [bagSlug]);
  const defaultBagSize = sizeOptions[0]?.value || "";
  const defaultBagColor = bagColors[0]?.value || "";

  const [formData, setFormData] = useState({
    printingPress: "Direct Order",
    orderName: "",
    bagType: "One side",
    quantity: 1000,
    bagSize: defaultBagSize,
    bagColor: defaultBagColor,
    textColorType: "Single color",
    textColorSelection: [],
    privacy: "Required",
    deliveryOption: "Dispatch By Transport",
    fileOption: "Attach File Online",
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
    const { bagCost, applicableCost, gstAmount, payableBeforeDiscount, privacyCharge, sellingPrice } = calculateOrderPricing({
      quantity: formData.quantity,
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
      const nextBagSize = sizeOptions.some((option) => option.value === prev.bagSize) ? prev.bagSize : defaultBagSize;
      const nextBagColor = bagColors.some((option) => option.value === prev.bagColor) ? prev.bagColor : defaultBagColor;
      const nextQuantity = quantityOptions.includes(Number(prev.quantity)) ? Number(prev.quantity) : 1000;

      if (
        nextBagSize === prev.bagSize &&
        nextBagColor === prev.bagColor &&
        nextQuantity === Number(prev.quantity) &&
        prev.privacy === "Required"
      ) {
        return prev;
      }

      return {
        ...prev,
        bagSize: nextBagSize,
        bagColor: nextBagColor,
        quantity: nextQuantity,
        privacy: "Required"
      };
    });
  }, [defaultBagColor, defaultBagSize, sizeOptions]);

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
  const selectedBagTypeLabel = useMemo(() => {
    if (formData.bagType === "Both sides") return "Both Side";
    return "Single Side";
  }, [formData.bagType]);
  const selectedQuantityLabel = useMemo(() => `${Number(formData.quantity || 0)} pcs`, [formData.quantity]);
  const selectedBagSizeLabel = useMemo(() => String(formData.bagSize || "").replace(/\s+/g, "").toLowerCase(), [formData.bagSize]);
  const derivedOrderDetails = useMemo(() => {
    const colorSelection = formData.textColorSelection.length ? formData.textColorSelection.join(", ") : "Not selected";
    return [
      `Product: ${product.title}`,
      `Bag Type: ${formData.bagType}`,
      `Quantity: ${formData.quantity}`,
      `Size: ${formData.bagSize}`,
      `Bag Color: ${formData.bagColor}`,
      `Text Color Type: ${formData.textColorType}`,
      `Text Colors: ${colorSelection}`,
      `Privacy Packing: ${formData.privacy}`,
      `Delivery Option: ${formData.deliveryOption}`,
      `Printing Press: ${formData.printingPress}`,
      `Final Payable: Rs. ${payableAmount.toFixed(2)}`
    ].join(" | ");
  }, [
    formData.bagType,
    formData.bagColor,
    formData.bagSize,
    formData.deliveryOption,
    formData.printingPress,
    formData.privacy,
    formData.quantity,
    formData.textColorSelection,
    formData.textColorType,
    payableAmount,
    product.title,
    uploadedDesignType
  ]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!formData.printingPress) {
      setStatusMessage({ type: "error", text: "Printing press is required." });
      return;
    }
    if (!trimmedOrderName) {
      setStatusMessage({ type: "error", text: "Order name is required." });
      return;
    }
    if (!formData.bagType || !formData.bagSize || !formData.bagColor || !formData.textColorType || !formData.privacy || !formData.deliveryOption || !formData.fileOption) {
      setStatusMessage({ type: "error", text: "Please select all required order options." });
      return;
    }
    if (!Number.isFinite(quantity) || !quantityOptions.includes(quantity)) {
      setStatusMessage({ type: "error", text: "Please select a valid quantity." });
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
    <div className="min-h-screen bg-[#f4f4f4] py-10 font-sans text-[#222]">
      <div className="mx-auto w-[1200px] max-w-[95%]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(`${basePath}/non-woven-bag`)}
            className="rounded bg-[#1f73ff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d62f1]"
          >
            Back
          </button>
          <h1 className="text-center text-[20px] font-bold uppercase tracking-widest">Add Order</h1>
          <div className="w-[80px]" />
        </div>

        <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-[60px]">
          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="rounded-[10px] border border-[#d9d9d9] bg-white p-[20px] shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-[15px]">
                <div className="text-[14px] font-semibold">Select 'Printing Press'</div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-[38px] w-[180px] rounded-[5px] border border-[#d4d4d4] px-3 text-sm outline-none focus:border-[#1f73ff]"
                />
                <button type="button" className="rounded-[5px] bg-[#1f73ff] px-4 py-[10px] text-[12px] font-bold text-white transition-all hover:bg-[#0d62f1]">
                  Add New Printing Press
                </button>
              </div>
              <select
                name="printingPress"
                value={formData.printingPress}
                onChange={handleInputChange}
                className="h-[42px] w-full rounded-[5px] border border-[#d8d8d8] bg-white px-4 text-sm outline-none"
              >
                <option>Direct Order</option>
                <option>{user?.businessName || user?.ownerName || user?.name || "Sandeep Printers"}</option>
              </select>
            </div>

            <div>
              <div className="mb-3 text-[16px] font-bold uppercase tracking-wide">Order Name</div>
              <input
                type="text"
                name="orderName"
                placeholder="Type customer name here to check order status easily"
                value={formData.orderName}
                onChange={handleInputChange}
                className="h-[45px] w-full rounded-[5px] border border-[#d8d8d8] bg-white px-4 text-sm outline-none focus:border-[#1f73ff]"
              />
            </div>

            <div className="overflow-hidden rounded-[8px] border border-[#d9d9d9] bg-[#f1f1f1] shadow-sm">
              <div className="border-b border-[#e6e6e6] bg-white p-4 text-[17px] font-bold text-[#12286e]">Select Detail</div>

              <div className="space-y-5 p-4">
                <div>
                  <div className="mb-2.5 text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333]">
                    Non Woven Sizes: <span className="font-semibold normal-case text-slate-500">{selectedBagSizeLabel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((option) => {
                      const selected = formData.bagSize === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSelectField("bagSize", option.value)}
                          className={`${selectableCardClassName} h-[36px] min-w-[58px] px-3 py-2 text-center ${
                            selected
                              ? "border-2 border-[#222] text-[#222] shadow-sm"
                              : "border border-[#cfcfcf] text-slate-700 hover:border-[#999]"
                          }`}
                          aria-pressed={selected}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333]">
                    Quantity: <span className="font-semibold normal-case text-slate-500">{selectedQuantityLabel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quantityOptions.map((option) => {
                      const selected = Number(formData.quantity) === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelectField("quantity", option)}
                          className={`${selectableCardClassName} h-[36px] min-w-[80px] px-3 py-2 text-center ${
                            selected
                              ? "border-2 border-[#222] text-[#222] shadow-sm"
                              : "border border-[#cfcfcf] text-slate-700 hover:border-[#999]"
                          }`}
                          aria-pressed={selected}
                        >
                          {option} pcs
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333]">
                    Printing Side: <span className="font-semibold normal-case text-slate-500">{selectedBagTypeLabel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bagTypeOptions.map((option) => {
                      const selected = formData.bagType === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSelectField("bagType", option.value)}
                          className={`${selectableCardClassName} h-[36px] min-w-[104px] px-4 py-2 text-center ${
                            selected
                              ? "border-2 border-[#222] text-[#222] shadow-sm"
                              : "border border-[#cfcfcf] text-slate-700 hover:border-[#999]"
                          }`}
                          aria-pressed={selected}
                        >
                          {option.value === "Both sides" ? "Both Side" : "Single Side"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 text-[14px] font-bold text-slate-600">Bag Color :</div>
                  <div className="flex flex-wrap gap-2">
                    {availableBagColors.map((color) => {
                      const selected = formData.bagColor === color.value;

                      return (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleSelectField("bagColor", color.value)}
                          className={`relative flex h-8 w-8 items-center justify-center border bg-white transition-all ${
                            selected
                              ? "border-[#1ca3ba] ring-2 ring-[#3cc7dc]/30"
                              : `${color.borderClassName} hover:border-[#999]`
                          }`}
                          aria-pressed={selected}
                          title={color.value}
                        >
                          <span className="h-full w-full" style={{ backgroundColor: color.hex }} />
                          {selected ? <span className="absolute text-sm font-bold text-white">✓</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 text-[14px] font-extrabold uppercase tracking-[0.02em] text-[#333]">
                    Text Color Type: <span className="font-semibold normal-case text-slate-500">{formData.textColorType}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                          className={`${selectableCardClassName} h-[36px] min-w-[102px] px-4 py-2 text-center ${
                            selected
                              ? "border-2 border-[#222] text-[#222] shadow-sm"
                              : "border border-[#cfcfcf] text-slate-700 hover:border-[#999]"
                          } ${isLockedPrintingType && !selected ? "cursor-not-allowed opacity-60" : ""}`}
                          aria-pressed={selected}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 text-[14px] font-bold text-slate-600">Text Color :</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {availableTextColorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleColorSelect(color.value)}
                          className={`relative flex h-8 w-8 items-center justify-center border transition-all ${
                            formData.textColorSelection.includes(color.value)
                              ? "border-[#1ca3ba] ring-2 ring-[#3cc7dc]/30"
                              : `${color.borderClassName} hover:border-[#999]`
                          }`}
                          aria-pressed={formData.textColorSelection.includes(color.value)}
                          title={color.value}
                        >
                          <span
                            className="absolute inset-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          {formData.textColorSelection.includes(color.value) ? (
                            <span className={`relative z-10 text-xs font-bold ${color.value === "White" ? "text-slate-700" : "text-white"}`}>✓</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-gray-400">
                      {formData.textColorType === "Single color" && "Select any one color"}
                      {formData.textColorType === "Two color" && "Select any two colors"}
                      {formData.textColorType === "Four color" && "Select any four colors"}
                      {formData.textColorType === "Mix color" && "Select multiple colors"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#ededed] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[15px] font-bold text-[#12286e]">Privacy Packing</div>
                  {formData.privacy === "Required" ? <span className="animate-pulse text-[11px] font-bold text-[#1f73ff]">(+ Rs. 100/- Privacy Charge)</span> : null}
                </div>
                <input type="hidden" name="privacy" value="Required" />
                <div className="max-w-[240px] rounded-[10px] border border-[#1f73ff] bg-[#eff6ff] px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1f4fbf]">
                    <AlertCircle size={16} className="text-[#1f73ff]" />
                    Required
                  </div>
                </div>
              </div>

              <div className="border-b border-[#ededed] p-4">
                <div className="mb-3 text-[15px] font-bold text-[#12286e]">Select Delivery Option</div>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input type="radio" name="deliveryOption" value="Dispatch By Transport" checked={formData.deliveryOption === "Dispatch By Transport"} onChange={handleInputChange} className="h-4 w-4 text-[#1f73ff]" />
                  <Truck size={14} className="text-[#1f73ff]" />
                  Dispatch By Transport
                </label>
                <div className="mt-1 text-[12px] text-gray-500">Transport Charges extra as per bilty amount</div>
              </div>

              <div className="border-b border-[#ededed] p-4">
                <div className="mb-3 text-[15px] font-bold text-[#12286e]">Select File Option</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input type="radio" name="fileOption" value="Attach File Online" checked={formData.fileOption === "Attach File Online"} onChange={handleInputChange} className="h-4 w-4 text-[#1f73ff]" />
                    <Upload size={14} className="text-[#1f73ff]" />
                    Attach File Online
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input type="radio" name="fileOption" value="Send via Email" checked={formData.fileOption === "Send via Email"} onChange={handleInputChange} className="h-4 w-4 text-[#1f73ff]" />
                    <Mail size={14} className="text-[#1f73ff]" />
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
                    <div className="text-sm font-semibold">Drag & drop your file here</div>
                    <div className="mt-1 text-xs text-gray-500">PDF, CDR, PSD, JPEG, JPG, PNG up to 100MB</div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 rounded bg-[#1f73ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d62f1]">
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
                ) : (
                  <div className="mt-4 rounded-[8px] bg-[#fff9ef] p-4 text-sm text-[#9a5b00]">
                    Send file to <span className="font-bold">direct@printersclub.in</span> (Extra Charges - Rs.10.00 is applicable)
                  </div>
                )}
              </div>

              <div className="divide-y divide-[#ededed]">
                <div className="flex items-center justify-between px-4 py-4 text-[15px]">
                  <span>Bag Cost</span>
                  <span className="font-bold">Rs. {costs.bagCost.toFixed(2)}/-</span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-[15px]">
                  <span>Privacy Packing Charge</span>
                  <span className="font-bold">Rs. {costs.privacyCharge.toFixed(2)}/-</span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-[15px]">
                  <span>Applicable Cost</span>
                  <span className="font-bold">Rs. {costs.applicableCost.toFixed(2)}/-</span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-[15px]">
                  <span>GST ({GST_PERCENT_LABEL})</span>
                  <span className="font-bold">Rs. {costs.gst.toFixed(2)}/-</span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-[16px]">
                  <span>Payable Amount</span>
                  <span className="font-bold text-[#1f73ff]">Rs. {payableAmount.toFixed(2)}/-</span>
                </div>
                <div className="px-4 py-4">
                  <div className="mt-1 text-[12px] text-red-500">Transportation / Delivery extra.</div>
                  {knownWalletBalance !== null ? <div className="mt-2 text-[12px] font-semibold text-[#12286e]">Available Wallet Balance: Rs. {knownWalletBalance.toFixed(2)}/-</div> : null}
                </div>
                <input type="hidden" name="sellingPrice" value={formData.sellingPrice} />
                <div className="px-4 py-4">
                  <div className="mb-2 text-[15px] font-semibold">Special Remark (Optional)</div>
                  <textarea name="remark" value={formData.remark} onChange={handleInputChange} rows={3} placeholder="remarks for order processing team..." className="w-full rounded-[5px] border border-[#d8d8d8] px-3 py-2 outline-none focus:border-[#1f73ff]" />
                </div>
                <div className="px-4 py-4">
                  <div className="mb-2 text-[15px] font-semibold">Enter Pressline</div>
                  <div className="mb-1 text-[12px] text-red-500">To be Printed on Free Gift</div>
                  <input type="text" name="pressline" value={formData.pressline} onChange={handleInputChange} className="h-[42px] w-full rounded-[5px] border border-[#d8d8d8] px-3 outline-none focus:border-[#1f73ff]" />
                </div>
              </div>

              <div className="p-4">
                {statusMessage.text ? <div className={`mb-4 rounded-[8px] px-4 py-3 text-sm ${statusMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{statusMessage.text}</div> : null}

                <button type="submit" disabled={loading} className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#1677f2] text-[15px] font-bold text-white transition hover:bg-[#0d62f1] disabled:cursor-not-allowed disabled:opacity-70">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {knownWalletBalance !== null ? "Add Order (Pay From Wallet)" : "Add Order"}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-8 rounded-[14px] border-l-4 border-[#2d58a5] bg-white/70 p-6 shadow-sm">
            <div className="overflow-hidden rounded-[12px] bg-white shadow-sm">
              <div
                className={[
                  "flex items-center justify-center bg-white p-4",
                  hasExpandedDescriptionImage ? "h-[380px] sm:h-[440px] lg:h-[500px]" : "h-[320px] sm:h-[360px]"
                ].join(" ")}
              >
                <img src={descriptionImage} alt={product.title} className="max-h-full max-w-full object-contain object-center" />
              </div>
            </div>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">Product Description</h2>
              {hasDetailedProductDescription ? (
                <ul className="space-y-2 text-[15px] leading-7 text-[#5b5f79]">
                  {product.descriptionRows.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}:</strong> {item.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2 text-[15px] leading-7 text-[#5b5f79]">
                  <li><strong>Product Ref. :</strong> {product.productRef}</li>
                  <li><strong>Product Code :</strong> {product.productCode}</li>
                  <li><strong>Product Class :</strong> {product.productClass}</li>
                  <li><strong>Product Core :</strong> {product.core}</li>
                  <li><strong>Paper Quality :</strong> {product.material}</li>
                  <li><strong>Production Time :</strong> {product.productionTime}</li>
                </ul>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">Our Specialization</h2>
              {hasDetailedProductDescription ? (
                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#5b5f79]">
                  {product.specializationPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#5b5f79]">
                  <li>We are India's trusted bag printing manufacturing partner.</li>
                  <li>Printing with latest machines and quality finishing unit.</li>
                  <li>Innovative, advanced and equipped post-printing process.</li>
                  <li>Constant quality with reasonable price and reliable delivery.</li>
                </ul>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">{hasDetailedProductDescription ? "Product Features" : "Product Specialization"}</h2>
              <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#5b5f79]">
                {(hasDetailedProductDescription ? product.featurePoints : product.highlights).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">{hasDetailedProductDescription ? "Important Notes" : "Points to be Noted"}</h2>
              {hasDetailedProductDescription ? (
                <div className="space-y-4 text-[15px] leading-7 text-[#5b5f79]">
                  <div>
                    <p><strong>Size Specifications</strong></p>
                    {product.importantNotes.sizeSpecifications.map((item) => (
                      <p key={item.label}>
                        {item.label}: <span className="font-bold text-red-500">{item.value}</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    <p><strong>Printing Guidelines</strong></p>
                    <ul className="list-disc space-y-2 pl-5">
                      {product.importantNotes.printingGuidelines.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-[15px] leading-7 text-[#5b5f79]">
                  <p><strong>Size Must be as below:</strong></p>
                  <p>Full Design Size: <span className="font-bold text-red-500">W: 93.00 mm X H: 56.00 mm</span></p>
                  <p>Maximum Text Area: <span className="font-bold text-red-500">W: 82.00 mm X H: 45.00 mm</span></p>
                  <p>Final Size After Cutting: <span className="font-bold text-red-500">W: 90.00 mm x H: 53.00 mm</span></p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Use high-resolution artwork for the clearest and sharpest results.</li>
                    <li>Color saturation may vary slightly depending on bag color and print combination.</li>
                    <li>Delivery and transport charges are extra and based on dispatch mode.</li>
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
