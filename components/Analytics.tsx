import Script from "next/script"
import type { AnalyticsConfig } from "@/lib/types"

/**
 * Etiquetas de medición, opcionales.
 *
 * Sin IDs en el config no se renderiza nada: la landing no carga ni un byte de
 * terceros. Se conserva del proyecto original la regla que importa — si hay
 * contenedor de Tag Manager, se carga sólo eso, porque el píxel y GA4 se
 * administran desde adentro y cargarlos también acá contaría todo dos veces.
 */
export function Analytics({ analytics }: { analytics: AnalyticsConfig }) {
  if (!analytics.enabled) return null

  if (analytics.gtmId) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${analytics.gtmId}');`}
      </Script>
    )
  }

  return (
    <>
      {analytics.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${analytics.metaPixelId}');`}
        </Script>
      ) : null}

      {analytics.ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${analytics.ga4Id}',{send_page_view:false});`}
          </Script>
        </>
      ) : null}
    </>
  )
}
