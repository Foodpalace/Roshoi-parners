import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { askAssistant } from "@/lib/server/api-more";

export const Route = createFileRoute("/assistant")({ component: AssistantPage });

function AssistantPage() {
  const t = useT();
  const vendor = useVendor();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const examples = t("assistant.examples").split("|");
  const connected = vendor.adapters?.ai.connected;

  async function send(text: string) {
    if (!text.trim()) return;
    setBusy(true);
    setLog((l) => [...l, { role: "user", text }]);
    try {
      const res = await askAssistant({ data: { restaurantId: vendor.restaurantId, question: text } });
      const reply = typeof res === "object" && res && "text" in res ? String(res.text) : t("assistant.unavailable");
      setLog((l) => [...l, { role: "assistant", text: reply }]);
    } catch (e) {
      setLog((l) => [
        ...l,
        { role: "assistant", text: e instanceof Error ? e.message : t("assistant.unavailable") },
      ]);
    } finally {
      setBusy(false);
      setQ("");
    }
  }

  return (
    <VendorShell title={t("nav.assistant")} dataLabel={vendor.dataLabel}>
      <p className="text-sm text-muted">{t("assistant.disclaimer")}</p>
      {!connected ? (
        <div className="rounded-[12px] bg-warn-soft px-3 py-2 text-sm text-warn">
          {t("app.notConnected")} — {t("assistant.unavailable")}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <Button key={ex} variant="secondary" onClick={() => void send(ex)}>
            {ex}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        {log.map((m, i) => (
          <Card key={i} className={m.role === "user" ? "bg-chili-soft" : ""}>
            <p className="whitespace-pre-wrap text-sm">{m.text}</p>
          </Card>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(q);
        }}
      >
        <Textarea
          className="min-h-14"
          placeholder={t("assistant.placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="submit" disabled={busy}>
          {t("assistant.send")}
        </Button>
      </form>
    </VendorShell>
  );
}
