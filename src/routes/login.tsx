import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RoshoiMark } from "@/components/mark";
import { useT } from "@/components/use-t";
import { platformConfig } from "@/lib/platform-config";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const t = useT();
  const { user } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setWorking(true);
    setError(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || email.split("@")[0] });
        if (res.error) throw new Error(res.error.message || t("auth.error"));
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || t("auth.error"));
      }
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error"));
      setWorking(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bg px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <Link to="/" className="flex items-center gap-2 text-ink">
          <RoshoiMark className="size-10 text-chili" />
          <div>
            <div className="font-display text-2xl">{platformConfig.brand.appName}</div>
            <div className="text-sm text-muted">{platformConfig.brand.tagline}</div>
          </div>
        </Link>

        <div className="rounded-[28px] border border-line bg-surface p-6 shadow-soft">
          <h1 className="font-display text-3xl">{mode === "in" ? t("auth.signIn") : t("auth.signUp")}</h1>
          <p className="mt-1 text-sm text-muted">{t("landing.forOwners")}</p>

          {authEnabled ? (
            <div className="mt-5 grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  onClick={() => signIn(p.providerId, { callbackURL: "/dashboard" })}
                >
                  {p.idp === "google" ? t("auth.continueGoogle") : t("auth.continueX")}
                </Button>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Sign-in is disabled.</p>
          )}

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-faint">
            <span className="h-px flex-1 bg-line" />
            {t("auth.orEmail")}
            <span className="h-px flex-1 bg-line" />
          </div>

          <form className="space-y-3" onSubmit={onEmail}>
            {mode === "up" ? (
              <div>
                <Label htmlFor="name">{t("auth.name")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
            ) : null}
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
              />
              <p className="mt-1 text-xs text-faint">{t("auth.passwordHint")}</p>
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" size="lg" disabled={working}>
              {working ? t("auth.working") : mode === "in" ? t("auth.signIn") : t("auth.signUp")}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 text-sm text-chili"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
          >
            {mode === "in" ? t("auth.noAccount") : t("auth.haveAccount")}
          </button>
        </div>
      </div>
    </main>
  );
}
