import { useAdminModule } from "../../context/AdminModuleContext.jsx";
import SharedAddMoneyPage from "../shared-wallet/SharedAddMoneyPage.jsx";
import SharedAutoWalletTopUpPage from "../shared-wallet/SharedAutoWalletTopUpPage.jsx";
import SharedManualWalletTopUpPage from "../shared-wallet/SharedManualWalletTopUpPage.jsx";

export const ADMIN_ADD_MONEY_BASE_PATH = "/dashboard/admin/wallet/add-money";

export function AdminAddMoneyLandingView() {
  return <SharedAddMoneyPage basePath={ADMIN_ADD_MONEY_BASE_PATH} />;
}

export function AdminManualWalletTopUpView() {
  return <SharedManualWalletTopUpPage basePath={ADMIN_ADD_MONEY_BASE_PATH} />;
}

export function AdminAutoWalletTopUpView() {
  const { loadBootstrap, submitTopUp } = useAdminModule();

  return <SharedAutoWalletTopUpPage submitTopUp={submitTopUp} onRefresh={loadBootstrap} />;
}
