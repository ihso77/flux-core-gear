import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const defaults = {
  title: "Nova Store — Premium Gaming Peripherals & Gear",
  description: "Shop the best gaming keyboards, mice, headsets & accessories. Pro-tested gear with free shipping. Level up your gaming setup with Nova.",
  keywords: "gaming keyboard, gaming mouse, gaming headset, gaming peripherals, esports gear, mechanical keyboard, RGB gaming, pro gaming setup",
  ogImage: "/og-image.png",
};

const SEOHead = ({ title, description, keywords, ogImage, canonical }: SEOProps) => {
  const t = title || defaults.title;
  const d = description || defaults.description;
  const k = keywords || defaults.keywords;
  const img = ogImage || defaults.ogImage;

  useEffect(() => {
    document.title = t;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", d);
    setMeta("keywords", k);
    setMeta("og:title", t, "property");
    setMeta("og:description", d, "property");
    setMeta("og:image", img, "property");
    setMeta("og:type", "website", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", t);
    setMeta("twitter:description", d);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // JSON-LD Structured Data
    const existingLD = document.getElementById("nova-jsonld");
    if (existingLD) existingLD.remove();

    const script = document.createElement("script");
    script.id = "nova-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      name: "Nova Store",
      description: d,
      url: window.location.origin,
      logo: `${window.location.origin}/favicon.ico`,
      priceRange: "$$",
      sameAs: [],
      potentialAction: {
        "@type": "SearchAction",
        target: `${window.location.origin}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("nova-jsonld");
      if (el) el.remove();
    };
  }, [t, d, k, img, canonical]);

  return null;
};

export default SEOHead;
