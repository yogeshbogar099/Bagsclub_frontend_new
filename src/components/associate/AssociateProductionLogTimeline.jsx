import { CheckCircle2, Clock3, Printer, UserRound } from "lucide-react";

function formatTimelineDate(value) {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

function getTimelineStageLabel(key) {
  const labels = {
    booked: "Order Booked",
    started: "Process Started",
    printingCompleted: "Printing Completed",
    receivedPacking: "Received For Packing",
    packingCompleted: "Packing Completed",
    dispatched: "Dispatched",
    delivered: "Delivered"
  };
  return labels[key] || key;
}

function getTimelineStatusMeta(status) {
  if (status === "completed") {
    return {
      dot: "border-[#22c55e] bg-[#dcfce7]",
      card: "border-[#d7f5df] bg-white",
      accent: "bg-[#22c55e]",
      badge: "bg-[#eafaf0] text-[#15803d]",
      label: "Completed"
    };
  }

  if (status === "in-progress") {
    return {
      dot: "border-[#f59e0b] bg-[#fff4da]",
      card: "border-[#ffe3b4] bg-white",
      accent: "bg-[#f59e0b]",
      badge: "bg-[#fff4da] text-[#c2410c]",
      label: "In Progress"
    };
  }

  return {
    dot: "border-[#6366f1] bg-[#eef2ff]",
    card: "border-[#e2e8f4] bg-white",
    accent: "bg-[#cbd5e1]",
    badge: "bg-[#f1f5f9] text-[#64748b]",
    label: "Pending"
  };
}

function buildProductionTimeline(order) {
  const statusEntries = Array.isArray(order?.statusHistory) ? [...order.statusHistory] : [];
  const dispatchEntries = Array.isArray(order?.dispatchHistory) ? [...order.dispatchHistory] : [];
  statusEntries.sort((left, right) => new Date(left.changedAt).getTime() - new Date(right.changedAt).getTime());
  dispatchEntries.sort((left, right) => new Date(left.eventAt).getTime() - new Date(right.eventAt).getTime());

  const firstStatus = statusEntries[0] || null;
  const printingEntry = statusEntries.find((entry) => entry.statusValue === "printing") || null;
  const packagingEntry = statusEntries.find((entry) => entry.statusValue === "packaging") || null;
  const dispatchedEntry = dispatchEntries[0] || statusEntries.find((entry) => entry.statusValue === "dispatched") || null;
  const completedEntry = statusEntries.find((entry) => entry.statusValue === "completed") || null;

  const currentStatusValue = String(order?.statusValue || order?.currentStatusValue || order?.status || "")
    .trim()
    .toLowerCase();

  const stageCompletion = {
    booked: Boolean(firstStatus || order?.orderDateTime || order?.dateTime),
    started: Boolean(printingEntry),
    printingCompleted: Boolean(packagingEntry || dispatchedEntry || completedEntry),
    receivedPacking: Boolean(packagingEntry),
    packingCompleted: Boolean(dispatchedEntry || completedEntry),
    dispatched: Boolean(dispatchedEntry),
    delivered: Boolean(completedEntry || order?.deliveryDateTime)
  };

  const currentStageKey =
    currentStatusValue === "printing"
      ? "started"
      : currentStatusValue === "packaging"
        ? "receivedPacking"
        : currentStatusValue === "dispatched"
          ? "dispatched"
          : currentStatusValue === "completed"
            ? "delivered"
            : "booked";

  const timeline = [
    {
      key: "booked",
      occurredAt: firstStatus?.changedAt || order?.orderDateTime || order?.dateTime || order?.createdAt,
      operator: firstStatus?.changedByName || order?.placedByUser?.name || order?.placedByUser?.businessName || "System",
      log: firstStatus?.note || "Order created and queued for production."
    },
    {
      key: "started",
      occurredAt: printingEntry?.changedAt || null,
      operator: printingEntry?.changedByName || "Production Team",
      log: printingEntry?.note || "Production process started for the assigned order."
    },
    {
      key: "printingCompleted",
      occurredAt: packagingEntry?.changedAt || dispatchedEntry?.eventAt || dispatchedEntry?.changedAt || completedEntry?.changedAt || null,
      operator:
        packagingEntry?.changedByName ||
        dispatchedEntry?.updatedByName ||
        dispatchedEntry?.changedByName ||
        completedEntry?.changedByName ||
        "Production Team",
      log: "Printing completed and artwork moved to the next handling stage."
    },
    {
      key: "receivedPacking",
      occurredAt: packagingEntry?.changedAt || null,
      operator: packagingEntry?.changedByName || "Packing Unit",
      log: packagingEntry?.note || "Order received for packing and finishing."
    },
    {
      key: "packingCompleted",
      occurredAt: dispatchedEntry?.eventAt || dispatchedEntry?.changedAt || completedEntry?.changedAt || null,
      operator: dispatchedEntry?.updatedByName || dispatchedEntry?.changedByName || completedEntry?.changedByName || "Packing Unit",
      log: dispatchedEntry?.note || "Packing completed and order moved for dispatch."
    },
    {
      key: "dispatched",
      occurredAt: dispatchedEntry?.eventAt || dispatchedEntry?.changedAt || null,
      operator: dispatchedEntry?.updatedByName || dispatchedEntry?.changedByName || "Dispatch Team",
      log: dispatchedEntry?.note || order?.dispatchNotes || "Order dispatched from the production facility."
    },
    {
      key: "delivered",
      occurredAt: completedEntry?.changedAt || order?.deliveryDateTime || null,
      operator: completedEntry?.changedByName || "System",
      log: completedEntry?.note || "Order marked as delivered / completed."
    }
  ];

  return timeline.map((entry) => {
    let stageStatus = "pending";
    if (stageCompletion[entry.key]) {
      stageStatus = "completed";
    } else if (entry.key === currentStageKey) {
      stageStatus = "in-progress";
    }

    if (currentStatusValue === "pending" && entry.key === "booked") {
      stageStatus = "in-progress";
    }

    return {
      ...entry,
      title: getTimelineStageLabel(entry.key),
      displayTime: formatTimelineDate(entry.occurredAt),
      statusMeta: getTimelineStatusMeta(stageStatus)
    };
  });
}

export default function AssociateProductionLogTimeline({ order, title = "Production Log", showOrderNumber = true }) {
  const productionTimeline = buildProductionTimeline(order || {});

  return (
    <div className="rounded-[24px] border border-[#dde3ee] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#71809b]">
          <Printer size={14} className="text-[#7c4dff]" />
          {title}
        </div>
        {showOrderNumber ? (
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#94a3b8]">Order #{order?.orderNumber || "--"}</div>
        ) : null}
      </div>

      <div className="relative mt-6">
        <div className="absolute bottom-0 left-[10px] top-0 w-[3px] rounded-full bg-[#e2e8f0]" />
        <div className="space-y-4">
          {productionTimeline.map((item) => (
            <div key={item.key} className="relative pl-9">
              <div className={`absolute left-0 top-5 h-5 w-5 rounded-full border-[3px] ${item.statusMeta.dot}`} />
              <div className={`overflow-hidden rounded-[18px] border ${item.statusMeta.card} shadow-sm`}>
                <div className="grid gap-4 px-4 py-4 lg:grid-cols-[240px_180px_1fr_120px] lg:items-center">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-1 rounded-full ${item.statusMeta.accent}`} />
                    <div className="min-w-0">
                      <div className="text-[15px] font-black uppercase tracking-tight text-[#1f2937]">{item.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#64748b]">
                        <UserRound size={14} />
                        <span className="truncate">{item.operator}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b]">
                    <Clock3 size={14} />
                    <span>{item.displayTime}</span>
                  </div>
                  <div className="rounded-[12px] bg-[#f6f7fc] px-4 py-3 text-sm leading-6 text-[#334155]">{item.log}</div>
                  <div className="flex lg:justify-end">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${item.statusMeta.badge}`}>
                      <CheckCircle2 size={13} />
                      {item.statusMeta.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
