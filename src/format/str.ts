import { is_hex } from '../assert.js'
import { Endian } from '../types.js'

const ec  = new TextEncoder()
const dc  = new TextDecoder()

export function strToBytes (str : string) : Uint8Array {
  return ec.encode(str)
}

export function bytesToStr (bytes : Uint8Array) : string {
  return dc.decode(bytes)
}

function hex_size (
  hexstr  : string,
  size   ?: number
) : number {
  is_hex(hexstr)
  const len = hexstr.length / 2
  if (size === undefined) size = len
  if (len > size) {
     throw new TypeError(`Hex string is larger than array size: ${len} > ${size}`)
  }
  return size
}

export function hexToBytes (
  hexstr : string,
  size  ?: number,
  endian : Endian = 'le'
) : Uint8Array {
  size = hex_size(hexstr, size)
  const use_le   = (endian === 'le')
  const buffer   = new ArrayBuffer(size)
  const dataView = new DataView(buffer)
    let offset   = (use_le) ? 0 : size - 1
  for (let i = 0; i < hexstr.length; i += 2) {
    const char = hexstr.substring(i, i + 2)
    const num  = parseInt(char, 16)
    if (use_le) {
      dataView.setUint8(offset++, num)
    } else {
      dataView.setUint8(offset--, num)
    }
  }
  return new Uint8Array(buffer)
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
