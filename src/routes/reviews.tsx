import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorShell } from "@/components/vendor-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { useT } from "@/components/use-t";
import { useVendor } from "@/components/use-vendor";
import { getReviews, respondToReview } from "@/lib/server/api-more";

export const Route = createFileRoute("/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  const t = useT();
  const vendor = useVendor();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["reviews", vendor.restaurantId],
    queryFn: () => getReviews({ data: { restaurantId: vendor.restaurantId } }),
    enabled: Boolean(vendor.restaurantId),
  });

  return (
    <VendorShell title={t("nav.reviews")} dataLabel={q.data?.dataLabel ?? vendor.dataLabel}>
      <p className="text-sm text-muted">{t("reviews.cannotDelete")}</p>
      {(q.data?.reviews.length ?? 0) === 0 ? (
        <Card className="text-sm text-muted">{t("reviews.empty")}</Card>
      ) : (
        q.data?.reviews.map((r) => (
          <ReviewRow
            key={r.id}
            review={r}
            canRespond={Boolean(q.data?.canRespond)}
            restaurantId={vendor.restaurantId}
            onSaved={() => void qc.invalidateQueries({ queryKey: ["reviews"] })}
          />
        ))
      )}
    </VendorShell>
  );
}

function ReviewRow({
  review,
  canRespond,
  restaurantId,
  onSaved,
}: {
  review: {
    id: string;
    rating: number;
    body: string;
    createdAt: string;
    response: string | null;
    dataLabel: string;
  };
  canRespond: boolean;
  restaurantId?: string;
  onSaved: () => void;
}) {
  const t = useT();
  const [text, setText] = useState(review.response ?? "");
  return (
    <Card className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold tabular">{review.rating}/5</span>
        <span className="text-muted">{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>
      </div>
      <p>{review.body}</p>
      {review.response ? <p className="rounded-[12px] bg-surface-2 p-2 text-sm">{review.response}</p> : null}
      {canRespond ? (
        <div className="space-y-2">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} />
          <Button
            variant="secondary"
            onClick={() =>
              void respondToReview({
                data: { restaurantId, reviewId: review.id, body: text },
              }).then(onSaved)
            }
          >
            {t("reviews.respond")}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
