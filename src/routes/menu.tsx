import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { MoneyText } from "@/components/money-text";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { can } from "@/lib/rbac";
import { rupeesToPaise } from "@/lib/money";
import {
  duplicateItem,
  getMenu,
  saveAddon,
  saveCategory,
  saveItem,
  setAvailability,
} from "@/lib/server/api-menu";

export const Route = createFileRoute("/menu")({ component: MenuPage });

function MenuPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const menu = useQuery({
    queryKey: ["menu", vendor.restaurantId],
    queryFn: () => getMenu({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId),
  });
  const canEdit = vendor.role ? can(vendor.role, "menu.edit") : false;
  const canAvail = vendor.role ? can(vendor.role, "availability.edit") : false;
  const [catName, setCatName] = useState("");
  const [addonName, setAddonName] = useState("");
  const [addonPrice, setAddonPrice] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [editor, setEditor] = useState<null | {
    id?: string;
    categoryId: string;
    name: string;
    description: string;
    diet: "VEG" | "NONVEG" | "EGG";
    recommended: boolean;
    addonIds: string[];
    variants: { name: string; price: string }[];
  }>(null);

  const grouped = useMemo(() => {
    const cats = menu.data?.categories ?? [];
    const items = menu.data?.items ?? [];
    return cats.map((c) => ({ ...c, items: items.filter((i) => i.category_id === c.id) }));
  }, [menu.data]);

  async function bulk(status: "sold_out" | "available") {
    if (!selected.length) return;
    await setAvailability({
      data: { restaurantId: vendor.restaurantId, itemIds: selected, status },
    });
    setSelected([]);
    void qc.invalidateQueries({ queryKey: ["menu"] });
  }

  return (
    <VendorShell
      title={t("menu.title")}
      dataLabel={menu.data?.dataLabel ?? vendor.dataLabel}
      restaurantName={vendor.selected?.restaurantName}
    >
      {canEdit ? (
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!catName.trim()) return;
            await saveCategory({ data: { restaurantId: vendor.restaurantId, name: catName } });
            setCatName("");
            void qc.invalidateQueries({ queryKey: ["menu"] });
          }}
        >
          <Input
            placeholder={t("menu.addCategory")}
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />
          <Button type="submit">{t("menu.addCategory")}</Button>
        </form>
      ) : null}

      {canAvail && selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void bulk("sold_out")}>
            {t("menu.bulkSoldOut")}
          </Button>
          <Button variant="secondary" onClick={() => void bulk("available")}>
            {t("menu.bulkAvailable")}
          </Button>
        </div>
      ) : null}

      {grouped.length === 0 ? (
        <Card className="text-sm text-muted">{t("menu.noItems")}</Card>
      ) : (
        grouped.map((cat) => (
          <section key={cat.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">{cat.name}</h2>
              {canEdit ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setEditor({
                      categoryId: cat.id,
                      name: "",
                      description: "",
                      diet: "NONVEG",
                      recommended: false,
                      addonIds: [],
                      variants: [{ name: "Regular", price: "" }],
                    })
                  }
                >
                  {t("menu.addItem")}
                </Button>
              ) : null}
            </div>
            <div className="grid gap-2">
              {cat.items.map((item) => (
                <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                  <label className="flex min-h-11 items-start gap-3">
                    {canAvail ? (
                      <input
                        type="checkbox"
                        className="mt-1 size-4"
                        checked={selected.includes(item.id)}
                        onChange={(e) =>
                          setSelected((cur) =>
                            e.target.checked ? [...cur, item.id] : cur.filter((id) => id !== item.id),
                          )
                        }
                      />
                    ) : null}
                    <div>
                      <div className="font-medium">
                        {item.name}{" "}
                        <span className="text-xs uppercase text-muted">{item.diet}</span>
                        {item.recommended ? (
                          <span className="ml-2 text-xs text-chili">{t("menu.recommended")}</span>
                        ) : null}
                      </div>
                      <div className="text-sm text-muted">{item.description}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm">
                        {item.variants.map((v) => (
                          <span key={v.id} className="rounded-full bg-surface-2 px-2 py-0.5">
                            {v.name} <MoneyText paise={v.pricePaise} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={item.availability === "available" ? "secondary" : "primary"}
                      onClick={() =>
                        void setAvailability({
                          data: {
                            restaurantId: vendor.restaurantId,
                            itemIds: [item.id],
                            status: item.availability === "available" ? "sold_out" : "available",
                          },
                        }).then(() => qc.invalidateQueries({ queryKey: ["menu"] }))
                      }
                    >
                      {item.availability === "available" ? t("menu.soldOut") : t("menu.available")}
                    </Button>
                    {item.availability === "available" ? (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          void setAvailability({
                            data: {
                              restaurantId: vendor.restaurantId,
                              itemIds: [item.id],
                              status: "temporarily_unavailable",
                            },
                          }).then(() => qc.invalidateQueries({ queryKey: ["menu"] }))
                        }
                      >
                        {t("menu.unavailable")}
                      </Button>
                    ) : null}
                    {canEdit ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            void duplicateItem({
                              data: { restaurantId: vendor.restaurantId, itemId: item.id },
                            }).then(() => qc.invalidateQueries({ queryKey: ["menu"] }))
                          }
                        >
                          {t("menu.duplicate")}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setEditor({
                              id: item.id,
                              categoryId: item.category_id,
                              name: item.name,
                              description: item.description,
                              diet: (item.diet as "VEG" | "NONVEG" | "EGG") ?? "NONVEG",
                              recommended: Boolean(item.recommended),
                              addonIds: item.addonIds ?? [],
                              variants: item.variants.map((v) => ({
                                name: v.name,
                                price: String(v.pricePaise / 100),
                              })),
                            })
                          }
                        >
                          {t("menu.edit")}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))
      )}

      <Card className="space-y-3">
        <h3 className="font-display text-lg">{t("menu.addons")}</h3>
        <ul className="text-sm">
          {(menu.data?.addons ?? []).map((a) => (
            <li key={a.id} className="flex justify-between border-b border-line py-2">
              <span>{a.name}</span>
              <MoneyText paise={a.pricePaise} />
            </li>
          ))}
        </ul>
        {canEdit ? (
          <form
            className="grid gap-2 md:grid-cols-[1fr_120px_auto]"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!addonName.trim() || !addonPrice) return;
              await saveAddon({
                data: {
                  restaurantId: vendor.restaurantId,
                  name: addonName,
                  pricePaise: rupeesToPaise(Number(addonPrice)),
                },
              });
              setAddonName("");
              setAddonPrice("");
              void qc.invalidateQueries({ queryKey: ["menu"] });
            }}
          >
            <Input placeholder={t("menu.addAddon")} value={addonName} onChange={(e) => setAddonName(e.target.value)} />
            <Input
              inputMode="decimal"
              placeholder={t("menu.price")}
              value={addonPrice}
              onChange={(e) => setAddonPrice(e.target.value)}
            />
            <Button type="submit">{t("menu.addAddon")}</Button>
          </form>
        ) : null}
      </Card>

      {editor ? (
        <Card className="space-y-3">
          <h3 className="font-display text-lg">{editor.id ? t("menu.edit") : t("menu.addItem")}</h3>
          <div>
            <Label>{t("menu.name")}</Label>
            <Input value={editor.name} onChange={(e) => setEditor({ ...editor, name: e.target.value })} />
          </div>
          <div>
            <Label>{t("menu.description")}</Label>
            <Textarea
              value={editor.description}
              onChange={(e) => setEditor({ ...editor, description: e.target.value })}
            />
          </div>
          <div>
            <Label>{t("onboarding.vegStatus")}</Label>
            <select
              className="h-11 w-full rounded-[12px] border border-line bg-surface px-3"
              value={editor.diet}
              onChange={(e) => setEditor({ ...editor, diet: e.target.value as typeof editor.diet })}
            >
              <option value="VEG">{t("menu.veg")}</option>
              <option value="NONVEG">{t("menu.nonveg")}</option>
              <option value="EGG">{t("menu.egg")}</option>
            </select>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editor.recommended}
              onChange={(e) => setEditor({ ...editor, recommended: e.target.checked })}
            />
            {t("menu.recommended")}
          </label>
          {editor.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Input
                value={v.name}
                onChange={(e) => {
                  const variants = [...editor.variants];
                  variants[i] = { ...v, name: e.target.value };
                  setEditor({ ...editor, variants });
                }}
              />
              <Input
                inputMode="decimal"
                placeholder={t("menu.price")}
                value={v.price}
                onChange={(e) => {
                  const variants = [...editor.variants];
                  variants[i] = { ...v, price: e.target.value };
                  setEditor({ ...editor, variants });
                }}
              />
            </div>
          ))}
          <Button
            variant="secondary"
            type="button"
            onClick={() => setEditor({ ...editor, variants: [...editor.variants, { name: "", price: "" }] })}
          >
            {t("menu.variants")}
          </Button>
          {(menu.data?.addons.length ?? 0) > 0 ? (
            <div className="space-y-1">
              <Label>{t("menu.addons")}</Label>
              {menu.data?.addons.map((a) => (
                <label key={a.id} className="flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editor.addonIds.includes(a.id)}
                    onChange={(e) =>
                      setEditor({
                        ...editor,
                        addonIds: e.target.checked
                          ? [...editor.addonIds, a.id]
                          : editor.addonIds.filter((id) => id !== a.id),
                      })
                    }
                  />
                  {a.name} <MoneyText paise={a.pricePaise} />
                </label>
              ))}
            </div>
          ) : null}
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                await saveItem({
                  data: {
                    restaurantId: vendor.restaurantId,
                    id: editor.id,
                    categoryId: editor.categoryId,
                    name: editor.name,
                    description: editor.description,
                    diet: editor.diet,
                    recommended: editor.recommended,
                    addonIds: editor.addonIds,
                    variants: editor.variants
                      .filter((v) => v.name && v.price)
                      .map((v) => ({ name: v.name, pricePaise: rupeesToPaise(Number(v.price)) })),
                  },
                });
                setEditor(null);
                void qc.invalidateQueries({ queryKey: ["menu"] });
              }}
            >
              {t("menu.save")}
            </Button>
            <Button variant="ghost" onClick={() => setEditor(null)}>
              {t("common.cancel")}
            </Button>
          </div>
        </Card>
      ) : null}
    </VendorShell>
  );
}
