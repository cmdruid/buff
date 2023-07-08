const _0n   = BigInt(0)
const _255n = BigInt(255)
const _256n = BigInt(256)

export function bigToBytes (big : bigint) : Uint8Array {
  if (big === _0n) return Uint8Array.of(0x00)
  const bytes = []
  while (big > _0n) {
    const byte = big & _255n
    bytes.push(Number(byte))
    big = (big - byte) / _256n
  }
  return new Uint8Array(bytes)
}

export function bytesToBig (bytes : Uint8Array) : bigint {
  let num = BigInt(0)
  for (let i = bytes.length - 1; i >= 0; i--) {
    num = (num * _256n) + BigInt(bytes[i])
  }
  return BigInt(num)
}
