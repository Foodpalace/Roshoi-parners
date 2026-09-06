import { cn } from "@/lib/utils";
import { useT } from "./use-t";

export function DataBanner({ label }: { label?: string | null }) {
  const t = useT();
  if (!label) return null;
  const simulated = label === "SIMULATED";
  return (
    <div
      role="status"
      className={cn(
        "rounded-[12px] px-3 py-2 text-xs font-semibold tracking-wide",
        simulated ? "bg-warn-soft text-warn" : "bg-leaf-soft text-leaf",
      )}
    >
      {simulated ? t("app.simulated") : label === "VERIFIED" ? t("app.verified") : t("app.real")}
      {simulated ? ` — ${t("app.simulatedHint")}` : null}
    </div>
  );
}
