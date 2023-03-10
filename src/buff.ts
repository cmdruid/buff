import * as C     from './convert.js'
import { Bech32 } from './bech32.js'
import { BaseX  } from './basex.js'

import { Bytes, Data, Json } from './types.js'
import { addChecksum, checkTheSum } from './utils.js'

type BufferLike = bigint | boolean | number | string | Uint8Array

const { crypto } = globalThis

export const Hex = {
  encode    : (x : Uint8Array) => Buff.raw(x).toHex(),
  decode    : (x : string)     => Buff.hex(x).toBytes(),
  normalize : (x : Bytes)      => Buff.normalize(x)
}

export const Txt = {
  encode     : (x : Uint8Array) => Buff.raw(x).toStr(),
  decode     : (x : string)     => Buff.str(x).toBytes(),
  serialzie  : (x : Data)       => Buff.serialize(x),
  revitalize : (x : Data)       => Buff.revitalize(x)
}

export const Base64 = {
  encode    : (x : Uint8Array)    => BaseX.encode(x, 'base64'),
  decode    : (x : string)        => BaseX.decode(x, 'base64'),
  encodeUrl : (x : Uint8Array)    => BaseX.encode(x, 'base64'),
  decodeUrl : (x : string)        => BaseX.decode(x, 'base64')
}

export class Buff extends Uint8Array {
  static num = (
    number : number,
    size  ?: number,
    endian : 'le' | 'be' = 'le'
  ) : Buff => {
    const b = C.numToBytes(number)
    return (endian === 'le')
      ? new Buff(b, size).reverse()
      : new Buff(b, size)
  }

  static big = (
    number : bigint,
    size  ?: number,
    endian : 'le' | 'be' = 'le'
  ) : Buff => {
    const b = C.bigToBytes(number)
    return (endian === 'le')
      ? new Buff(b, size).reverse()
      : new Buff(b, size)
  }

  static async b58check (data : string) : Promise<Buff> {
    const decoded = BaseX.decode(data, 'base58')
    return new Buff(await checkTheSum(decoded))
  }

  static any    = (data : BufferLike,      size ?: number) : Buff => new Buff(C.buffer(data), size)
  static raw    = (data : ArrayBufferLike, size ?: number) : Buff => new Buff(data, size)
  static str    = (data : string, size ?: number) : Buff => new Buff(C.strToBytes(data), size)
  static hex    = (data : string, size ?: number) : Buff => new Buff(C.hexToBytes(data), size)
  static json   = (data : Json)   : Buff => new Buff(C.strToBytes(JSON.stringify(data)))
  static base64 = (data : string) : Buff => new Buff(BaseX.decode(data, 'base64'))
  static b64url = (data : string) : Buff => new Buff(BaseX.decode(data, 'base64url'))
  static bech32 = (data : string, ver = 0) : Buff => new Buff(Bech32.decode(data, ver))

  constructor (
    data   : ArrayBufferLike,
    size  ?: number
  ) {
    if (size !== undefined) {
      const tmp = new Uint8Array(size).fill(0)
      tmp.set(new Uint8Array(data))
      data = tmp.buffer
    }
    super(data)
    return this
  }

  get num () : number {
    return this.toNum()
  }

  get big () : bigint {
    return this.toBig()
  }

  get arr () : number[] {
    return this.toArr()
  }

  get str () : string {
    return this.toStr()
  }

  get hex () : string {
    return this.toHex()
  }

  get raw () : Uint8Array {
    return new Uint8Array(this)
  }

  get base64 () : string {
    return this.toBase64()
  }

  get b64url () : string {
    return this.toB64url()
  }

  get digest () : Promise<Uint8Array> {
    return this.toDigest()
  }

  get id () : Promise<string> {
    return this.toDigest().then(raw => new Buff(raw).hex)
  }

  toNum (endian : 'le' | 'be' = 'le') : number {
    return (endian === 'le')
      ? C.bytesToNum(this.reverse())
      : C.bytesToNum(this)
  }

  toBig (endian : 'le' | 'be' = 'le') : bigint {
    return (endian === 'le')
      ? C.bytesToBig(this.reverse())
      : C.bytesToBig(this)
  }

  async toDigest (type : AlgorithmIdentifier = 'SHA-256') : Promise<Uint8Array> {
    return crypto.subtle.digest(type, this.raw)
      .then(buff => new Uint8Array(buff))
  }

  async tob58check () : Promise<string> {
    return BaseX.encode(await addChecksum(this), 'base58')
  }

  toArr ()    : number[] { return Array.from(this) }
  toStr ()    : string { return C.bytesToStr(this) }
  toHex ()    : string { return C.bytesToHex(this) }
  toJson ()   : Json   { return JSON.parse(C.bytesToStr(this)) }
  toBytes ()  : Uint8Array { return new Uint8Array(this) }
  toB64url () : string { return BaseX.encode(this, 'base64url') }
  toBase64 (padding ?: boolean) : string { return BaseX.encode(this, 'base64', padding) }
  toBech32 (hrp : string, ver = 0) : string { return Bech32.encode(this, hrp, ver) }

  prepend (data : Uint8Array) : Buff {
    return Buff.of(...data, ...this)
  }

  append (data : Uint8Array) : Buff {
    return Buff.of(...this, ...data)
  }

  slice (start ?: number, end ?: number) : Buff {
    return new Buff(new Uint8Array(this).slice(start, end))
  }

  rev = this.reverse

  reverse () : Buff {
    return new Buff(new Uint8Array(this).reverse())
  }

  write (bytes : Uint8Array, offset ?: number) : void {
    this.set(bytes, offset)
  }

  prefixSize (num = this.length) : Buff {
    return Buff.of(...Buff.readSize(num), ...this)
  }

  static from (data : Uint8Array | number[]) : Buff {
    return new Buff(Uint8Array.from(data))
  }

  static of (...args : number[]) : Buff {
    return new Buff(Uint8Array.of(...args))
  }

  static join (arr : Uint8Array[]) : Buff {
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

  static readSize (num : number) : Buff {
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

  static random (size : number = 32) : Buff {
    return new Buff(crypto.getRandomValues(new Uint8Array(size)))
  }

  static encode = C.strToBytes
  static decode = C.bytesToStr

  static normalize (
    data  : Bytes,
    size ?: number
  ) : Uint8Array {
    if (data instanceof Uint8Array)  return data
    if (typeof data === 'string') return Buff.hex(data, size).raw
    if (typeof data === 'number') return Buff.num(data, size).raw
    if (typeof data === 'bigint') return Buff.big(data, size).raw
    throw TypeError(`Unrecognized format: ${typeof data}`)
  }

  static serialize (data : Data) : Uint8Array {
    if (typeof data === 'string') {
      return Buff.str(data).toBytes()
    }
    if (typeof data === 'object') {
      if (data instanceof Uint8Array) {
        return data
      }
      try {
        return Buff.json(data).toBytes()
      } catch { throw TypeError('Object is not serializable.') }
    }
    throw TypeError(`Unrecognized format: ${typeof data}`)
  }

  static revitalize (data : Data) : Json {
    if (data instanceof Uint8Array) {
      data = C.bytesToStr(data)
    }
    if (typeof data === 'string') {
      try { return JSON.parse(data) } catch { return data }
    }
    return data
  }
}
