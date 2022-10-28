import Buff from './buff.js'

export default class Bytes extends Buff {

  public size : number

  constructor(data : ArrayBufferLike, size? : number) {
    super(data, size)
    this.size = this.length
  }

  prepend(data : Uint8Array) {
    return Bytes.of(...data, ...this)
  }

  append(data : Uint8Array) {
    return Bytes.of(...this, ...data)
  }

  slice(start? : number, end? : number) : Bytes {
    const tmp = new Uint8Array(this.buffer).slice(start, end)
    return new Bytes(tmp.buffer)
  }

  varint(num : number) {
    return Bytes.of(...this, ...Bytes.varint(num))
  }

  static from(data : Uint8Array) {
    return new Bytes(Uint8Array.from(data).buffer)
  }

  static of(...args : number[]) {
    return new Bytes(Uint8Array.of(...args).buffer)
  }

  static join(arr : Uint8Array[]) {
    let i, idx = 0
    const totalSize = arr.reduce((prev, curr) => prev + curr.length, 0)
    const totalBytes = new Uint8Array(totalSize)
    for (const bytes of arr) {
      for (i = 0; i < bytes.length; idx++, i++) {
        totalBytes[idx] = bytes[i]
      }
    }
    return new Bytes(totalBytes, totalSize)
  }

  static varint(num : number) {
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
