import type { EventConfig } from "@/lib/types"

/** Pie de pagina. */
export function Footer({ config }: { config: EventConfig }) {
  const { brand } = config

  return (
    <footer className="bg-ink px-4 py-10 text-center">
      <p className="text-surface text-sm font-semibold">{brand.name}</p>
      {brand.tagline ? (
        <p className="text-surface/70 mt-1 text-sm">{brand.tagline}</p>
      ) : null}

      {brand.links.length > 0 ? (
        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {brand.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-surface/60 hover:text-surface text-xs underline underline-offset-4 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-surface/40 mt-4 text-xs">
        {brand.legal ?? `© ${new Date().getFullYear()} ${brand.name}. Todos los derechos reservados.`}
      </p>

      {/*
        Descargo legal. Va deliberadamente en cuerpo chico y bajo contraste: hay
        que publicarlo, pero no compite con el resto de la pagina.
      */}
      {brand.disclaimer ? (
        <p className="text-surface/35 mx-auto mt-6 max-w-3xl text-[11px] leading-relaxed">
          {brand.disclaimer}
        </p>
      ) : null}
    </footer>
  )
}
