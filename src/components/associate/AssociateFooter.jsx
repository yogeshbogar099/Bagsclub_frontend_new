import {
  FaAngleRight,
  FaCircleCheck,
  FaInstagram,
  FaLocationDot,
  FaPhone,
  FaYoutube
} from "react-icons/fa6";

export default function AssociateFooter() {
  return (
    <footer className="border-t-4 border-[#f4c400] bg-[linear-gradient(90deg,#071327,#0b1f44,#071327)] pt-[40px] text-white">
      <div className="mx-auto grid w-[90%] max-w-[1400px] grid-cols-1 gap-[30px] pb-[40px] lg:grid-cols-[1.5fr_1fr_1.2fr] lg:gap-[60px]">
        <div>
          <h2 className="relative mb-[25px] pl-[18px] text-[20px] font-bold before:absolute before:left-0 before:top-[4px] before:h-[22px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
            Bagsclub Group
          </h2>

          <p className="mb-[25px] max-w-[580px] text-[14px] leading-[1.8] text-[#b6bfd3]">
            Dedicated to the continuous development and modernization of the Bag printing industry in India. Providing quality services and a unified platform for printers nationwide.
          </p>

          <ul className="space-y-[12px]">
            <li className="flex items-center gap-2 text-[14px] font-medium">
              <FaCircleCheck className="text-[13px] text-[#f4c400]" />
              Bagsclub of India Limited
            </li>

            <li className="flex items-center gap-2 text-[14px] font-medium">
              <FaCircleCheck className="text-[13px] text-[#f4c400]" />
              Bagsclub Expo Private Limited
            </li>

            <li className="flex items-center gap-2 text-[14px] font-medium">
              <FaCircleCheck className="text-[13px] text-[#f4c400]" />
              Bagsclub Today Private Limited
            </li>
          </ul>
        </div>

        <div>
          <h2 className="relative mb-[25px] pl-[18px] text-[20px] font-bold before:absolute before:left-0 before:top-[4px] before:h-[22px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
            Quick Links
          </h2>

          <ul className="space-y-[15px]">
            {["About Us", "Services", "Portfolio", "Contact Us", "Terms & Conditions"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="flex items-center gap-2 text-[14px] transition-all duration-300 hover:pl-[5px] hover:text-[#f4c400]"
                >
                  <FaAngleRight className="text-[12px]" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="relative mb-[25px] pl-[18px] text-[20px] font-bold before:absolute before:left-0 before:top-[4px] before:h-[22px] before:w-[3px] before:rounded-full before:bg-[#f4c400] before:content-['']">
            Contact Info
          </h2>

          <div className="mb-[20px] flex items-start gap-[15px]">
            <FaLocationDot className="mt-[4px] text-[20px] text-[#f4c400]" />

            <div>
              <h4 className="mb-1 text-[16px] font-semibold">Head Office:</h4>

              <p className="text-[14px] leading-[1.6] text-[#b6bfd3]">
                Sandeep Printers, behind Godavari Hotel, Latur Maharashtra 413512
              </p>
            </div>
          </div>

          <div className="mb-[20px] flex items-start gap-[15px]">
            <FaPhone className="mt-[4px] text-[20px] text-[#f4c400]" />

            <div>
              <a href="tel:+9101413112244" className="text-[18px] font-semibold text-white">
                (+91) 9975813249
              </a>
            </div>
          </div>

          <div className="mt-4 flex gap-[12px]">
            <a
              href="#"
              className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white/10 text-[18px] transition-all duration-300 hover:-translate-y-[3px] hover:bg-[#f4c400] hover:text-black"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white/10 text-[18px] transition-all duration-300 hover:-translate-y-[3px] hover:bg-[#f4c400] hover:text-black"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-[20px]">
        <div className="mx-auto flex w-[90%] max-w-[1400px] flex-col items-center justify-between gap-4 text-center text-[14px] md:flex-row md:text-left">
          <p className="text-[#8f9ab2]">
            Copyrights © 2026 | All Rights Reserved by{" "}
            <span className="font-semibold text-white">Bagsclub of India Limited</span>
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-[#8f9ab2] transition hover:text-white">
              Policy & Terms
            </a>

            <span className="text-[#6f7b96]">|</span>

            <a href="#" className="text-[#f4c400] text-[14px] font-semibold">
              Portal Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
