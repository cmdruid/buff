import { is_hex } from '../assert.js'

const ec  = new TextEncoder()
const dc  = new TextDecoder()

export function strToBytes (str : string) : Uint8Array {
  return ec.encode(str)
}

export function bytesToStr (bytes : Uint8Array) : string {
  return dc.decode(bytes)
}

export function hexToBytes (str : string) : Uint8Array {
  is_hex(str)
  const bytes = new Uint8Array(str.length / 2)
  for (let i = 0; i < str.length; i += 2) {
    bytes[i / 2] = parseInt(str.substring(i, i + 2), 16)
  }
  return bytes
}

export function bytesToHex (bytes : Uint8Array) : string {
  let chars = ''
  for (let i = 0; i < bytes.length; i++) {
    chars += bytes[i].toString(16).padStart(2, '0')
  }
  return chars
}

export function bytesToJson <T = any> (
  bytes : Uint8Array
) : T {
  const str = bytesToStr(bytes)
  return JSON.parse(str, (_, v) => {
    return typeof v === 'string' && /n$/.test(v)
      ? BigInt(v.slice(0, -1))
      : v
  })
}

export function jsonToBytes <T = any> (
  obj : T | string
) : Uint8Array {
  const str = JSON.stringify(obj, (_, v) => {
    return typeof v === 'bigint'
      ? `${v}n`
      : v
  })
  return strToBytes(str)
}

export const Hex = {
  encode : bytesToHex,
  decode : hexToBytes
}

export const Txt = {
  encode : strToBytes,
  decode : bytesToStr
}
