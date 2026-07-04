function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapePdfText(value = "") {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function sanitizeFileName(value = "order-records") {
  return String(value || "order-records")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "order-records";
}

function triggerBlobDownload(blob, fileName) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function buildSearchText(row = {}) {
  return [
    row.orderNumber,
    row.dateTime,
    row.orderName,
    row.createdBy,
    row.orderDetail,
    row.status,
    row.fileType,
    row.fileSource
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function buildPdfDocument(lines = []) {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginTop = 44;
  const marginBottom = 44;
  const lineHeight = 14;
  const usableHeight = pageHeight - marginTop - marginBottom;
  const maxLinesPerPage = Math.max(1, Math.floor(usableHeight / lineHeight));
  const chunks = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    chunks.push(lines.slice(index, index + maxLinesPerPage));
  }

  const objectBodies = [];
  const pageRefs = [];

  chunks.forEach((pageLines) => {
    const pageObjectNumber = objectBodies.length + 3;
    const contentObjectNumber = pageObjectNumber + 1;
    pageRefs.push(`${pageObjectNumber} 0 R`);

    const commands = pageLines
      .map((line, lineIndex) => {
        const y = pageHeight - marginTop - lineIndex * lineHeight;
        return `BT /F1 10 Tf 40 ${y} Td (${escapePdfText(line)}) Tj ET`;
      })
      .join("\n");

    objectBodies.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${
        chunks.length * 2 + 3
      } 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`
    );
    objectBodies.push(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`);
  });

  objectBodies.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Count ${chunks.length} /Kids [${pageRefs.join(" ")}] >>`,
    ...objectBodies
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function normalizeExportValue(value) {
  if (value === null || value === undefined || value === "") return "--";
  if (Array.isArray(value)) {
    const filtered = value.filter((item) => item !== null && item !== undefined && item !== "");
    return filtered.length ? filtered.join(", ") : "--";
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (_error) {
      return String(value);
    }
  }
  return String(value);
}

function resolveExportColumns(columns = [], items = []) {
  if (Array.isArray(columns) && columns.length) {
    return columns
      .filter((column) => column?.key)
      .map((column) => ({
        key: column.key,
        label: column.label || column.key
      }));
  }

  const firstItem = Array.isArray(items) && items.length ? items[0] : null;
  if (!firstItem) return [];

  return Object.keys(firstItem).map((key) => ({
    key,
    label: key
  }));
}

export function filterOrderTableItems(items = [], searchQuery = "") {
  const normalizedQuery = String(searchQuery || "").trim().toLowerCase();
  if (!normalizedQuery) return items;
  return items.filter((row) => buildSearchText(row).includes(normalizedQuery));
}

export function filterGenericTableItems(items = [], searchQuery = "", keys = []) {
  const normalizedQuery = String(searchQuery || "").trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) => {
    const targetKeys = Array.isArray(keys) && keys.length ? keys : Object.keys(item || {});
    const haystack = targetKeys
      .map((key) => item?.[key])
      .filter((value) => value !== null && value !== undefined)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function downloadOrderRowsAsExcel(items = [], fileBaseName = "order-records") {
  const rows = Array.isArray(items) ? items : [];
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
      th, td { border: 1px solid #111827; padding: 8px; font-size: 12px; text-align: left; vertical-align: top; }
      th { background: #111827; color: #ffffff; font-weight: 700; }
      tr:nth-child(even) td { background: #f3f4f6; }
    </style>
  </head>
  <body>
    <table>
      <thead>
        <tr>
          <th>Order No.</th>
          <th>Date</th>
          <th>Order Name</th>
          <th>Created By</th>
          <th>Order Detail</th>
          <th>Status</th>
          <th>File Type</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `<tr>
              <td>${escapeHtml(row.orderNumber || "--")}</td>
              <td>${escapeHtml(row.dateTime || "--")}</td>
              <td>${escapeHtml(row.orderName || "--")}</td>
              <td>${escapeHtml(row.createdBy || "--")}</td>
              <td>${escapeHtml(row.orderDetail || "--")}</td>
              <td>${escapeHtml(row.status || "--")}</td>
              <td>${escapeHtml(row.fileType || row.fileSource || "--")}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>`;

  triggerBlobDownload(
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }),
    `${sanitizeFileName(fileBaseName)}.xls`
  );
}

export function downloadOrderRowsAsPdf(items = [], fileBaseName = "order-records", title = "Order Records") {
  const rows = Array.isArray(items) ? items : [];
  const lines = [
    title,
    `Generated On: ${new Date().toLocaleString()}`,
    `Total Records: ${rows.length}`,
    "------------------------------------------------------------"
  ];

  rows.forEach((row, index) => {
    lines.push(`Order ${index + 1}`);
    lines.push(`Order No: ${row.orderNumber || "--"}   Date: ${row.dateTime || "--"}`);
    lines.push(`Order Name: ${row.orderName || "--"}`);
    lines.push(`Created By: ${row.createdBy || "--"}`);
    lines.push(`Order Detail: ${row.orderDetail || "--"}`);
    lines.push(`Status: ${row.status || "--"}   File Type: ${row.fileType || row.fileSource || "--"}`);
    lines.push("------------------------------------------------------------");
  });

  const pdf = buildPdfDocument(lines);
  triggerBlobDownload(new Blob([pdf], { type: "application/pdf" }), `${sanitizeFileName(fileBaseName)}.pdf`);
}

export function downloadGenericRowsAsExcel(items = [], columns = [], fileBaseName = "records") {
  const rows = Array.isArray(items) ? items : [];
  const exportColumns = resolveExportColumns(columns, rows);
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
      th, td { border: 1px solid #111827; padding: 8px; font-size: 12px; text-align: left; vertical-align: top; }
      th { background: #111827; color: #ffffff; font-weight: 700; }
      tr:nth-child(even) td { background: #f3f4f6; }
    </style>
  </head>
  <body>
    <table>
      <thead>
        <tr>
          ${exportColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `<tr>
              ${exportColumns
                .map((column) => `<td>${escapeHtml(normalizeExportValue(row?.[column.key]))}</td>`)
                .join("")}
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>`;

  triggerBlobDownload(
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }),
    `${sanitizeFileName(fileBaseName)}.xls`
  );
}

export function downloadGenericRowsAsPdf(items = [], columns = [], fileBaseName = "records", title = "Records") {
  const rows = Array.isArray(items) ? items : [];
  const exportColumns = resolveExportColumns(columns, rows);
  const lines = [
    title,
    `Generated On: ${new Date().toLocaleString()}`,
    `Total Records: ${rows.length}`,
    "------------------------------------------------------------"
  ];

  rows.forEach((row, index) => {
    lines.push(`Record ${index + 1}`);
    exportColumns.forEach((column) => {
      lines.push(`${column.label}: ${normalizeExportValue(row?.[column.key])}`);
    });
    lines.push("------------------------------------------------------------");
  });

  const pdf = buildPdfDocument(lines);
  triggerBlobDownload(new Blob([pdf], { type: "application/pdf" }), `${sanitizeFileName(fileBaseName)}.pdf`);
}
