import {
  fetchIndexerWithFallback,
  resolveIndexerOrigins,
} from "@/lib/indexer-endpoint";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyIndexer(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const upstreamPath = `/${path.map(encodeURIComponent).join("/")}${
    new URL(request.url).search
  }`;

  try {
    const { response, origin } = await fetchIndexerWithFallback(
      upstreamPath,
      {
        method: request.method,
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
      resolveIndexerOrigins("/api/indexer"),
    );

    const headers = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    headers.set("cache-control", "no-store");
    headers.set("x-resolve-indexer-origin", origin);

    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return Response.json(
      { error: "All indexer upstreams are unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}

export const GET = proxyIndexer;
export const HEAD = proxyIndexer;
