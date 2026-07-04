import { useNavigate } from "react-router-dom";

export default function SharedManualWalletTopUpPage({ basePath }) {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-300px)] bg-[#efefef] px-4 py-4 md:px-8 md:py-5">
      <div className="mx-auto max-w-[1280px]">
        <h1 className="mb-6 text-center text-[24px] font-bold uppercase tracking-wide text-[#2d58a5] md:text-[40px]">
          To Add Money In Your Wallet
        </h1>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-2 text-[18px] font-bold text-[#343434] md:text-[21px]">Note Hindi :</h2>
            <ol className="space-y-1 text-[15px] leading-7 text-[#444] md:text-[17px]">
              <li>1. आपके अकाउंट में बैलेंस डालने का कार्य केवल सुबह 10 से शाम 7 बजे तक ही किया जायेगा।</li>
              <li>2. पैसे ट्रांसफर करने के बाद Member Id नंबर, फर्म का नाम एवं कमेंटोंर इस (8619765961) नंबर पर व्हाट्सएप कर दें।</li>
              <li>3. रविवार अथवा अवकाश के दिन बैलेंस ऐड नहीं किया जायेगा।</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-[18px] font-bold text-[#343434] md:text-[21px]">Note English :</h2>
            <ol className="space-y-1 text-[15px] leading-7 text-[#444] md:text-[17px]">
              <li>1. Depositing Balance in your account will be done from 10 AM to 7 PM.</li>
              <li>2. After transfering payment to our account just whatsapp your Member ID &amp; payment screenshot to - 8619765961.</li>
              <li>3. <span className="font-bold">Sunday will be a Holiday so balance will not be transfered on sundays.</span></li>
            </ol>
          </section>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[320px_1fr]">
          <section>
            <h2 className="mb-3 text-[18px] font-bold text-[#343434] md:text-[21px]">Our Bank details:</h2>
            <div className="min-h-[250px] border border-[#dddddd] bg-[#f3f3f3] p-4 text-[15px] leading-8 text-[#555] md:text-[16px]">
              <div className="font-bold text-[#3b3b3b]">NEFT/RTGS/IMPS To Our Bank</div>
              <div>Bank Name - IDFC First Bank</div>
              <div>Branch : C-Scheme, Jaipur, Rajasthan</div>
              <div>Firm Name - PRINTERS CLUB OF INDIA LIMITED</div>
              <div>IFSC CODE : IDFB0042127</div>
              <div>A/C NO : 10062876334</div>
            </div>
          </section>

          <section>
            <div className="min-h-[250px] border border-[#ececec] bg-[#f3f3f3] p-4">
              <div className="text-[18px] font-bold text-[#3d3d3d] md:text-[21px]">
                For Paying VIA QR Code click{" "}
                <button
                  type="button"
                  onClick={() => navigate(`${basePath}/manual/auto`)}
                  className="font-bold text-[#2d58a5] underline"
                >
                  here
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
