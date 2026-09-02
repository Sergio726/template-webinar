"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { COUNTRIES, isoToFlagEmoji } from "@/lib/countries"
import { cn } from "@/lib/utils"

/**
 * Teléfono con selector de país.
 *
 * Es el selector de banderas del proyecto original, con la lista movida a
 * `lib/countries.ts` y la dependencia de iconos reemplazada por el emoji que se
 * deriva del código ISO. El país no se pregunta: se deduce del prefijo elegido.
 */
export function PhoneField({
  id,
  value,
  dialCode,
  placeholder,
  invalid,
  onValueChange,
  onDialChange,
}: {
  id: string
  value: string
  dialCode: string
  placeholder?: string
  invalid?: boolean
  onValueChange: (value: string) => void
  onDialChange: (dial: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = COUNTRIES.find((c) => c.dial === dialCode) ?? COUNTRIES[0]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative flex gap-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Prefijo telefónico: ${selected.name}`}
        className="rounded-control border-hairline bg-surface-alt text-ink focus-visible:border-brand focus-visible:ring-brand/25 flex h-11 shrink-0 items-center gap-1.5 border px-3 text-sm outline-none focus-visible:ring-2"
      >
        <span aria-hidden>{isoToFlagEmoji(selected.iso)}</span>
        <span className="tabular-nums">{selected.dial}</span>
        <ChevronDown className="text-ink-muted h-3.5 w-3.5" aria-hidden />
      </button>

      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onChange={(event) => onValueChange(event.target.value.replace(/[^\d\s]/g, ""))}
        className={cn(
          "rounded-control border-hairline bg-surface-alt text-ink placeholder:text-ink-muted/60 h-11 w-full min-w-0 border px-3 text-sm outline-none",
          "focus-visible:border-brand focus-visible:ring-brand/25 focus-visible:ring-2",
          invalid && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25"
        )}
      />

      {open ? (
        <ul
          role="listbox"
          className="rounded-control border-hairline bg-surface-alt absolute top-12 left-0 z-20 max-h-60 w-64 overflow-y-auto border py-1 shadow-lg"
        >
          {COUNTRIES.map((country) => (
            <li key={country.iso}>
              <button
                type="button"
                role="option"
                aria-selected={country.dial === dialCode}
                onClick={() => {
                  onDialChange(country.dial)
                  setOpen(false)
                }}
                className={cn(
                  "hover:bg-brand-wash flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                  country.dial === dialCode && "bg-brand-wash font-medium"
                )}
              >
                <span aria-hidden>{isoToFlagEmoji(country.iso)}</span>
                <span className="text-ink flex-1 truncate">{country.name}</span>
                <span className="text-ink-muted tabular-nums">{country.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
