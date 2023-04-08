import { joinArray }  from '../utils.js'
import { sha256 }     from '../sha2.js'
import { numToBytes, bytesToBig, bigToBytes } from '../convert.js'

export class PRNG {
  private x : bigint
  private y : bigint
  private z : bigint
  private w : bigint
  private c : bigint

  static seed (size = 32) : Uint8Array {
    const date = numToBytes(Date.now())
    const seed = new Uint8Array(size * 4).fill(0)
    seed.map(() => Math.floor(Math.random() * 0xFFFF % 0xFF))
    return sha256(joinArray([ seed, date ]))
  }

  static getRandomValues <T extends ArrayBufferView | null> (
    array : T
  ) : T {
    if (array !== null) {
      const view = new Uint8Array(array.buffer)
      const size = view.length
      const rand = PRNG.generate(size)
      for (let i = 0; i < size; i++) {
        view[i] = rand[i]
      }
      return array
    }
    throw new Error('ArrayBufferView is null!')
  }

  static generate (size = 32) : Uint8Array {
    let seed = PRNG.seed()
    const rnds = Math.ceil((size + 32) / 32)
    const pool : Uint8Array[] = []
    for (let i = 0; i < rnds; i++) {
      const prng = new PRNG(seed)
      const hash = prng.generate()
      seed = hash
      pool.push(hash)
    }
    return joinArray(pool.reverse()).slice(0, size)
  }

  constructor (seed = PRNG.seed()) {
    this.x = bytesToBig(seed)
    this.y = BigInt(362436069)
    this.z = BigInt(521288629)
    this.w = BigInt(88675123)
    this.c = BigInt(0) // Initialize c to 0
  }

  public generate () : Uint8Array {
    const next = this.next()
    if (next < (2n ** 512n)) {
      return this.generate()
    }
    return sha256(bigToBytes(next))
  }

  public next () : bigint {
    this.x = BigInt(6906969069) * this.x + this.c
    this.y ^= this.y << BigInt(13)
    this.y ^= this.y >> BigInt(17)
    this.y ^= this.y << BigInt(43)
    const t = this.z + this.w + this.c
    this.z = this.w
    this.c = t >> BigInt(63)
    this.w = t & BigInt('0x7fffffffffffffff')
    return this.x + this.y + this.w
  }
}
