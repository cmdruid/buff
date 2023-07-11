import { bigToBytes }    from './big.js'
import { numToBytes }    from './num.js'
import { hexToBytes }    from './str.js'
import { set_buffer }    from '../utils.js'
import { Bytes, Endian } from '../types.js'

export function buffer (
  data    : Bytes | ArrayBuffer,
  size   ?: number,
  endian ?: Endian
) : Uint8Array {
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data)
  }
  if (data instanceof Uint8Array) {
    return set_buffer(data, size, endian)
  }
  if (typeof data === 'string') {
    return hexToBytes(data, size, endian)
  }
  if (typeof data === 'bigint') {
      return bigToBytes(data, size, endian)
  }
  if (typeof data === 'number') {
    return numToBytes(data, size, endian)
  }
  if (typeof data === 'boolean') {
    return Uint8Array.of(data ? 1 : 0)
  }
  throw TypeError('Unsupported format:' + String(typeof data))
}
