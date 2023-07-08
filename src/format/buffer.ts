import { bigToBytes } from './big.js'
import { numToBytes } from './num.js'
import { hexToBytes } from './str.js'

export function buffer (value : any) : Uint8Array {
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value)
  }
  if (value instanceof Uint8Array) {
    return new Uint8Array(value)
  }
  if (typeof value === 'string') {
    return hexToBytes(value)
  }
  if (typeof value === 'bigint') {
      return bigToBytes(value).reverse()
  }
  if (typeof value === 'number') {
    return numToBytes(value).reverse()
  }
  if (typeof value === 'boolean') {
    return Uint8Array.of(value ? 1 : 0)
  }
  throw TypeError('Unsupported format:' + String(typeof value))
}
