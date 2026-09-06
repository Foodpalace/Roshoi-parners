import { useEffect, useState } from "react";
import { useT } from "./use-t";

export function OfflineBanner({ stale }: { stale?: boolean }) {
  const t = useT();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  if (!offline && !stale) return null;
  return (
    <div
      role="alert"
      className="rounded-[12px] bg-danger-soft px-3 py-2 text-sm font-medium text-danger"
    >
      {t("app.stale")}
    </div>
  );
}
