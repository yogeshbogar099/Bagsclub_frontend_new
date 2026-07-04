import apiClient from "../../lib/apiClient.js";
import SharedAddMoneyPage from "../shared-wallet/SharedAddMoneyPage.jsx";
import SharedAutoWalletTopUpPage from "../shared-wallet/SharedAutoWalletTopUpPage.jsx";
import SharedManualWalletTopUpPage from "../shared-wallet/SharedManualWalletTopUpPage.jsx";

export const SUPER_ADMIN_ADD_MONEY_BASE_PATH = "/dashboard/super-admin/wallet-management/add-money";

async function submitTopUp(payload) {
  const { data } = await apiClient.post("/super-admin/wallet/top-up", payload);
  return data;
}

async function loadWalletHistory() {
  const { data } = await apiClient.get("/super-admin/wallet/history");
  return data;
}

export function SuperAdminAddMoneyLandingView() {
  return <SharedAddMoneyPage basePath={SUPER_ADMIN_ADD_MONEY_BASE_PATH} loadWalletHistory={loadWalletHistory} />;
}

export function SuperAdminManualWalletTopUpView() {
  return <SharedManualWalletTopUpPage basePath={SUPER_ADMIN_ADD_MONEY_BASE_PATH} />;
}

export function SuperAdminAutoWalletTopUpView() {
  return <SharedAutoWalletTopUpPage submitTopUp={submitTopUp} onRefresh={null} />;
}
