import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Mail,
  Palette,
  Ruler,
  ShoppingBag,
  Truck,
  Upload,
  Wallet,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import { getAuthSession, saveAuthSession } from "../../utils/auth.js";
import boxBagImage from "../../assets/images/BoxBag.png";
import dCutImage from "../../assets/images/D_Cut.png";
import loopBagImage from "../../assets/images/LoopBag.png";

const bagCatalog = {
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

const bagSizes = ["10 X 12", "12 X 14", "14 X 16", "16 X 20"];
const bagColors = ["Red", "Green", "Yellow", "White", "Blue", "Black"];
const textColorTypes = ["Single color", "Two color", "Multi color"];
const textColorOptions = ["Red", "Green", "Blue", "Black", "White", "Golden", "Silver", "Cyan", "Magenta", "Yellow"];

export default function AssociateNonWovenBagOrderPage() {
  const navigate = useNavigate();
  const { bagSlug } = useParams();
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { submitOrder } = useAssociateModule();
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [pricePerBag] = useState(5);

  const product = bagCatalog[bagSlug] || bagCatalog["d-cut-bag"];

  const [formData, setFormData] = useState({
    printingPress: "Direct Order",
    orderName: "",
    bagType: "One side",
    quantity: 1000,
    bagSize: "10 X 12",
    bagColor: "Red",
    textColorType: "Single color",
    textColorSelection: [],
    privacy: "Not Required",
    deliveryOption: "Dispatch By Transport",
    fileOption: "Attach File Online",
    fileName: "",
    fileUrl: "",
    sellingPrice: 0,
    remark: "",
    pressline: "Sandeep Printers"
  });

  const [costs, setCosts] = useState({
    applicableCost: 0,
    gst: 0,
    totalAmount: 0
  });

  const uploadedDesignType = useMemo(() => {
    if (!formData.fileName || !formData.fileName.includes(".")) return "";
    return formData.fileName.split(".").pop().trim().toUpperCase();
  }, [formData.fileName]);

  const pdfDiscountAmount = useMemo(
    () => (formData.fileOption === "Attach File Online" && uploadedDesignType === "PDF" ? 10 : 0),
    [formData.fileOption, uploadedDesignType]
  );

  useEffect(() => {
    const base = Number(formData.quantity || 0) * pricePerBag;
    const privacyCharge = formData.privacy === "Required" ? 100 : 0;
    const emailCharge = formData.fileOption === "Send via Email" ? 100 : 0;
    const actualPrice = base + privacyCharge + emailCharge;
    const applicableCost = actualPrice * 0.7;
    const gst = applicableCost * 0.18;
    const totalAmount = applicableCost + gst;

    setCosts({ applicableCost, gst, totalAmount });
    setFormData((prev) => ({ ...prev, sellingPrice: actualPrice }));
  }, [formData.quantity, formData.privacy, formData.fileOption, pricePerBag]);

  const printingTypeValue = useMemo(
    () => (formData.bagType === "Both sides" ? "double-side" : "single-side"),
    [formData.bagType]
  );
  const basePayableAmount = useMemo(() => Number(costs.totalAmount.toFixed(2)), [costs.totalAmount]);
  const payableAmount = useMemo(() => Number(Math.max(basePayableAmount - pdfDiscountAmount, 0).toFixed(2)), [basePayableAmount, pdfDiscountAmount]);
  const knownWalletBalance = useMemo(() => {
    const parsedBalance = Number(user?.walletBalance);
    return Number.isFinite(parsedBalance) ? parsedBalance : null;
  }, [user?.walletBalance]);
  const derivedCustomerName = String(user?.ownerName || user?.businessName || "").trim();
  const derivedCustomerMobile = String(user?.mobile || user?.mobileNumber || "").trim();
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
      `Valid PDF: ${uploadedDesignType === "PDF" ? "Yes" : "No"}`,
      `PDF Discount: Rs. ${pdfDiscountAmount}`,
      `Final Payable: Rs. ${payableAmount.toFixed(2)}`
    ].join(" | ");
  }, [
    product.title,
    formData.bagType,
    formData.quantity,
    formData.bagSize,
    formData.bagColor,
    formData.textColorType,
    formData.textColorSelection,
    formData.privacy,
    formData.deliveryOption,
    formData.printingPress,
    pdfDiscountAmount,
    payableAmount,
    uploadedDesignType
  ]);

  function handleInputChange(event) {
    const { name, value } = event.target;
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
    } else {
      selected.push(color);
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

    fetch("/api/uploads/design", {
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

    if (!Number.isFinite(quantity) || quantity < 1000) {
      setStatusMessage({ type: "error", text: "Quantity must be at least 1000." });
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

    if (formData.textColorType === "Multi color" && selectedColorCount < 1) {
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
      setStatusMessage({ type: "error", text: "Associate profile details are missing. Please update your profile." });
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
        navigate("/dashboard/associate-member/book-order");
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
            onClick={() => navigate("/dashboard/associate-member/book-order/non-woven-bag")}
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
                <option>Sandeep Printers</option>
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

            <div className="overflow-hidden rounded-[8px] border border-[#d9d9d9] bg-white shadow-sm">
              <div className="border-b border-[#e6e6e6] p-4 text-[17px] font-bold text-[#12286e]">Select Detail</div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ededed] p-4">
                <div className="flex w-[150px] items-center gap-3 font-semibold text-gray-700">
                  <ShoppingBag size={18} className="text-[#1f73ff]" />
                  Bag Type
                </div>
                <select
                  name="bagType"
                  value={formData.bagType}
                  onChange={handleInputChange}
                  className="h-[40px] flex-1 rounded-[5px] border border-[#d8d8d8] bg-white px-3 text-sm outline-none"
                >
                  <option value="One side">One side</option>
                  <option value="Both sides">Both sides</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ededed] p-4">
                <div className="flex w-[150px] items-center gap-3 font-semibold text-gray-700">
                  <FileText size={18} className="text-[#1f73ff]" />
                  Quantity
                </div>
                <div className="flex flex-1 items-center gap-4">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1000"
                    className="h-[40px] w-[110px] rounded-[5px] border border-[#d8d8d8] px-3 text-center outline-none focus:border-[#1f73ff]"
                  />
                  <span className="text-[13px] text-[#5f8dff]">(Min Qty. : 1000)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ededed] p-4">
                <div className="flex w-[150px] items-center gap-3 font-semibold text-gray-700">
                  <Ruler size={18} className="text-[#1f73ff]" />
                  Bag Size
                </div>
                <select
                  name="bagSize"
                  value={formData.bagSize}
                  onChange={handleInputChange}
                  className="h-[40px] flex-1 rounded-[5px] border border-[#d8d8d8] bg-white px-3 text-sm outline-none"
                >
                  {bagSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ededed] p-4">
                <div className="flex w-[150px] items-center gap-3 font-semibold text-gray-700">
                  <Palette size={18} className="text-[#1f73ff]" />
                  Bag Color
                </div>
                <select
                  name="bagColor"
                  value={formData.bagColor}
                  onChange={handleInputChange}
                  className="h-[40px] flex-1 rounded-[5px] border border-[#d8d8d8] bg-white px-3 text-sm outline-none"
                >
                  {bagColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ededed] p-4">
                <div className="flex w-[150px] items-center gap-3 font-semibold text-gray-700">
                  <Palette size={18} className="text-[#1f73ff]" />
                  Text Color Type
                </div>
                <select
                  name="textColorType"
                  value={formData.textColorType}
                  onChange={(event) => {
                    handleInputChange(event);
                    setFormData((prev) => ({ ...prev, textColorSelection: [] }));
                  }}
                  className="h-[40px] flex-1 rounded-[5px] border border-[#d8d8d8] bg-white px-3 text-sm outline-none"
                >
                  {textColorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ededed] p-4">
                <div className="mt-2 flex w-[150px] items-center gap-3 font-semibold text-gray-700">
                  <Palette size={18} className="text-[#1f73ff]" />
                  Text Color
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {textColorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                          formData.textColorSelection.includes(color)
                            ? "border-[#1f73ff] bg-[#1f73ff] text-white shadow-sm"
                            : "border-gray-200 bg-white text-gray-500 hover:border-[#1f73ff] hover:text-[#1f73ff]"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-gray-400">
                    {formData.textColorType === "Single color" && "Select any one color"}
                    {formData.textColorType === "Two color" && "Select any two colors"}
                    {formData.textColorType === "Multi color" && "Select multiple colors"}
                  </div>
                </div>
              </div>

              <div className="border-b border-[#ededed] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[15px] font-bold text-[#12286e]">Privacy Packing</div>
                  {formData.privacy === "Required" ? <span className="animate-pulse text-[11px] font-bold text-[#1f73ff]">(+ Rs. 100/- Privacy Charge)</span> : null}
                </div>
                <div className="flex gap-10">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input type="radio" name="privacy" value="Required" checked={formData.privacy === "Required"} onChange={handleInputChange} className="h-4 w-4 text-[#1f73ff]" />
                    <AlertCircle size={14} className="text-[#1f73ff]" />
                    Required
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input
                      type="radio"
                      name="privacy"
                      value="Not Required"
                      checked={formData.privacy === "Not Required"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#1f73ff]"
                    />
                    <AlertCircle size={14} className="text-[#1f73ff]" />
                    Not Required
                  </label>
                </div>
              </div>

              <div className="border-b border-[#ededed] p-4">
                <div className="mb-3 text-[15px] font-bold text-[#12286e]">Select Delivery Option</div>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="Dispatch By Transport"
                    checked={formData.deliveryOption === "Dispatch By Transport"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#1f73ff]"
                  />
                  <Truck size={14} className="text-[#1f73ff]" />
                  Dispatch By Transport
                </label>
                <div className="mt-1 text-[12px] text-gray-500">Transport Charges extra as per bilty amount</div>
              </div>

              <div className="border-b border-[#ededed] p-4">
                <div className="mb-3 text-[15px] font-bold text-[#12286e]">Select File Option</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input
                      type="radio"
                      name="fileOption"
                      value="Attach File Online"
                      checked={formData.fileOption === "Attach File Online"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#1f73ff]"
                    />
                    <Upload size={14} className="text-[#1f73ff]" />
                    Attach File Online
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input
                      type="radio"
                      name="fileOption"
                      value="Send via Email"
                      checked={formData.fileOption === "Send via Email"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#1f73ff]"
                    />
                    <Mail size={14} className="text-[#1f73ff]" />
                    Send via Email
                  </label>
                </div>

                {formData.fileOption === "Attach File Online" ? (
                  <div
                    className={`mt-4 rounded-[8px] border-2 border-dashed p-4 text-center transition ${
                      dragActive ? "border-[#1f73ff] bg-blue-50" : "border-[#d8d8d8] bg-[#fafafa]"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                    <Upload className="mx-auto mb-3 text-[#1f73ff]" size={24} />
                    <div className="text-sm font-semibold">Drag & drop your file here</div>
                    <div className="mt-1 text-xs text-gray-500">PDF, CDR, PSD, JPEG, JPG, PNG up to 100MB</div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 rounded bg-[#1f73ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d62f1]"
                    >
                      Browse File
                    </button>
                    {formData.fileName ? (
                      <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-green-700">
                        <CheckCircle size={16} />
                        {formData.fileName}
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, fileName: "", fileUrl: "" }))}
                          className="rounded-full p-1 text-red-500 hover:bg-red-50"
                        >
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
                  <span>Applicable Cost</span>
                  <span className="font-bold">Rs. {costs.applicableCost.toFixed(2)}/-</span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-[15px]">
                  <span>GST (18.00%)</span>
                  <span className="font-bold">Rs. {costs.gst.toFixed(2)}/-</span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-[15px]">
                  <span>Valid PDF</span>
                  <span className={`font-bold ${uploadedDesignType === "PDF" ? "text-[#059669]" : "text-[#64748b]"}`}>
                    {uploadedDesignType === "PDF" ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 text-[15px]">
                  <span>PDF Discount</span>
                  <span className="font-bold text-[#059669]">Rs. {pdfDiscountAmount.toFixed(2)}/-</span>
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between text-[16px]">
                    <span>Amount Payable</span>
                    <span className="font-bold text-[#1f73ff]">Rs. {payableAmount.toFixed(2)}/-</span>
                  </div>
                  <div className="mt-1 text-[12px] text-red-500">Transportation / Delivery extra.</div>
                  {knownWalletBalance !== null ? (
                    <div className="mt-2 text-[12px] font-semibold text-[#12286e]">Available Wallet Balance: Rs. {knownWalletBalance.toFixed(2)}/-</div>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 px-4 py-4">
                  <Wallet size={18} className="text-[#1f73ff]" />
                  <span className="text-[15px]">Selling Price</span>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    className="h-[40px] w-[120px] rounded-[5px] border border-[#d8d8d8] px-3 outline-none"
                  />
                  <span className="font-semibold">Rs.</span>
                </div>
                <div className="px-4 py-4">
                  <div className="mb-2 text-[15px] font-semibold">Special Remark (Optional)</div>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="remarks for order processing team..."
                    className="w-full rounded-[5px] border border-[#d8d8d8] px-3 py-2 outline-none focus:border-[#1f73ff]"
                  />
                </div>
                <div className="px-4 py-4">
                  <div className="mb-2 text-[15px] font-semibold">Enter Pressline</div>
                  <div className="mb-1 text-[12px] text-red-500">To be Printed on Free Gift</div>
                  <input
                    type="text"
                    name="pressline"
                    value={formData.pressline}
                    onChange={handleInputChange}
                    className="h-[42px] w-full rounded-[5px] border border-[#d8d8d8] px-3 outline-none focus:border-[#1f73ff]"
                  />
                </div>
              </div>

              <div className="p-4">
                {statusMessage.text ? (
                  <div
                    className={`mb-4 rounded-[8px] px-4 py-3 text-sm ${
                      statusMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#1677f2] text-[15px] font-bold text-white transition hover:bg-[#0d62f1] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  Add Order (Pay From Wallet)
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-8 rounded-[14px] border-l-4 border-[#2d58a5] bg-white/70 p-6 shadow-sm">
            <div className="overflow-hidden rounded-[12px] bg-white shadow-sm">
              <div className="flex h-[320px] items-center justify-center bg-white p-4 sm:h-[360px]">
                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain object-center" />
              </div>
            </div>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">Product Description</h2>
              <ul className="space-y-2 text-[15px] leading-7 text-[#5b5f79]">
                <li><strong>Product Ref. :</strong> {product.productRef}</li>
                <li><strong>Product Code :</strong> {product.productCode}</li>
                <li><strong>Product Class :</strong> {product.productClass}</li>
                <li><strong>Product Core :</strong> {product.core}</li>
                <li><strong>Paper Quality :</strong> {product.material}</li>
                <li><strong>Production Time :</strong> {product.productionTime}</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">Our Specialization</h2>
              <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#5b5f79]">
                <li>We are India's trusted bag printing manufacturing partner.</li>
                <li>Printing with latest machines and quality finishing unit.</li>
                <li>Innovative, advanced and equipped post-printing process.</li>
                <li>Constant quality with reasonable price and reliable delivery.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">Product Specialization</h2>
              <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#5b5f79]">
                {product.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-bold text-[#12286e] underline">Points to be Noted</h2>
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
