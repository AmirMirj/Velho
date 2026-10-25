export interface FetchedPage {
  url: string;
  label: string;
  text: string;
  ok: boolean;
  error?: string;
}

export interface PublicFetchResult {
  pages: FetchedPage[];
  combinedText: string;
  gaps: string[];
}

const FETCH_TIMEOUT_MS = 12_000;
const MAX_CHARS_PER_PAGE = 8_000;
const MAX_COMBINED = 24_000;

const PATHS: { path: string; label: string }[] = [
  { path: "/", label: "homepage" },
  { path: "/en/", label: "/en" },
  { path: "/about", label: "/about" },
  { path: "/about-us", label: "/about-us" },
  { path: "/en/about", label: "/en/about" },
  { path: "/en/about-us", label: "/en/about-us" },
  { path: "/careers", label: "/careers" },
  { path: "/en/careers", label: "/en/careers" },
  { path: "/jobs", label: "/jobs" },
  { path: "/company", label: "/company" },
  { path: "/en/company", label: "/en/company" },
  { path: "/en/investors", label: "/en/investors" },
];

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Browser-like headers — many CDNs (Akamai, etc.) 403 custom bot UAs. */
const BROWSER_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,fi;q=0.8,sv;q=0.7",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Upgrade-Insecure-Requests": "1",
};

async function fetchOne(url: string, label: string): Promise<FetchedPage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: BROWSER_HEADERS,
    });
    if (!res.ok) {
      return {
        url,
        label,
        text: "",
        ok: false,
        error: `HTTP ${res.status} for ${label}`,
      };
    }
    const html = await res.text();
    const text = stripHtml(html).slice(0, MAX_CHARS_PER_PAGE);
    if (text.length < 80) {
      return {
        url,
        label,
        text,
        ok: false,
        error: `Too little public text on ${label}`,
      };
    }
    return { url, label, text, ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      url,
      label,
      text: "",
      ok: false,
      error: `Failed ${label}: ${message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchPublicCompanyPages(
  homepageUrl: string
): Promise<PublicFetchResult> {
  const base = new URL(homepageUrl);
  let origin = `${base.protocol}//${base.host}`;

  let home = await fetchOne(`${origin}/`, "homepage");
  if (!home.ok && !base.host.startsWith("www.")) {
    const wwwOrigin = `${base.protocol}//www.${base.host.replace(/^www\./, "")}`;
    const wwwHome = await fetchOne(`${wwwOrigin}/`, "homepage");
    if (wwwHome.ok) {
      origin = wwwOrigin;
      home = wwwHome;
    }
  }

  const rest = await Promise.all(
    PATHS.filter((p) => p.path !== "/").map(({ path, label }) =>
      fetchOne(`${origin}${path}`, label)
    )
  );
  const pages = [home, ...rest];

  const gaps: string[] = [];
  const okPages = pages.filter((p) => p.ok);
  // Prefer www host when apex homepage was weak but www succeeded earlier.
  // Only surface path failures when coverage is thin — 404s on guessed paths
  // are expected noise for localized sites (e.g. /en/company vs /company).
  if (okPages.length < 2) {
    for (const p of pages) {
      if (!p.ok && p.error) gaps.push(p.error);
    }
  } else {
    const failedPrimary = pages.filter(
      (p) => !p.ok && (p.label === "homepage" || p.label === "/en")
    );
    for (const p of failedPrimary) {
      if (p.error) gaps.push(p.error);
    }
  }

  // Prefer unique content; homepage first
  const chunks: string[] = [];
  let total = 0;
  for (const p of okPages) {
    if (total >= MAX_COMBINED) break;
    const piece = `[SOURCE ${p.label} | ${p.url}]\n${p.text}`;
    chunks.push(piece.slice(0, MAX_COMBINED - total));
    total += piece.length;
  }

  if (okPages.length === 0) {
    gaps.unshift(`No public pages could be fetched from ${origin}`);
  }

  return {
    pages,
    combinedText: chunks.join("\n\n"),
    gaps,
  };
}
