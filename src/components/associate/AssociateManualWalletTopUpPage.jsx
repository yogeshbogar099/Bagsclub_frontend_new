import SharedManualWalletTopUpPage from "../shared-wallet/SharedManualWalletTopUpPage.jsx";

const ASSOCIATE_ADD_MONEY_BASE_PATH = "/dashboard/associate-member/wallet";

export default function AssociateManualWalletTopUpPage() {
  return <SharedManualWalletTopUpPage basePath={ASSOCIATE_ADD_MONEY_BASE_PATH} />;
}
