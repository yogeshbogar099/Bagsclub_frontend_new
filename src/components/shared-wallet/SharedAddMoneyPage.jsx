import { useNavigate } from "react-router-dom";

const paymentOptions = [
  {
    id: "automatic",
    title: "AUTOMATIC WALLET TOP-UP",
    points: [
      "GENERATE AND SCAN A QR CODE ONLINE.",
      "PAYMENT IS INSTANTLY UPDATED IN YOUR WALLET."
    ],
    badge: "NEWLY LAUNCHED"
  },
  {
    id: "manual",
    title: "MANUAL WALLET TOP-UP",
    points: [
      "TRANSFER TO OUR BANK ACCOUNT.",
      "SEND SCREENSHOT TO OUR ACCOUNTS DEPARTMENT TO UPDATE YOUR WALLET."
    ]
  }
];

export default function SharedAddMoneyPage({ basePath }) {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-220px)] w-full bg-[#efefef] px-4 py-4 sm:px-6 md:py-5 md:px-0">
      <div className="mx-auto flex min-h-[calc(100vh-260px)] w-full max-w-7xl flex-col justify-start px-4 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-center text-[24px] font-bold uppercase tracking-wide text-[#2d58a5] md:mb-12 md:text-[32px]">
          Select Payment Option
        </h1>

        <div className="mx-auto grid w-full max-w-5xl gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                navigate(option.id === "manual" ? `${basePath}/manual` : `${basePath}/manual/auto`)
              }
              className="mx-auto w-full max-w-[470px] rounded-[14px] border border-[#c7ccde] bg-[#f3f3f3] px-4 py-3.5 text-left shadow-[0_3px_8px_rgba(45,88,165,0.38)] transition duration-200 hover:-translate-y-0.5 md:px-5"
            >
              <h2 className="mb-2 text-center text-[16px] font-normal uppercase leading-tight tracking-normal text-[#2f2f2f] md:text-[18px]">
                {option.title}
              </h2>

              <ol className="space-y-1 pl-5 text-[11px] font-normal uppercase leading-[1.35] text-[#2f2f2f] md:text-[12px]">
                {option.points.map((point) => (
                  <li key={point} className="list-decimal">
                    {point}
                  </li>
                ))}
              </ol>

              {option.badge ? (
                <div className="animate-newly-launched mt-3.5 rounded-[6px] bg-[#c2185b] px-4 py-1 text-center text-[11px] font-bold uppercase tracking-wide text-white md:text-[12px]">
                  {option.badge}
                </div>
              ) : null}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
