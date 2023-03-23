import * as C        from './convert.js'
import { Bech32 }    from './bech32.js'
import { BaseX  }    from './basex.js'
import { ripemd160 } from './ripemd.js'
import { Base64, B64URL }           from './base64.js'
import { hmac256, sha256 }          from './sha2.js'
import { Bytes, Data, Json }        from './types.js'
import { addChecksum, checkTheSum } from './utils.js'

type BufferLike = Buff | ArrayBuffer | ArrayBufferLike | Uint8Array | string | number | bigint | boolean
type HashTypes  = 'sha256' | 'hash256' | 'ripe160' | 'hash160'
type Endian     = 'le' | 'be'

const crypto = globalThis.crypto

export class Buff extends Uint8Array {
  static num = (
    number : number,
    size  ?: number,
    endian : Endian = 'le'
  ) : Buff => {
    const b = new Buff(C.numToBytes(number), size)
    return (endian === 'le') ? b.reverse() : b
  }

  static big = (
    number : bigint,
    size  ?: number,
    endian : Endian = 'le'
  ) : Buff => {
    const b = new Buff(C.bigToBytes(number), size)
    return (endian === 'le') ? b.reverse() : b
  }

  static b58check (data : string) : Buff {
    const decoded = BaseX.decode(data, 'base58')
    return new Buff(checkTheSum(decoded))
  }

  static any     = (data : any, size ?: number) : Buff => new Buff(C.buffer(data, false), size)
  static raw     = (data : ArrayBufferLike, size ?: number) : Buff => new Buff(data, size)
  static str     = (data : string, size ?: number) : Buff => new Buff(C.strToBytes(data), size)
  static hex     = (data : string, size ?: number) : Buff => new Buff(C.hexToBytes(data), size)
  static bin     = (data : number[], size ?: number) : Buff => new Buff(C.binaryToBytes(data), size)
  static json    = (data : Json)   : Buff => new Buff(C.strToBytes(JSON.stringify(data)))
  static bytes   = (data : Bytes, size ?: number) : Buff => new Buff(C.buffer(data, true), size)
  static base64  = (data : string) : Buff => new Buff(Base64.decode(data))
  static b64url  = (data : string) : Buff => new Buff(B64URL.decode(data))
  static bech32  = (data : string, ver = 0) : Buff => new Buff(Bech32.decode(data, ver))
  static bech32m = (data : string) : Buff => new Buff(Bech32.decode(data, 1))

  constructor (
    data   : BufferLike,
    size  ?: number
  ) {
    data = C.buffer(data, false)
    if (typeof size === 'number') {
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

  get bin () : number[] {
    return this.toBin()
  }

  get base64 () : string {
    return this.toBase64()
  }

  get b64url () : string {
    return this.toB64url()
  }

  get digest () : Buff {
    return this.toHash()
  }

  get id () : string {
    return this.toHash().hex
  }

  get stream () : Stream {
    return new Stream(this)
  }

  toNum (endian : Endian = 'le') : number {
    return (endian === 'le')
      ? C.bytesToNum(this.reverse())
      : C.bytesToNum(this)
  }

  toBig (endian : Endian = 'le') : bigint {
    return (endian === 'le')
      ? C.bytesToBig(this.reverse())
      : C.bytesToBig(this)
  }

  toHash (type : HashTypes = 'sha256') : Buff {
    switch (type) {
      case 'sha256':
        return new Buff(sha256(this))
      case 'hash256':
        return new Buff(sha256(sha256(this)))
      case 'ripe160':
        return new Buff(ripemd160(this))
      case 'hash160':
        return new Buff(ripemd160(sha256(this)))
      default:
        throw new Error('Unrecognized format:' + String(type))
    }
  }

  toHmac (key : string | Uint8Array) : Buff {
    if (typeof key === 'string') {
      key = C.strToBytes(key)
    }
    return new Buff(hmac256(key, this))
  }

  tob58check () : string {
    return BaseX.encode(addChecksum(this), 'base58')
  }

  toArr ()    : number[] { return Array.from(this) }
  toStr ()    : string { return C.bytesToStr(this) }
  toHex ()    : string { return C.bytesToHex(this) }
  toJson ()   : Json   { return JSON.parse(C.bytesToStr(this)) }
  toBytes ()  : Uint8Array { return new Uint8Array(this) }
  toBin    () : number[] { return C.bytesToBinary(this) }
  toB64url () : string { return B64URL.encode(this) }
  toBase64 () : string { return Base64.encode(this) }
  toBech32 (hrp : string, ver = 0) : string { return Bech32.encode(this, hrp, ver) }
  toBech32m (hrp : string) : string { return Bech32.encode(this, hrp, 1) }

  prepend (data : Uint8Array) : Buff {
    return Buff.of(...data, ...this)
  }

  append (data : Uint8Array) : Buff {
    return Buff.of(...this, ...data)
  }

  slice (start ?: number, end ?: number) : Buff {
    return new Buff(new Uint8Array(this).slice(start, end))
  }

  reverse () : Buff {
    return new Buff(new Uint8Array(this).reverse())
  }

  write (bytes : Uint8Array, offset ?: number) : void {
    this.set(bytes, offset)
  }

  prefixSize (endian ?: Endian) : Buff {
    return Buff.of(...Buff.readSize(this.length, endian), ...this)
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

  static readSize (num : number, endian ?: Endian) : Buff {
    if (num < 0xFD) {
      return Buff.num(num, 1)
    } else if (num < 0x10000) {
      return Buff.of(0xFD, ...Buff.num(num, 2, endian))
    } else if (num < 0x100000000) {
      return Buff.of(0xFE, ...Buff.num(num, 4, endian))
    } else if (num < 0x10000000000000000) {
      return Buff.of(0xFF, ...Buff.num(num, 8, endian))
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
      return Buff.str(data).raw
    }
    if (typeof data === 'object') {
      if (data instanceof Uint8Array) {
        return data
      }
      try {
        return Buff.json(data).raw
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

export class Stream {
  public size : number
  public data : Uint8Array

  constructor (data : ArrayBufferLike) {
    this.data = new Uint8Array(data)
    this.size = this.data.length
  }

  peek (size : number) : Buff {
    if (size > this.size) {
      throw new Error(`Size greater than stream: ${size} > ${this.size}`)
    }
    return new Buff(this.data.slice(0, size).buffer)
  }

  read (size : number) : Buff {
    size = size ?? this.readSize()
    const chunk = this.peek(size)
    this.data = this.data.slice(size)
    this.size = this.data.length
    return chunk
  }

  readSize () : number {
    const num = this.read(1).toNum()
    switch (true) {
      case (num >= 0 && num < 0xFD):
        return num
      case (num === 0xFD):
        return this.read(2).toNum()
      case (num === 0xFE):
        return this.read(4).toNum()
      case (num === 0xFF):
        return this.read(8).toNum()
      default:
        throw new Error(`Varint is out of range: ${num}`)
    }
  }
}

export const Hex = {
  encode    : (x : Uint8Array) => Buff.raw(x).hex,
  decode    : (x : string)     => Buff.hex(x).raw,
  normalize : (x : Bytes)      => Buff.normalize(x),
  serialize : (x : Bytes)      => Buff.bytes(x).hex
}

export const Txt = {
  encode     : (x : Uint8Array) => Buff.raw(x).toStr(),
  decode     : (x : string)     => Buff.str(x).toBytes(),
  serialzie  : (x : Data)       => Buff.serialize(x),
  revitalize : (x : Data)       => Buff.revitalize(x)
}
