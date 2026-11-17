type Props = { open?: boolean; className?: string };

/** Three-line hamburger (short middle, right-aligned) ↔ close — WiP-style. */
export function MenuIcon({ open = false, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path
            d="M6 6 L18 18"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
          <path
            d="M18 6 L6 18"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
        </>
      ) : (
        <>
          <path
            d="M5 7 H19"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
          <path
            d="M11 12 H19"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
          <path
            d="M5 17 H19"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
        </>
      )}
    </svg>
  );
}
