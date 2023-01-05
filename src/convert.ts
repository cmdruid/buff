const ec = new TextEncoder()
const dc = new TextDecoder()

export function strToBytes(str : string) : ArrayBufferLike {
  return ec.encode(str).buffer
}

export function hexToBytes(str : string) : ArrayBufferLike {
  const bytes = []; let i, idx = 0
  if (str.length % 2 > 0) {
    throw new Error(`Invalid hex string length: ${str.length}`)
  }
  for (i = 0; i < str.length; i += 2) {
    bytes[idx] = parseInt(str.slice(i, i + 2), 16)
    idx += 1
  }
  return Uint8Array.from(bytes).buffer
}

export function numToBytes(num : number) : Uint8Array {
  const bytes = []
  while (num > 0) {
    const byte = num & 0xff
    bytes.push(byte)
    num = (num - byte) / 256
  }
  return Uint8Array.from(bytes)
}

export function bigToBytes(big : bigint) : Uint8Array {
  const bytes = []
  while (big > 0n) {
    const byte = big & 0xffn
    bytes.push(Number(byte))
    big = (big - byte) / 256n
  }
  return Uint8Array.from(bytes)
}

export function bytesToStr(bytes : Uint8Array) : string {
  return dc.decode(bytes)
}

export function bytesToHex(bytes : Uint8Array) : string {
  const hex = []; let i
  for (i = 0; i < bytes.length; i++) {
    hex.push(bytes[i].toString(16).padStart(2, '0'))
  }
  return hex.join('')
}

export function bytesToNum(bytes : Uint8Array) : number {
  let num = 0, i
  for (i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256) + bytes[i]
  }
  return Number(num)
}

export function bytesToBig(bytes : Uint8Array) : bigint {
  let num = 0n, i
  for (i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256n) + BigInt(bytes[i])
  }
  return BigInt(num)
}
