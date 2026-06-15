export function formatShippingAddress(raw: string | null | undefined): string {
  if (!raw) return ''
  try {
    const a = JSON.parse(raw)
    // Si no hay datos reales (solo se guardó la dirección vacía), devolver vacío
    if (!a.name && !a.line1 && !a.city) return ''
    const lines = [
      [a.name, a.surname].filter(Boolean).join(' '),
      a.email,
      a.phone,
      a.line1,
      a.line2,
      [a.postalCode, a.city].filter(Boolean).join(' '),
      a.country === 'ES' ? 'España' : a.country === 'PT' ? 'Portugal' : a.country === 'FR' ? 'Francia'
        : a.country === 'DE' ? 'Alemania' : a.country === 'IT' ? 'Italia' : a.country === 'GB' ? 'Reino Unido'
        : a.country,
    ].filter(Boolean)
    return lines.join('\n')
  } catch {
    // Formato antiguo (texto plano), devolver tal cual
    return raw
  }
}
