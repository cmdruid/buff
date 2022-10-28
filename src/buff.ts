import Bech32 from './format/bech32.js'
import Base58 from './format/base58.js'
import Base64 from './format/base64.js'

export default class Buff extends Uint8Array {
  constructor(data : ArrayBufferLike, size? : number) {
    if (size) {
      const tmp = new Uint8Array(size).fill(0)
      tmp.set(new Uint8Array(data))
      data = tmp.buffer
    }
    super(data)
    return this
  }

  static str = (x : string, s? : number) => new Buff(strToBytes(x), s)
  static hex = (x : string, s? : number) => new Buff(hexToBytes(x), s)
  static num = (x : number, s? : number) => new Buff(numToBytes(x), s)
  static big = (x : bigint, s? : number) => new Buff(bigToBytes(x), s)
  static buff = (x : ArrayBufferLike, s? : number) => new Buff(x, s)
  static json = (x : object) => new Buff(strToBytes(JSON.stringify(x)))
  static bech32 = (x : string) => new Buff(Bech32.decode(x))
  static base58 = (x : string) => new Buff(Base58.decode(x))
  static base64 = (x : string) => new Buff(Base64.decode(x))
  // static b64url = (x : string) => new Buff(Base64.decode(x))

  toArr() { Array.from(this) }
  toStr() { return bytesToStr(this) }
  toNum() { return bytesToNum(this) }
  toBig() { return bytesToBig(this) }
  toHex() { return bytesToHex(this) }
  toJson() { return JSON.parse(bytesToStr(this)) }
  toBytes() { return new Uint8Array(this) }
  toBase32() { return Bech32.encode(this) }
  toBase58() { return Base58.encode(this) }
  toBase64() { return Base64.encode(this) }
  // toB64url = () => Base64.encode(this)
}

function strToBytes(str : string) : ArrayBufferLike {
  const ec = new TextEncoder()
  return ec.encode(str).buffer
}

function hexToBytes(str : string) : ArrayBufferLike {
  const bytes = []; let i, idx = 0
  if (str.length % 2) {
    throw new Error(`Invalid hex string length: ${str.length}`)
  }
  for (i = 0; i < str.length; i += 2) {
    bytes[idx] = parseInt(str.slice(i, i + 2), 16)
    idx += 1
  }
  return Uint8Array.from(bytes).buffer
}

function numToBytes(num : number) : ArrayBufferLike {
  const bytes = []
  while (num > 0) {
    const byte = num & 0xff
    bytes.push(byte)
    num = (num - byte) / 256
  }
  return Uint8Array.from(bytes).buffer
}

function bigToBytes(big : bigint) : ArrayBufferLike {
  const bytes = []
  while (big > 0n) {
    const byte = big & 0xffn
    bytes.push(Number(byte))
    big = (big - byte) / 256n
  }
  return Uint8Array.from(bytes).buffer
}

function bytesToStr(bytes : Uint8Array) : string {
  const dc = new TextDecoder()
  return dc.decode(bytes)
}

function bytesToHex(bytes : Uint8Array) : string {
  const hex = []; let i
  for (i = 0; i < bytes.length; i++) {
    hex.push(bytes[i].toString(16).padStart(2, '0'))
  }
  return hex.join('')
}

function bytesToNum(bytes : Uint8Array) : number {
  let num = 0, i
  for (i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256) + bytes[i]
  }
  return Number(num)
}

function bytesToBig(bytes : Uint8Array) : bigint {
  let num = 0n, i
  for (i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256n) + BigInt(bytes[i])
  }
  return BigInt(num)
}
