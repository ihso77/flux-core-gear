import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const defaults = {
  title: "Nova Store — Best Gaming Keyboards, Mouse, Headsets & Peripherals | Buy Online",
  description: "Shop the best gaming keyboards, gaming mouse, headsets & accessories at Nova Store. Pro-tested mechanical keyboards, RGB gaming peripherals, esports gear with free shipping. أفضل أجهزة قيمنق للبيع اونلاين. Level up your gaming setup today!",
  keywords: "gaming keyboard, gaming mouse, gaming headset, gaming peripherals, esports gear, mechanical keyboard, RGB gaming, pro gaming setup, best gaming keyboard 2024, أفضل لوحة مفاتيح قيمنق, أفضل ماوس قيمنق, gaming accessories online, buy gaming gear, gaming setup, Razer, Logitech, SteelSeries, gaming keyboard Saudi Arabia, gaming mouse UAE, best gaming headset, wireless gaming mouse, 60% keyboard, TKL keyboard, gaming monitor, gaming controller, Nova Store, أجهزة ألعاب, ملحقات قيمنق, سماعة قيمنق, لوحة مفاتيح ميكانيكية, gaming peripherals shop, cheap gaming keyboard, premium gaming gear, competitive gaming equipment, FPS gaming mouse, MMO gaming keyboard, streaming gear, content creator setup",
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
    setMeta("robots", "index, follow, max-snippet:-1, max-image-preview:large");
    setMeta("author", "Nova Store");
    setMeta("og:title", t, "property");
    setMeta("og:description", d, "property");
    setMeta("og:image", img, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", "Nova Store", "property");
    setMeta("og:locale", "en_US", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", t);
    setMeta("twitter:description", d);
    setMeta("twitter:image", img);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // JSON-LD
    const existingLD = document.getElementById("nova-jsonld");
    if (existingLD) existingLD.remove();

    const script = document.createElement("script");
    script.id = "nova-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      name: "Nova Store",
      alternateName: "Nova Gaming Store",
      description: d,
      url: window.location.origin,
      logo: `${window.location.origin}/favicon.ico`,
      image: `${window.location.origin}${img}`,
      priceRange: "$$",
      currenciesAccepted: "USD, SAR, AED",
      paymentAccepted: "Credit Card, Debit Card, PayPal",
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Gaming Peripherals",
        itemListElement: [
          { "@type": "OfferCatalog", name: "Gaming Keyboards" },
          { "@type": "OfferCatalog", name: "Gaming Mice" },
          { "@type": "OfferCatalog", name: "Gaming Headsets" },
          { "@type": "OfferCatalog", name: "Gaming Monitors" },
          { "@type": "OfferCatalog", name: "Gaming Controllers" },
          { "@type": "OfferCatalog", name: "Gaming Accessories" },
        ]
      },
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
