export function isPrivateIP(host: string): boolean {
  try {
    const rawIp = host.startsWith('[') ? host.slice(1, -1) : host

    if (rawIp === 'localhost') return true

    if (rawIp.includes('.')) {
      const parts = rawIp.split('.').map(Number)
      if (parts.length !== 4 || parts.some(isNaN)) return false

      return (
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        (parts[0] === 169 && parts[1] === 254)
      )
    }

    if (rawIp.includes(':')) {
      const ip = rawIp.split('%')[0]

      if (ip === '::1') return true

      const firstHextet = parseInt(ip.split(':')[0], 16)
      if ((firstHextet & 0xfe00) === 0xfc00) return true

      if ((firstHextet & 0xffc0) === 0xfe80) return true

      return false
    }

    return false
  } catch {
    return false
  }
}
