import { useNavigate } from "react-router-dom";
import { useAdminModule } from "../../context/AdminModuleContext.jsx";
import SharedAddOrderLanding from "../shared-order/SharedAddOrderLanding.jsx";
import SharedNonWovenBagOrderForm from "../shared-order/SharedNonWovenBagOrderForm.jsx";
import SharedNonWovenBagSelection from "../shared-order/SharedNonWovenBagSelection.jsx";

const ADMIN_ADD_ORDER_BASE_PATH = "/dashboard/admin/orders/add-order";

export function AdminAddOrderLandingView() {
  const navigate = useNavigate();
  const { loadRecentOrders } = useAdminModule();

  return (
    <SharedAddOrderLanding
      basePath={ADMIN_ADD_ORDER_BASE_PATH}
      loadRecentOrders={loadRecentOrders}
      onOpenDetails={() => navigate("/dashboard/admin/orders/all")}
    />
  );
}

export function AdminNonWovenBagSelectionView() {
  return <SharedNonWovenBagSelection basePath={ADMIN_ADD_ORDER_BASE_PATH} />;
}

export function AdminNonWovenBagOrderView({ bagSlug }) {
  const { submitOrder } = useAdminModule();

  return <SharedNonWovenBagOrderForm bagSlug={bagSlug} basePath={ADMIN_ADD_ORDER_BASE_PATH} submitOrder={submitOrder} />;
}
