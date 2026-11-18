
"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const GA_ID = "G-SNFLT5JLED";

function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag || !pathname) return;

    const query = searchParams.toString();
    const pageUrl = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.origin + pageUrl,
      page_path: pageUrl,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};

          window.gtag('js', new Date());

          window.gtag('config', '${GA_ID}', {
            send_page_view: false
          });
        `}
      </Script>

      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  );
}
