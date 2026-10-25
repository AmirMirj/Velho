export type NormalizedInput =
  | { kind: "domain"; domain: string; homepageUrl: string; inputRaw: string }
  | { kind: "name"; name: string; inputRaw: string };

function stripWww(host: string): string {
  return host.replace(/^www\./i, "").toLowerCase();
}

/**
 * Accepts a URL, bare domain, or company name.
 * URLs/domains: strip path/query → hostname.
 * Names: returned for caller to resolve (or prompt for domain).
 */
export function normalizeCompanyInput(raw: string): NormalizedInput {
  const inputRaw = raw.trim();
  if (!inputRaw) {
    throw new Error("Input is empty");
  }

  let candidate = inputRaw;
  if (!/^https?:\/\//i.test(candidate) && /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  if (/^https?:\/\//i.test(candidate)) {
    try {
      const url = new URL(candidate);
      const domain = stripWww(url.hostname);
      if (!domain || !domain.includes(".")) {
        return { kind: "name", name: inputRaw, inputRaw };
      }
      return {
        kind: "domain",
        domain,
        homepageUrl: `https://${domain}/`,
        inputRaw,
      };
    } catch {
      return { kind: "name", name: inputRaw, inputRaw };
    }
  }

  return { kind: "name", name: inputRaw, inputRaw };
}

/** Heuristic: turn a company name into a guessed .com/.fi domain for demo. */
export function guessDomainFromName(name: string): string | null {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
  if (slug.length < 2) return null;
  return `${slug}.com`;
}
