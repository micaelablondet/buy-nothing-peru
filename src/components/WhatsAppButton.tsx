interface WhatsAppButtonProps {
  href: string;
  label?: string;
}

export function WhatsAppButton({
  href,
  label = "Coordinar por WhatsApp",
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-base font-semibold text-white shadow-sm"
    >
      <span aria-hidden>💬</span>
      {label}
    </a>
  );
}
