import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import apiClient from "../lib/apiClient.js";
import { getAuthSession, saveAuthSession } from "../utils/auth.js";

const AssociateModuleContext = createContext(null);

export function AssociateModuleProvider({ children }) {
  const [bootstrap, setBootstrap] = useState(null);
  const [sectionData, setSectionData] = useState({ items: [], summary: {}, meta: {} });
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isBootstrapFetchingRef = useRef(false);

  const loadBootstrap = useCallback(async () => {
    if (isBootstrapFetchingRef.current) {
      return null;
    }
    isBootstrapFetchingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/associate-member-module/bootstrap");
      setBootstrap(data);

      const walletBalance = data?.header?.walletBalance;
      const profile = data?.profile;
      if (walletBalance !== undefined || profile) {
        const session = getAuthSession();
        if (session?.user) {
          const nextUser = {
            ...session.user,
            walletBalance: walletBalance !== undefined ? walletBalance : session.user.walletBalance,
            ownerName: profile?.ownerName || session.user.ownerName,
            businessName: profile?.businessName || session.user.businessName,
            email: profile?.email || session.user.email,
            mobile: profile?.mobile || session.user.mobile
          };

          const hasChanged =
            session.user.walletBalance !== nextUser.walletBalance ||
            session.user.ownerName !== nextUser.ownerName ||
            session.user.businessName !== nextUser.businessName ||
            session.user.email !== nextUser.email ||
            session.user.mobile !== nextUser.mobile;

          if (hasChanged) {
            saveAuthSession({
              ...session,
              user: nextUser
            });
          }
        }
      }

      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load associate member module.");
      return null;
    } finally {
      isBootstrapFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBootstrap();
  }, [loadBootstrap]);

  useEffect(() => {
    const refreshBootstrap = () => {
      loadBootstrap();
    };

    const events = [
      "focus",
      "authchange",
      "dashboardstatschange",
      "orderchange",
      "orderstatuschange",
      "walletchange",
      "adminchange",
      "associatememberchange"
    ];

    events.forEach((eventName) => window.addEventListener(eventName, refreshBootstrap));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, refreshBootstrap));
    };
  }, [loadBootstrap]);

  const loadSection = useCallback(async (section, view = "overview") => {
    setSectionLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get(`/associate-member-module/section/${section}`, {
        params: { view }
      });
      setSectionData(data);
      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load section data.");
      return null;
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const loadRecentOrders = useCallback(async (limit = 5) => {
    setSectionLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/associate-member-module/section/my-orders", {
        params: { view: "all" }
      });

      return {
        ...data,
        items: Array.isArray(data?.items) ? data.items.slice(0, limit) : []
      };
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load recent orders.");
      return { items: [], summary: {}, meta: {} };
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const fetchOrderDetails = useCallback(async (orderId) => {
    setOrderLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get(`/associate-member-module/orders/${orderId}`);
      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load order details.");
      return null;
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const searchOrders = useCallback(async (params = {}) => {
    setSectionLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/associate-member-module/orders/search", {
        params
      });
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to search orders.";
      setError(message);
      return { items: [], summary: {}, meta: {} };
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const submitOrder = useCallback(async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await apiClient.post("/associate-member-module/orders", payload);
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to place order.";
      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const submitTopUp = useCallback(async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await apiClient.post("/associate-member-module/wallet/top-up", payload);
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to submit top-up request.";
      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const fetchWalletHistory = useCallback(async () => {
    setSectionLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/associate-member-module/wallet/history");
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to load wallet history.";
      setError(message);
      return { items: [], summary: {}, meta: { columns: [] } };
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const fetchAccountTransactionsReport = useCallback(async (params = {}) => {
    setSectionLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/associate-member-module/reports/account-transactions", {
        params
      });
      return data;
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError.message ||
        "Failed to load account transactions report.";
      setError(message);
      return null;
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const fetchInvoiceReport = useCallback(async (params = {}) => {
    setSectionLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/associate-member-module/reports/invoice", {
        params
      });
      return data;
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError.message ||
        "Failed to load invoice report.";
      setError(message);
      return null;
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await apiClient.patch("/associate-member-module/profile", payload);
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to update profile.";
      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const changePassword = useCallback(async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await apiClient.patch("/associate-member-module/change-password", payload);
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to update password.";
      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      bootstrap,
      sectionData,
      loading,
      sectionLoading,
      orderLoading,
      submitting,
      error,
      loadBootstrap,
      loadSection,
      loadRecentOrders,
      fetchOrderDetails,
      searchOrders,
      submitOrder,
      submitTopUp,
      fetchWalletHistory,
      fetchAccountTransactionsReport,
      fetchInvoiceReport,
      updateProfile,
      changePassword
    }),
    [
      bootstrap,
      sectionData,
      loading,
      sectionLoading,
      orderLoading,
      submitting,
      error,
      loadBootstrap,
      loadSection,
      loadRecentOrders,
      fetchOrderDetails,
      searchOrders,
      submitOrder,
      submitTopUp,
      fetchWalletHistory,
      fetchAccountTransactionsReport,
      fetchInvoiceReport,
      updateProfile,
      changePassword
    ]
  );

  return <AssociateModuleContext.Provider value={value}>{children}</AssociateModuleContext.Provider>;
}

export function useAssociateModule() {
  const context = useContext(AssociateModuleContext);

  if (!context) {
    throw new Error("useAssociateModule must be used within an AssociateModuleProvider.");
  }

  return context;
}
