import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-ink text-3xl font-bold">Evento no disponible</h1>
      <p className="text-ink-muted mt-3 max-w-sm text-sm">
        El enlace no corresponde a ningun evento activo. Puede que ya haya finalizado.
      </p>
      <Link
        href="/"
        className="text-brand mt-6 text-sm font-semibold underline underline-offset-4"
      >
        Ver eventos disponibles
      </Link>
    </main>
  )
}
