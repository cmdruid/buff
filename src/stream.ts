import { Buff } from './buff.js'

export class Stream {

  public size : number
  public data : Uint8Array

  constructor(data : ArrayBufferLike) {
    this.data = new Uint8Array(data)
    this.size = this.data.length
  }

  peek(size : number) : Buff {
    if (size > this.size) {
      throw new Error(`Size greater than stream: ${size} > ${this.size}`)
    }
    return new Buff(this.data.slice(0, size).buffer)
  }

  read(size : number) : Buff {
    size = size ?? this.readVarint()
    const chunk = this.peek(size)
    this.data = this.data.slice(size)
    this.size = this.data.length
    return chunk
  }

  readVarint() : number {
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
