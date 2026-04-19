export default function PaymentBadges() {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
      <Visa />
      <Mastercard />
      <Amex />
      <ApplePay />
      <GooglePay />
    </div>
  );
}

const box = "h-6 w-10 border border-line rounded-sm grid place-items-center bg-white";

function Visa() {
  return (
    <div className={box} aria-label="Visa">
      <svg viewBox="0 0 40 14" width="34" height="10" fill="none">
        <text x="0" y="11" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="900" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
      </svg>
    </div>
  );
}

function Mastercard() {
  return (
    <div className={box} aria-label="Mastercard">
      <svg viewBox="0 0 32 20" width="28" height="14">
        <circle cx="12" cy="10" r="7.5" fill="#EB001B" />
        <circle cx="20" cy="10" r="7.5" fill="#F79E1B" fillOpacity="0.9" />
        <path d="M16 4.5a7.5 7.5 0 0 1 0 11 7.5 7.5 0 0 1 0-11z" fill="#FF5F00" />
      </svg>
    </div>
  );
}

function Amex() {
  return (
    <div className={box} aria-label="American Express">
      <svg viewBox="0 0 40 14" width="34" height="10">
        <rect width="40" height="14" fill="#006FCF" />
        <text x="3.5" y="10" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="900" fill="#fff" letterSpacing="0">AMERICAN</text>
        <text x="3.5" y="13.5" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="900" fill="#fff" letterSpacing="0">EXPRESS</text>
      </svg>
    </div>
  );
}

function ApplePay() {
  return (
    <div className={box} aria-label="Apple Pay">
      <svg viewBox="0 0 40 16" width="34" height="12">
        <path
          d="M6.3 4.2c.3-.4.5-.9.4-1.4-.4 0-1 .3-1.3.7-.3.3-.5.8-.5 1.3.5 0 1 -.3 1.4-.6zM6.6 4.9c-.7 0-1.3.4-1.6.4-.3 0-.9-.4-1.5-.4-.7 0-1.5.4-1.9 1.1-.8 1.4-.2 3.4.6 4.6.4.6.8 1.2 1.4 1.2.6 0 .8-.4 1.5-.4s.9.4 1.5.4c.6 0 1 -.6 1.4-1.2.4-.7.6-1.4.6-1.4s-1.2-.4-1.2-1.8c0-1.2.9-1.7 1-1.7-.6-.7-1.4-.8-1.8-.8z"
          fill="#000"
        />
        <text x="11" y="11" fontFamily="Arial, sans-serif" fontSize="6.5" fontWeight="600" fill="#000">Pay</text>
      </svg>
    </div>
  );
}

function GooglePay() {
  return (
    <div className={box} aria-label="Google Pay">
      <svg viewBox="0 0 44 16" width="36" height="12">
        <text x="0" y="11" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="500">
          <tspan fill="#4285F4">G</tspan>
          <tspan fill="#EA4335">o</tspan>
          <tspan fill="#FBBC04">o</tspan>
          <tspan fill="#4285F4">g</tspan>
          <tspan fill="#34A853">l</tspan>
          <tspan fill="#EA4335">e</tspan>
          <tspan fill="#000"> Pay</tspan>
        </text>
      </svg>
    </div>
  );
}
