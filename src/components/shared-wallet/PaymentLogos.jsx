import React from "react";

/**
 * Official BHIM UPI Brand Logo (NPCI Artwork)
 */
export function BhimUpiLogo({ className = "h-10 sm:h-12 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="BHIM UPI Logo"
    >
      {/* BHIM Chevrons */}
      <g transform="translate(4, 4)">
        <path d="M14 4L28 20L14 36H2L16 20L2 4H14Z" fill="#FF671F" />
        <path d="M26 4L40 20L26 36H38L52 20L38 4H26Z" fill="#008851" />
      </g>
      {/* BHIM Text */}
      <text
        x="60"
        y="32"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="25"
        fontWeight="900"
        fontStyle="italic"
        fill="#0B2545"
        letterSpacing="0.5"
      >
        BHIM
      </text>
      {/* NPCI Divider Slash */}
      <path d="M136 36L145 8H151L142 36H136Z" fill="#FF671F" />
      {/* UPI Text */}
      <text
        x="153"
        y="32"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="22"
        fontWeight="900"
        fontStyle="italic"
        fill="#008851"
      >
        UPI
      </text>
    </svg>
  );
}

/**
 * Official Google Pay Brand Logo
 */
export function GooglePayLogo({ className = "h-6 sm:h-7 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 102 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Google Pay Logo"
    >
      {/* G Mark */}
      <path
        d="M17.4 14.8v4.1h10c-.4 2.2-2.5 6.3-10 6.3-6.5 0-11.8-5.4-11.8-12s5.3-12 11.8-12c3.7 0 6.2 1.6 7.6 2.9l3.3-3.2C26.2 8.9 22.3 7.2 17.4 7.2 7.8 7.2 0 15 0 24.6s7.8 17.4 17.4 17.4c10 0 16.7-7 16.7-17 0-1.1-.1-2.1-.3-3H17.4z"
        fill="#4285F4"
      />
      <path
        d="M17.4 14.8v4.1h10c-.4 2.2-2.5 6.3-10 6.3-6.5 0-11.8-5.4-11.8-12"
        fill="#34A853"
      />
      <path
        d="M5.6 19.8c-.4-1.1-.6-2.3-.6-3.6s.2-2.5.6-3.6L1.5 9.4C.5 11.4 0 13.9 0 16.6s.5 5.2 1.5 7.2l4.1-4z"
        fill="#FBBC05"
      />
      <path
        d="M17.4 3.2c4.9 0 8.3 2.1 10.2 3.9l3.1-3.1C28.6 2.1 23.7.2 17.4.2 10.3.2 4.3 4.2 1.5 9.4l4.1 3.2c1.6-4.7 6-9.4 11.8-9.4z"
        fill="#EA4335"
      />
      {/* Pay Text */}
      <g fill="#5F6368">
        <path d="M43.5 11.5h-5.2v17.2h3.5v-6.5h1.7c4 0 6.8-2.6 6.8-5.35s-2.8-5.35-6.8-5.35zm0 7.4h-1.7v-4.3h1.7c2.2 0 3.3 1.1 3.3 2.15 0 1.1-1.1 2.15-3.3 2.15z" />
        <path d="M57.6 16.2c-2.3 0-4.1 1.1-5 2.8l3 1.2c.5-.9 1.4-1.4 2.1-1.4 1.1 0 2.2.6 2.2 1.9v.3c-.7-.4-2-.7-3.2-.7-3 0-5.1 1.6-5.1 4 0 2.2 1.9 3.6 4 3.6 1.7 0 2.7-.7 3.3-1.7h.1v1.3h3.4V21.5c0-3-2.3-5.3-4.8-5.3zm-.4 9c-1 0-2.1-.5-2.1-1.5 0-1.2 1.3-1.7 2.5-1.7 1 0 1.9.2 2.4.5-.3 1.7-1.5 2.7-2.8 2.7z" />
        <path d="M72.6 16.6l-4 10.1h-.1l-4.1-10.1h-3.7l6.2 14.3-3.5 7.7h3.6l9.6-22h-4z" />
      </g>
    </svg>
  );
}

/**
 * Official PhonePe Brand Logo
 */
export function PhonePeLogo({ className = "h-6 sm:h-7 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 115 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PhonePe Logo"
    >
      <rect width="34" height="34" rx="10" fill="#5F259F" />
      <path
        d="M21 9H13C11.9 9 11 9.9 11 11V25H14.5V19.5H17.5C21 19.5 23 17.5 23 14.25C23 11 21 9 21 9ZM17.5 16.5H14.5V12H17.5C18.8 12 19.5 12.8 19.5 14.25C19.5 15.7 18.8 16.5 17.5 16.5Z"
        fill="white"
      />
      <text
        x="42"
        y="24"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="19"
        fontWeight="800"
        fill="#5F259F"
      >
        PhonePe
      </text>
    </svg>
  );
}

/**
 * Official Paytm Brand Logo
 */
export function PaytmLogo({ className = "h-6 sm:h-7 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Paytm Logo"
    >
      <text
        x="0"
        y="23"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="25"
        fontWeight="900"
        fill="#002E6E"
        letterSpacing="-0.5"
      >
        Pay
      </text>
      <text
        x="47"
        y="23"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="25"
        fontWeight="900"
        fill="#00BAF2"
        letterSpacing="-0.5"
      >
        tm
      </text>
    </svg>
  );
}

/**
 * Official Amazon Pay Brand Logo
 */
export function AmazonPayLogo({ className = "h-6 sm:h-7 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 135 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Amazon Pay Logo"
    >
      <text
        x="0"
        y="21"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="#232F3E"
      >
        amazon
      </text>
      <text
        x="78"
        y="21"
        fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="#FF9900"
      >
        pay
      </text>
      {/* Amazon Smile Curve */}
      <path
        d="M6 25C22 30 48 30 68 25"
        stroke="#FF9900"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M65 22L71 25.5L64 28.5" fill="#FF9900" />
    </svg>
  );
}
