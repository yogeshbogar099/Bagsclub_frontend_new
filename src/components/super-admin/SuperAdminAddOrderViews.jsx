import { useNavigate } from "react-router-dom";
import apiClient from "../../lib/apiClient.js";
import SharedAddOrderLanding from "../shared-order/SharedAddOrderLanding.jsx";
import SharedNonWovenBagOrderForm from "../shared-order/SharedNonWovenBagOrderForm.jsx";
import SharedNonWovenBagSelection from "../shared-order/SharedNonWovenBagSelection.jsx";

const SUPER_ADMIN_ADD_ORDER_BASE_PATH = "/dashboard/super-admin/order-management/add-order";

async function loadRecentOrders(limit = 5) {
  const { data } = await apiClient.get("/super-admin/orders/recent", {
    params: { limit }
  });
  return data;
}

async function submitOrder(payload) {
  const { data } = await apiClient.post("/super-admin/orders", payload);
  return data;
}

export function SuperAdminAddOrderLandingView() {
  const navigate = useNavigate();

  return <SharedAddOrderLanding basePath={SUPER_ADMIN_ADD_ORDER_BASE_PATH} loadRecentOrders={loadRecentOrders} onOpenDetails={() => navigate("/dashboard/super-admin/order-management/all-orders")} />;
}

export function SuperAdminNonWovenBagSelectionView() {
  return <SharedNonWovenBagSelection basePath={SUPER_ADMIN_ADD_ORDER_BASE_PATH} />;
}

export function SuperAdminNonWovenBagOrderView({ bagSlug }) {
  return <SharedNonWovenBagOrderForm bagSlug={bagSlug} basePath={SUPER_ADMIN_ADD_ORDER_BASE_PATH} submitOrder={submitOrder} />;
}
