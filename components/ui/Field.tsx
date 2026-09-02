import { cn } from "@/lib/utils"

/** Input base tokenizado; el foco usa el color de marca del evento. */
export function TextInput({
  className,
  invalid,
  ...props
}: React.ComponentPropsWithRef<"input"> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "rounded-control border-hairline bg-surface-alt text-ink placeholder:text-ink-muted/60 h-11 w-full border px-3 text-sm outline-none",
        "focus-visible:border-brand focus-visible:ring-brand/25 focus-visible:ring-2",
        invalid && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25",
        className
      )}
    />
  )
}

export function TextArea({
  className,
  invalid,
  ...props
}: React.ComponentPropsWithRef<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "rounded-control border-hairline bg-surface-alt text-ink placeholder:text-ink-muted/60 w-full border px-3 py-2 text-sm outline-none",
        "focus-visible:border-brand focus-visible:ring-brand/25 focus-visible:ring-2",
        invalid && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25",
        className
      )}
    />
  )
}

export function SelectInput({
  className,
  invalid,
  ...props
}: React.ComponentPropsWithRef<"select"> & { invalid?: boolean }) {
  return (
    <select
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "rounded-control border-hairline bg-surface-alt text-ink h-11 w-full border px-3 text-sm outline-none",
        "focus-visible:border-brand focus-visible:ring-brand/25 focus-visible:ring-2",
        invalid && "border-red-500",
        className
      )}
    />
  )
}

/** Etiqueta + mensaje de error, con la asociacion aria ya resuelta. */
export function FieldShell({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-ink mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span className="text-brand ml-0.5">*</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
