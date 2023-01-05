import { webcrypto as crypto } from 'crypto'
import * as C     from './convert.js'
import { Bech32 } from './bech32.js'
import { BaseX  } from './basex.js'

import { Bytes, Data, Json } from './types.js'

export const Hex = {
  encode: (x: Uint8Array) => Buff.buff(x).toHex(),
  decode: (x: string)     => Buff.hex(x).toBytes(),
  normalize: (x : Bytes)  => Buff.normalize(x)
}

export const Txt = {
  encode: (x: Uint8Array) => Buff.buff(x).toStr(),
  decode: (x: string)     => Buff.str(x).toBytes(),
  serialzie: (x : Data)   => Buff.serialize(x),
  revitalize: (x : Data)  => Buff.revitalize(x)
}

export const Base64 = {
  encode: (x : Uint8Array)    => BaseX.encode(x, 'base64'),
  decode: (x : string)        => BaseX.decode(x, 'base64'),
  encodeUrl: (x : Uint8Array) => BaseX.encode(x, 'base64'),
  decodeUrl: (x : string)     => BaseX.decode(x, 'base64')
}

export class Buff extends Uint8Array {

  static num = (
    number : number,
    size?  : number | null,
    orient : 'le' | 'be' = 'le'
  ) : Buff => {
    return new Buff(C.numToBytes(number), size, orient)
  }

  static big = (
    number : bigint, 
    size?  : number | null,
    orient : 'le' | 'be' = 'le'
  ) : Buff => {
    return new Buff(C.bigToBytes(number), size, orient)
  }

  static buff   = (x : ArrayBufferLike, s? : number) : Buff => new Buff(x, s)
  static str    = (x : string, s? : number) : Buff => new Buff(C.strToBytes(x), s)
  static hex    = (x : string, s? : number) : Buff => new Buff(C.hexToBytes(x), s)
  static json   = (x : Json)      : Buff => new Buff(C.strToBytes(JSON.stringify(x)))
  static bech32 = (x : string, v  : number) : Buff => new Buff(Bech32.decode(x, v))
  static base58 = (x : string)    : Buff => new Buff(BaseX.decode(x, 'base58'))
  static base64 = (x : string)    : Buff => new Buff(BaseX.decode(x, 'base64'))
  static b64url = (x : string)    : Buff => new Buff(BaseX.decode(x, 'base64url'))

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

  toNum(orient : 'le' | 'be' = 'le') : number { 
    return (orient === 'le')
      ? C.bytesToNum(this.reverse()) 
      : C.bytesToNum(this) 
  }

  toBig(orient : 'le' | 'be' = 'le') : bigint { 
    return (orient === 'le')
      ? C.bytesToBig(this.reverse())
      : C.bytesToBig(this)
  }

  toArr()    : number[] { return Array.from(this) }
  toStr()    : string { return C.bytesToStr(this) }
  toHex()    : string { return C.bytesToHex(this) }
  toJson()   : Json   { return JSON.parse(C.bytesToStr(this)) }
  toBytes()  : Uint8Array { return new Uint8Array(this) }
  toBase58() : string { return BaseX.encode(this, 'base58') }
  toB64url() : string { return BaseX.encode(this, 'base64url') }
  toBech32(hrp : string, v : number) : string { return Bech32.encode(this, hrp ,v) }
  toBase64(padding? : boolean) : string { return BaseX.encode(this, 'base64', padding) }

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

  prependVarint(num = this.length) : Buff {
    return Buff.of(...Buff.readVarint(num), ...this)
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

  static readVarint(num : number) : Buff {
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

  static random(size: number = 32): Buff {
    return new Buff(crypto.getRandomValues(new Uint8Array(size)))
  }

  static encode = C.strToBytes
  static decode = C.bytesToStr

  static normalize(
    data  : Bytes,
    size? : number
  ) : Uint8Array {
    if (data instanceof Uint8Array)  return data
    if (typeof data === 'string') return Buff.hex(data, size).toBytes()
    if (typeof data === 'number') return Buff.num(data, size).toBytes()
    if (typeof data === 'bigint') return Buff.big(data, size).toBytes() 
    throw TypeError(`Unrecognized format: ${typeof data}`)
  }

  static serialize(data : Data) : Uint8Array {
    if (typeof data === 'string') {
      return Buff.str(data).toBytes()
    }
    if (typeof data === 'object') {
      if (data instanceof Uint8Array) {
        return data
      }
      try { 
        return Buff.json(data).toBytes() 
      }
      catch { throw TypeError(`Object is not serializable.`) }
    }
    throw TypeError(`Unrecognized format: ${typeof data}`)
  }

  static revitalize(data : Data) : Json {
    if (data instanceof Uint8Array) {
      data = C.bytesToStr(data)
    }
    if (typeof data === 'string') {
      try { return JSON.parse(data) }
      catch { return data }
    }
    return data
  }
}
