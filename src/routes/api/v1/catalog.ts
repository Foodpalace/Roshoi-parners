import { createFileRoute } from "@tanstack/react-router";
import { listPublicCatalog } from "@/lib/server/api-menu";

export const Route = createFileRoute("/api/v1/catalog")({
  server: {
    handlers: {
      GET: async () => {
        const body = await listPublicCatalog();
        return new Response(JSON.stringify(body), {
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      },
    },
  },
});
