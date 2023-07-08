import { within_size } from './assert.js'
import { Endian }      from './types.js'

const { getRandomValues } = crypto ?? globalThis.crypto ?? window.crypto

export function random (size = 32) : Uint8Array {
  if (typeof getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint8Array(size))
  }
  throw new Error('Crypto module missing getRandomValues!')
}

export function set_buffer (
  data   : number[] | Uint8Array,
  size  ?: number,
  endian : Endian = 'be'
) : Uint8Array {
  if (size === undefined) size = data.length
  within_size(data, size)
  const buffer = new Uint8Array(size).fill(0)
  const offset = (endian === 'be') ? 0 : size - data.length
  buffer.set(data, offset)
  return buffer
}

export function join_array (
  arr : Array<Uint8Array | number[]>
) : Uint8Array {
  let i, offset = 0
  const size = arr.reduce((len, arr) => len + arr.length, 0)
  const buff = new Uint8Array(size)
  for (i = 0; i < arr.length; i++) {
    const a = arr[i]
    buff.set(a, offset)
    offset += a.length
  }
  return buff
}
