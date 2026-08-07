export const normalizeSriLankanMobile = (value: string) => {
  const compact = value.trim().replace(/[\s()-]/g, '')
  if (/^0\d{9}$/.test(compact)) return `+94${compact.slice(1)}`
  if (/^94\d{9}$/.test(compact)) return `+${compact}`
  if (/^\+94\d{9}$/.test(compact)) return compact
  return null
}

export const validateName = (value: string) => {
  const name = value.trim().replace(/\s+/g, ' ')
  if (name.length < 2 || name.length > 100 || !/[A-Za-z\u0D80-\u0DFF]/.test(name)) return null
  return name
}
