export function navigateTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function getDashboardPath(role) {
  if (role === "super-admin") {
    return "/dashboard/super-admin";
  }

  if (role === "admin") {
    return "/dashboard/admin";
  }

  if (role === "associate-member") {
    return "/dashboard/associate-member/book-order";
  }

  return "/dashboard/associate-member";
}

export function saveAuthSession(session) {
  localStorage.setItem("auth_session", JSON.stringify(session));
  window.dispatchEvent(new Event("authchange"));
}

function decodeJwtPayload(token) {
  try {
    const payload = String(token || "").split(".")[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const decoded = window.atob(paddedPayload);

    return JSON.parse(decoded);
  } catch (_error) {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return Date.now() >= payload.exp * 1000;
}

export function getAuthSession() {
  try {
    const stored = localStorage.getItem("auth_session");
    const session = stored ? JSON.parse(stored) : null;

    if (session?.token && isTokenExpired(session.token)) {
      localStorage.removeItem("auth_session");
      return null;
    }

    return session;
  } catch (_error) {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem("auth_session");
  window.dispatchEvent(new Event("authchange"));
}
