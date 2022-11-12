import Bech32 from './bech32.js'
import BaseX  from './basex.js'

export default class Buff extends Uint8Array {
  constructor(
    data : ArrayBufferLike, 
    size : number | null = null,
    orient : 'le' | 'be' = 'be'
  ) {
    if (size !== null) {
      const tmp = new Uint8Array(size).fill(0)
      tmp.set(new Uint8Array(data))
      data = tmp.buffer
    }
    data = (orient === 'le') 
      ? new Uint8Array(data).reverse() 
      : data
    super(data)
    return this
  }

  static num = (
    number : number,
    size?  : number | null,
    orient : 'le' | 'be' = 'le'
  ) : Buff => {
    return new Buff(numToBytes(number), size, orient)
  }

  static big = (
    number : bigint, 
    size?  : number | null,
    orient : 'le' | 'be' = 'le'
  ) : Buff => {
    return new Buff(bigToBytes(number), size, orient)
  }

  static buff = (x : ArrayBufferLike, s? : number) : Buff => new Buff(x, s)
  static str = (x : string, s? : number) : Buff => new Buff(strToBytes(x), s)
  static hex = (x : string, s? : number) : Buff => new Buff(hexToBytes(x), s)
  static json = (x : object) : Buff => new Buff(strToBytes(JSON.stringify(x)))
  static bech32 = (x : string, v : number) : Buff => new Buff(Bech32.decode(x, v))
  static base58 = (x : string) : Buff => new Buff(BaseX.decode(x, 'base58'))
  static base64 = (x : string) : Buff => new Buff(BaseX.decode(x, 'base64'))
  static b64url = (x : string) : Buff => new Buff(BaseX.decode(x, 'base64url'))

  toNum(orient : 'le' | 'be' = 'le') : number { 
    return (orient === 'le')
      ? bytesToNum(this.reverse()) 
      : bytesToNum(this) 
  }

  toBig(orient : 'le' | 'be' = 'le') : bigint { 
    return (orient === 'le')
      ? bytesToBig(this.reverse())
      : bytesToBig(this)
  }

  toArr() : number[] { return Array.from(this) }
  toStr() : string { return bytesToStr(this) }
  toHex() : string { return bytesToHex(this) }
  toJson() : object { return JSON.parse(bytesToStr(this)) }
  toBytes() : Uint8Array { return new Uint8Array(this) }
  toBech32(hrp : string, v : number) : string { return Bech32.encode(this, hrp ,v) }
  toBase58() : string { return BaseX.encode(this, 'base58') }
  toBase64(padding? : boolean) : string { return BaseX.encode(this, 'base64', padding) }
  toB64url() : string { return BaseX.encode(this, 'base64url') }

  prepend(data : Uint8Array) : Buff {
    return Buff.of(...data, ...this)
  }

  append(data : Uint8Array) : Buff {
    return Buff.of(...this, ...data)
  }

  slice(start? : number, end? : number) : Buff {
    return new Buff(new Uint8Array(this).slice(start, end))
  }

  reverse() : Buff {
    return new Buff(new Uint8Array(this).reverse())
  }

  write(bytes : Uint8Array, offset? : number) : void {
    this.set(bytes, offset)
  }

  addVarint(num = this.length) : Buff {
    return Buff.of(...Buff.getVarint(num), ...this)
  }

  static from(data : Uint8Array | number[] ) : Buff {
    return new Buff(Uint8Array.from(data))
  }

  static of(...args : number[]) : Buff {
    return new Buff(Uint8Array.of(...args))
  }

  static join(arr : Uint8Array[]) : Buff {
    let i, idx = 0
    const totalSize = arr.reduce((prev, curr) => prev + curr.length, 0)
    const totalBytes = new Uint8Array(totalSize)
    for (const bytes of arr) {
      for (i = 0; i < bytes.length; idx++, i++) {
        totalBytes[idx] = bytes[i]
      }
    }
    return new Buff(totalBytes, totalSize)
  }

  static getVarint(num : number) : Buff {
    if (num < 0xFD) {
      return Buff.num(num, 1)
    } else if (num < 0x10000) {
      return Buff.of(0xFD, ...Buff.num(num, 2))
    } else if (num < 0x100000000) {
      return Buff.of(0xFE, ...Buff.num(num, 4))
    } else if (num < 0x10000000000000000) {
      return Buff.of(0xFF, ...Buff.num(num, 8))
    } else {
      throw new Error(`Value is too large: ${num}`)
    }
  }
}

function strToBytes(str : string) : ArrayBufferLike {
  const ec = new TextEncoder()
  return ec.encode(str).buffer
}

function hexToBytes(str : string) : ArrayBufferLike {
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

function numToBytes(num : number) : Uint8Array {
  const bytes = []
  while (num > 0) {
    const byte = num & 0xff
    bytes.push(byte)
    num = (num - byte) / 256
  }
  return Uint8Array.from(bytes)
}

function bigToBytes(big : bigint) : Uint8Array {
  const bytes = []
  while (big > 0n) {
    const byte = big & 0xffn
    bytes.push(Number(byte))
    big = (big - byte) / 256n
  }
  return Uint8Array.from(bytes)
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
