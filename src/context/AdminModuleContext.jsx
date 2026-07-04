import { createContext, useCallback, useContext, useMemo, useState } from "react";
import apiClient from "../lib/apiClient.js";

const AdminModuleContext = createContext(null);

export function AdminModuleProvider({ children }) {
  const [bootstrap, setBootstrap] = useState(null);
  const [sectionData, setSectionData] = useState({ items: [], summary: {}, meta: {} });
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBootstrap = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get("/admin-module/bootstrap");
      setBootstrap(data);
      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load admin module.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSection = useCallback(async (section, view = "summary") => {
    setSectionLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get(`/admin-module/section/${section}`, {
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

  const fetchOrderDetails = useCallback(async (orderId) => {
    setOrderLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get(`/admin-module/orders/${orderId}`);
      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load order details.");
      return null;
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const fetchAssociateMemberDetails = useCallback(async (associateMemberId) => {
    setSectionLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get(`/admin-module/associate-members/${associateMemberId}`);
      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load associate member details.");
      return null;
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, payload) => {
    setOrderLoading(true);
    setError("");
    try {
      const { data } = await apiClient.patch(`/admin-module/orders/${orderId}/status`, payload);
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to update order status.";
      setError(message);
      throw new Error(message);
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const loadRecentOrders = useCallback(async (limit = 5) => {
    setSectionLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get("/admin-module/orders/recent", {
        params: { limit }
      });
      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load recent orders.");
      return { items: [] };
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const submitOrder = useCallback(async (payload) => {
    setOrderLoading(true);
    setError("");
    try {
      const { data } = await apiClient.post("/admin-module/orders", payload);
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to create order.";
      setError(message);
      throw new Error(message);
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const submitTopUp = useCallback(async (payload) => {
    setSectionLoading(true);
    setError("");
    try {
      const { data } = await apiClient.post("/admin-module/wallet/top-up", payload);
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to add money to wallet.";
      setError(message);
      throw new Error(message);
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const fetchWalletHistory = useCallback(async () => {
    setSectionLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get("/admin-module/wallet/history");
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError.message || "Failed to load wallet history.";
      setError(message);
      return { items: [], summary: {}, meta: { columns: [] } };
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const fetchWalletRequestDetails = useCallback(async (requestId) => {
    setSectionLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get(`/admin-module/wallet/requests/${requestId}`);
      return data;
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to load wallet request details.");
      return null;
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const updateWalletRequestStatus = useCallback(async (requestId, payload) => {
    setSectionLoading(true);
    setError("");
    try {
      const { data } = await apiClient.patch(`/admin-module/wallet/requests/${requestId}/status`, payload);
      return data;
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message || requestError.message || "Failed to update wallet request status.";
      setError(message);
      throw new Error(message);
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      bootstrap,
      sectionData,
      loading,
      sectionLoading,
      orderLoading,
      error,
      loadBootstrap,
      loadSection,
      fetchOrderDetails,
      fetchAssociateMemberDetails,
      updateOrderStatus,
      loadRecentOrders,
      submitOrder,
      submitTopUp,
      fetchWalletHistory,
      fetchWalletRequestDetails,
      updateWalletRequestStatus
    }),
    [bootstrap, sectionData, loading, sectionLoading, orderLoading, error, loadBootstrap, loadSection, fetchOrderDetails, fetchAssociateMemberDetails, updateOrderStatus, loadRecentOrders, submitOrder, submitTopUp, fetchWalletHistory, fetchWalletRequestDetails, updateWalletRequestStatus]
  );

  return <AdminModuleContext.Provider value={value}>{children}</AdminModuleContext.Provider>;
}

export function useAdminModule() {
  const context = useContext(AdminModuleContext);

  if (!context) {
    throw new Error("useAdminModule must be used within an AdminModuleProvider.");
  }

  return context;
}
