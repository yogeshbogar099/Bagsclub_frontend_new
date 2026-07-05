const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export function buildApiUrl(path = "") {
  const normalizedPath = String(path || "");
  if (!normalizedPath) {
    return API_BASE_URL || "/api";
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const safePath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  return API_BASE_URL ? `${API_BASE_URL}${safePath}` : safePath;
}

export { API_BASE_URL };
