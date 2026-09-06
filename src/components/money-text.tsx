import { formatINR, type Paise } from "@/lib/money";
import { cn } from "@/lib/utils";

export function MoneyText({
  paise,
  className,
}: {
  paise: Paise;
  className?: string;
}) {
  return <span className={cn("tabular", className)}>{formatINR(paise)}</span>;
}
