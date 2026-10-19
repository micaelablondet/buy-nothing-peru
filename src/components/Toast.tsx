import { usePrototypeStore } from "@/store/prototypeStore";

export function Toast() {
  const message = usePrototypeStore((s) => s.toastMessage);
  if (!message) {
    return null;
  }
  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-50 max-w-[min(340px,calc(100%-2rem))] -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-center text-sm text-white shadow-lg"
    >
      {message}
    </div>
  );
}
