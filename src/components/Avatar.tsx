interface AvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, color, size = "md" }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const dim =
    size === "sm"
      ? "h-9 w-9 text-sm"
      : size === "lg"
        ? "h-20 w-20 text-2xl"
        : "h-11 w-11 text-base";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${dim}`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
