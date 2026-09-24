export const dynamic = "force-dynamic";
export function GET() {
  const body = process.env.DMRK_PUBLIC_SITE === "true"
    ? "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /livewire\nSitemap: https://dmrkinsights.com/sitemap.xml\n"
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, {headers:{"Content-Type":"text/plain; charset=utf-8"}});
}
