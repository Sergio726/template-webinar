import { splitBold } from "@/lib/utils"

/**
 * Renderiza un parrafo del config admitiendo **negritas**. Es el unico markup
 * permitido: alcanza para enfatizar una frase sin dejar entrar HTML arbitrario
 * desde un archivo de configuracion.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <p className={className}>
      {splitBold(text).map((chunk, index) =>
        chunk.bold ? (
          <strong key={index} className="text-ink font-semibold">
            {chunk.text}
          </strong>
        ) : (
          <span key={index}>{chunk.text}</span>
        )
      )}
    </p>
  )
}
