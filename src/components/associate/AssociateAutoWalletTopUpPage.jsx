import { useAssociateModule } from "../../context/AssociateModuleContext.jsx";
import SharedAutoWalletTopUpPage from "../shared-wallet/SharedAutoWalletTopUpPage.jsx";

export default function AssociateAutoWalletTopUpPage() {
  const { loadBootstrap, submitTopUp } = useAssociateModule();

  return <SharedAutoWalletTopUpPage submitTopUp={submitTopUp} onRefresh={loadBootstrap} />;
}
