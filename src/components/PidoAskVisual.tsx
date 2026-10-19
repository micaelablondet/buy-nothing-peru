/** Buy Nothing–style “ask” placeholder (no photo). */
export function PidoAskVisual({
  variant = "card",
}: {
  variant?: "card" | "hero";
}) {
  const iconClass = variant === "hero" ? "h-24 w-24" : "h-12 w-12";

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[#2563eb] ${
        variant === "hero" ? "min-h-[12rem]" : ""
      }`}
      aria-hidden
    >
      <svg
        className={`${iconClass} text-white`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 9h42a5 5 0 0 1 5 5v27a5 5 0 0 1-5 5H29l-11 11V46H11a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5z"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <text
          x="32"
          y="33"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          fontSize="26"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ?
        </text>
      </svg>
    </div>
  );
}
