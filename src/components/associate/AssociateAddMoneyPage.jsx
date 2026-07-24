import SharedAddMoneyPage from "../shared-wallet/SharedAddMoneyPage.jsx";

const ASSOCIATE_ADD_MONEY_BASE_PATH = "/dashboard/associate-member/wallet";

export default function AssociateAddMoneyPage() {
  return <SharedAddMoneyPage basePath={ASSOCIATE_ADD_MONEY_BASE_PATH} />;
}
