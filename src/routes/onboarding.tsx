import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import {
  createRestaurantDraft,
  getRestaurant,
  loadSimulatedKitchen,
  submitForReview,
  updateRestaurantProfile,
  uploadDocument,
} from "@/lib/server/api-bootstrap";

export const Route = createFileRoute("/onboarding")({ component: OnboardingPage });

function OnboardingPage() {
  const t = useT();
  const nav = useNavigate();
  const qc = useQueryClient();
  const vendor = useVendor();
  const restQ = useQuery({
    queryKey: ["restaurant", vendor.restaurantId],
    queryFn: () => getRestaurant({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    cuisine: "",
    diet: "NONVEG",
    description: "",
    gstin: "",
    fssaiNumber: "",
    pan: "",
    bankAccount: "",
    bankIfsc: "",
  });

  const r = restQ.data?.restaurant as Record<string, unknown> | undefined;

  async function loadDemo() {
    setBusy(true);
    setError(null);
    try {
      await loadSimulatedKitchen();
      await qc.invalidateQueries();
      nav({ to: "/dashboard" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load demo");
    } finally {
      setBusy(false);
    }
  }

  async function createReal() {
    setBusy(true);
    setError(null);
    try {
      await createRestaurantDraft({
        data: {
          name: form.name,
          displayName: form.displayName || form.name,
          ownerName: form.ownerName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          landmark: form.landmark,
          cuisine: form.cuisine,
          diet: form.diet,
          description: form.description,
        },
      });
      await qc.invalidateQueries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function saveMore() {
    if (!vendor.restaurantId) return;
    setBusy(true);
    setError(null);
    try {
      await updateRestaurantProfile({
        data: {
          restaurantId: vendor.restaurantId,
          gstin: form.gstin,
          fssaiNumber: form.fssaiNumber,
          pan: form.pan,
          bankAccount: form.bankAccount,
          bankIfsc: form.bankIfsc,
          cuisine: form.cuisine,
          description: form.description,
        },
      });
      await qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!vendor.restaurantId) return;
    setBusy(true);
    setError(null);
    try {
      await submitForReview({ data: { restaurantId: vendor.restaurantId } });
      await qc.invalidateQueries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  return (
    <VendorShell title={t("onboarding.title")} dataLabel={vendor.dataLabel} restaurantName={vendor.selected?.restaurantName}>
      {!vendor.restaurantId ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-3">
            <h2 className="font-display text-xl">{t("onboarding.demoCta")}</h2>
            <p className="text-sm text-muted">{t("onboarding.demoHint")}</p>
            <Button disabled={busy} onClick={() => void loadDemo()}>
              {t("onboarding.demoCta")}
            </Button>
          </Card>
          <Card className="space-y-3">
            <h2 className="font-display text-xl">{t("onboarding.realCta")}</h2>
            <p className="text-sm text-muted">{t("onboarding.notVerified")}</p>
            <Field label={t("onboarding.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label={t("onboarding.displayName")} value={form.displayName} onChange={(v) => setForm({ ...form, displayName: v })} />
            <Field label={t("onboarding.owner")} value={form.ownerName} onChange={(v) => setForm({ ...form, ownerName: v })} />
            <Field label={t("onboarding.phone")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label={t("onboarding.email")} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label={t("onboarding.address")} value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <Field label={t("onboarding.landmark")} value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
            <Field label={t("onboarding.cuisine")} value={form.cuisine} onChange={(v) => setForm({ ...form, cuisine: v })} />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button disabled={busy || !form.name} onClick={() => void createReal()}>
              {t("onboarding.saveDraft")}
            </Button>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="text-xs uppercase tracking-wide text-muted">{t("onboarding.status")}</div>
            <div className="font-display text-2xl">{String(r?.verification_status ?? vendor.selected?.verificationStatus)}</div>
            <p className="mt-1 text-sm text-muted">{t("onboarding.notVerified")}</p>
          </Card>
          <Card className="grid gap-3 md:grid-cols-2">
            <Field label={t("onboarding.cuisine")} value={form.cuisine || String(r?.cuisine ?? "")} onChange={(v) => setForm({ ...form, cuisine: v })} />
            <Field label={t("onboarding.gst")} value={form.gstin || String(r?.gstin ?? "")} onChange={(v) => setForm({ ...form, gstin: v })} />
            <Field label={t("onboarding.fssai")} value={form.fssaiNumber || String(r?.fssai_number ?? "")} onChange={(v) => setForm({ ...form, fssaiNumber: v })} />
            <Field label={t("onboarding.pan")} value={form.pan || String(r?.pan ?? "")} onChange={(v) => setForm({ ...form, pan: v })} />
            <Field label={t("onboarding.bank")} value={form.bankAccount} onChange={(v) => setForm({ ...form, bankAccount: v })} />
            <Field label={t("onboarding.ifsc")} value={form.bankIfsc} onChange={(v) => setForm({ ...form, bankIfsc: v })} />
            <div className="md:col-span-2">
              <Label>{t("onboarding.description")}</Label>
              <Textarea
                value={form.description || String(r?.description ?? "")}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </Card>
          <DocumentUpload restaurantId={vendor.restaurantId} />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={busy} onClick={() => void saveMore()}>
              {t("onboarding.saveDraft")}
            </Button>
            <Button disabled={busy || vendor.dataLabel === "SIMULATED"} onClick={() => void submit()}>
              {t("onboarding.submit")}
            </Button>
          </div>
        </div>
      )}
    </VendorShell>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function DocumentUpload({ restaurantId }: { restaurantId: string }) {
  const t = useT();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <Card className="space-y-2">
      <h3 className="font-medium">{t("onboarding.documents")}</h3>
      <p className="text-xs text-muted">{t("onboarding.storageHint")}</p>
      <input
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className="block w-full text-sm"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("read failed"));
            reader.readAsDataURL(file);
          });
          try {
            const res = await uploadDocument({
              data: {
                restaurantId,
                kind: "FSSAI",
                fileName: file.name,
                contentType: file.type || "application/octet-stream",
                dataUrl,
              },
            });
            setMsg(`Uploaded (${res.storage}). Status ${res.verificationStatus}.`);
          } catch (err) {
            setMsg(err instanceof Error ? err.message : "Upload failed");
          }
        }}
      />
      {msg ? <p className="text-sm text-muted">{msg}</p> : null}
      <p className="text-xs text-faint">{t("onboarding.notVerified")}</p>
    </Card>
  );
}
