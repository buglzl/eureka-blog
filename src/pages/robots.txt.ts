import type { APIRoute } from "astro";
import { url } from "../utils/url-utils";

const robotsTxt = `
User-agent: *
Disallow: /_astro/

Sitemap: ${new URL(url("sitemap-index.xml"), import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
