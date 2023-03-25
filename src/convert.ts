const ec = new TextEncoder()
const dc = new TextDecoder()

export function strToBytes (str : string) : Uint8Array {
  return ec.encode(str)
}

export function hexToBytes (str : string) : Uint8Array {
  const bytes = new Uint8Array(str.length / 2)
  let i, idx = 0
  if (str.match(/[^a-fA-f0-9]/) !== null) {
    throw new TypeError('Invalid hex string: ' + str)
  }
  if (str.length % 2 > 0) {
    throw new Error(`Hex string length is uneven: ${str.length}`)
  }
  for (i = 0; i < str.length; i += 2) {
    bytes[idx] = parseInt(str.slice(i, i + 2), 16)
    idx += 1
  }
  return bytes
}

export function numToBytes (num : number) : Uint8Array {
  if (num === 0) return Uint8Array.of(0x00)
  const bytes = []
  while (num > 0) {
    const byte = num & 0xff
    bytes.push(byte)
    num = (num - byte) / 256
  }
  return new Uint8Array(bytes)
}

export function binaryToBytes (binary : number[]) : Uint8Array {
  const bytes = []
  if (binary.length % 8 !== 0) {
    throw new Error('Binary array is invalid length: ' + String(binary.length))
  }
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8).map(e => String(e)).join('')
    bytes.push(parseInt(byte, 2))
  }
  return new Uint8Array(bytes)
}

export function bytesToBinary (bytes : Uint8Array) : number[] {
  const binary = []
  for (const num of bytes) {
    const bits = num
      .toString(2)
      .padStart(8, '0')
      .split('')
      .map(e => parseInt(e))
    binary.push(...bits)
  }
  return binary
}

export function bigToBytes (big : bigint) : Uint8Array {
  if (big === 0n) return Uint8Array.of(0x00)
  const bytes = []
  while (big > 0n) {
    const byte = big & 0xffn
    bytes.push(Number(byte))
    big = (big - byte) / 256n
  }
  return new Uint8Array(bytes)
}

export function bytesToStr (bytes : Uint8Array) : string {
  return dc.decode(bytes)
}

export function bytesToHex (bytes : Uint8Array) : string {
  const chars = new Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
   chars.push(bytes[i].toString(16).padStart(2, '0'))
  }
  return chars.join('')
}

export function bytesToNum (bytes : Uint8Array) : number {
  let num = 0, i
  for (i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256) + bytes[i]
  }
  return Number(num)
}

export function bytesToBig (bytes : Uint8Array) : bigint {
  let num = 0n, i
  for (i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256n) + BigInt(bytes[i])
  }
  return BigInt(num)
}

export function buffer (value : any, bytes = true) : Uint8Array {
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value)
  }
  if (value instanceof Uint8Array) {
    return value
  }
  switch (typeof value) {
    case 'bigint':
      return bigToBytes(value)
    case 'boolean':
      return Uint8Array.of(value ? 1 : 0)
    case 'number':
      return numToBytes(value)
    case 'string':
      return (bytes)
        ? hexToBytes(value)
        : ec.encode(value)
    default:
      throw TypeError('Unsupported format:' + String(typeof value))
  }
}
