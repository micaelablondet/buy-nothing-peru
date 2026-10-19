import { usePrototypeStore } from "@/store/prototypeStore";

export function ReportButton({ context }: { context: string }) {
  const showToast = usePrototypeStore((s) => s.showToast);
  return (
    <button
      type="button"
      onClick={() =>
        showToast(
          `Reporte (${context}): en la app real iría a moderación. Gracias.`,
        )
      }
      className="text-sm font-medium text-red-700 underline-offset-2 hover:underline"
    >
      Reportar
    </button>
  );
}
