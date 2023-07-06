import { Bytes } from './types.js'

const ec = new TextEncoder()
const dc = new TextDecoder()

export function bin2Num (
  bin : number[] | string
) : number {
  if (typeof bin === 'string') {
    bin = bin.split('').map(e => parseInt(e))
  }
  return bin.reduce((prev, next) => {
    if (next !== 1 && next !== 0) {
      throw new Error('Invalid bit: ' + String(next))
    }
    return prev * 2 + next
  })
}

export function num2Bin (
  num : number | bigint
) : number[] {
  const bits = []
  let sum = BigInt(num)
  while (sum > 1) {
    bits.push((sum % 2n === 1n) ? 1 : 0)
    sum = sum / 2n
  }
  if (sum === 1n) bits.push(1)
  return bits.reverse()
}

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
  bytes.reverse()
  return new Uint8Array(bytes)
}

/**
 * Convert a binary string or array of 0s and 1s into a Uint8Array.
 * @param {string | number[]} binary - A binary string or an array of 0s and 1s.
 * @return {Uint8Array} The resulting Uint8Array.
 */
export function binaryToBytes (binary : string | number[]) : Uint8Array {
  if (typeof binary === 'string') {
    binary = binary.split('').map(Number)
  } else if (!Array.isArray(binary)) {
    throw new Error('Invalid input type: expected a string or an array of numbers.')
  }

  if (binary.length % 8 !== 0) {
    throw new Error(`Binary array is invalid length: ${binary.length}`)
  }

  const bytes = new Uint8Array(binary.length / 8)
  for (let i = 0, ct = 0; i < binary.length; i += 8, ct++) {
    let byte = 0
    for (let j = 0; j < 8; j++) {
      byte |= (binary[i + j] << (7 - j))
    }
    bytes[ct] = byte
  }

  return bytes
}

export function bytesToBinary (bytes : Uint8Array) : number[] {
  // Create a binary array that is sized to (number of bytes) * 8.
  const bin = new Array(bytes.length * 8)

  let count = 0

  // Iterate through each number in the byte array.
  for (const num of bytes) {
    if (num > 255) {
      // Throw an error on invalid number ranges.
      throw new Error(`Invalid byte value: ${num}. Byte values must be between 0 and 255.`)
    }

    // Convert the current number into bits using bitwise operations.
    for (let i = 7; i >= 0; i--, count++) {
      bin[count] = (num >> i) & 1
    }
  }

  // Return the complete binary array.
  return bin
}

export function bigToBytes (big : bigint) : Uint8Array {
  if (big === 0n) return Uint8Array.of(0x00)
  const bytes = []
  while (big > 0n) {
    const byte = big & 0xffn
    bytes.push(Number(byte))
    big = (big - byte) / 256n
  }
  bytes.reverse()
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
    return new Uint8Array(value)
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

export function normalize (bytes : Bytes) : Uint8Array {
  return buffer(bytes, true)
}

export function hexify (bytes : Bytes) : string {
  bytes = buffer(bytes, true)
  return bytesToHex(bytes)
}

export function serialize (data : any) : Uint8Array {
  if (typeof data === 'object') {
    if (data instanceof Uint8Array) {
      return data
    }
    try {
      return strToBytes(JSON.stringify(data))
    } catch { throw TypeError('Object is not serializable.') }
  }
  return buffer(data, false)
}

export function revive<T = Object> (data : any) : string | T {
  if (data instanceof Uint8Array) {
    data = bytesToStr(data)
  }
  if (typeof data === 'string') {
    try { return JSON.parse(data) } catch { return data }
  }
  return data
}

export const Hex = {
  encode    : (x : Uint8Array) => bytesToHex(x),
  decode    : (x : string)     => hexToBytes(x),
  normalize : (x : Bytes)      => buffer(x),
  serialize : (x : Bytes)      => bytesToHex(buffer(x))
}

export const Txt = {
  encode    : (x : Uint8Array) => bytesToStr(x),
  decode    : (x : string)     => strToBytes(x),
  serialzie : (x : any)        => serialize(x),
  revive    : (x : string)     => revive(x)
}
