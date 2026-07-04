import {
  Award,
  Banknote,
  Bolt,
  ChartNoAxesCombined,
  CheckCircle,
  Diamond,
  Laptop,
  PackageOpen,
  ShieldCheck,
  Users
} from "lucide-react";
import loginBuyAndSell from "../assets/images/login_BUY_N_SELL.png";
import loginFreeTemplate from "../assets/images/login_Free_Tamplate.png";
import loginPrintingServices from "../assets/images/login_Printing_Services.png";
import distributer from "../assets/images/pcil-distributors_n.png"
import members from "../assets/images/pcil-members_n.png"
import staff from "../assets/images/pcil-staff_n.png"



export const navItems = [
  { label: "Home", href: "#" },
  { label: "Corporate", href: "#about" },
  { label: "Our Services", href: "#section-services" },
  { label: "Join Us", href: "#join" },
  { label: "Contact", href: "#footer" },
  { label: "Branches", href: "#reach" }
];

export const services = [
  {
    title: "Printing Services",
    image: loginPrintingServices,
    href: "#section-portfolio",
    text: "Premium printing services for visiting cards, pamphlets, posters, stationery, and much more."
  },
  {
    title: "Buy & Sell Machines",
    image: loginBuyAndSell,
    href: "bs_default.aspx",
    text: "A free marketplace for buying and selling new and pre-owned printing machines from trusted sellers."
  },
  {
    title: "Free Design Files",
    image: loginFreeTemplate,
    href: "t_ViewTemplatesMainCategories.aspx",
    text: "Download design templates and graphic resources created for printers and advertising agencies."
  }
];

export const stats = [
  {
    image: distributer,
    value: "25+",
    label: "Delivery Partners",
    bg: "bg-[#8098dc]"
  },
  {
    image: members,
    value: "1000",
    label: "Total Members",
    bg: "bg-[#95a6ca]"
  },
  {
    image: staff,
    value: "100",
    label: "Dedicated Staffs",
    bg: "bg-[#6697B9]"
  },
 
];

export const printingProducts = [
  [
    "D Cut Bags",
    "We are specialists in “D Cut” Non Woven Bags printing, which makes us India’s No. 1 D Cut bag Manufacturer."
  ],
  [
    "Premium Loop Handle Bags",
    "We manufacture various range of premium Bags like Loop handle stylish Bags,Single colours,two colours etc"
  ],
  [
    "Digital Box Bag Printing",
    "We deliver high end printing quality Bags by latest offset machine."
  ]
];

export const principles = [
  {
    title: "Our Vision",
    icon: Award,
    bg: "bg-[#1abc9c]",
    lines: [
      "Unite printers across India on a single platform through collective power.",
      "Expand services for the welfare and development of every printing professional."
    ]
  },
  {
    title: "Our Policies",
    icon: ShieldCheck,
    bg: "bg-[#34495e]",
    lines: [
      "Operate as a B2B enterprise for printers and advertising agencies.",
      "Deliver competitive margins, committed timelines, and consistent quality."
    ]
  },
  {
    title: "Our Mission",
    icon: CheckCircle,
    bg: "bg-[#e74c3c]",
    lines: [
      "Make India self-reliant and a global leader in printing technology.",
      "Create innovative printing products for Indian and international markets."
    ]
  }
];

export const reasons = [
  [
    "Dedicated Team",
    Users,
    "from-brand to-[#c02942]",
    "350+ professionals committed to excellence in every product and service."
  ],
  [
    "Free Software",
    Laptop,
    "from-navy to-[#1a1a6e]",
    "Complimentary order management software and magazine subscription for member printers."
  ],
  [
    "Lowest Prices",
    Banknote,
    "from-[#2ecc71] to-[#16a085]",
    "Wholesale pricing that maximizes printer margins and supports industry growth."
  ],
  [
    "Wide Product Range",
    PackageOpen,
    "from-[#f39c12] to-[#e67e22]",
    "A growing catalog from die-cut cards to stationery, stickers, pouches, and more."
  ],
  [
    "On-Time Delivery",
    Bolt,
    "from-[#9b59b6] to-[#8e44ad]",
    "Committed timelines backed by a 5,000 sq. mtr. factory and skilled team."
  ],
  [
    "Unity is Strength",
    Users,
    "from-[#1abc9c] to-[#16a085]",
    "A nationwide community where printers grow by working together."
  ],
  [
    "Grow With Us",
    ChartNoAxesCombined,
    "from-[#e74c3c] to-[#c0392b]",
    "Dedicated to the growth and development of every printer."
  ],
  [
    "World-Class Quality",
    Diamond,
    "from-[#3498db] to-[#2980b9]",
    "Advanced offset presses and premium materials for reliable results."
  ]
];

export const dedicated = [
  [
    "Premium Quality",
    Diamond,
    "from-ink to-navy",
    "World-class printing powered by Komori Lithrone offset machines, A-grade paper, and premium inks."
  ],
  [
    "Lowest Price Guaranteed",
    Banknote,
    "from-brand to-[#c02942]",
    "A club printing model that reduces costs and passes savings directly to members."
  ],
  [
    "Express Services",
    Bolt,
    "from-[#2ecc71] to-[#16a085]",
    "Fast turnaround from a 5,000 sq. mtr. factory and 350+ professionals."
  ]
];

export const footerLinks = [
  "About Us",
  "Services",
  "Portfolio",
  "Contact Us",
  "Our Location",
  "Terms & Conditions",
  "Sign In"
];

export const aboutHighlights = [
  ["350+ Team", "Skilled professionals dedicated to success"],
  ["12+ States", "PAN India reach with delivery partners"],
  ["5,000 Sq. Mtr.", "State-of-the-art manufacturing facility"]
];
