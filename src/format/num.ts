import { Endian }      from '../types.js'
import { is_safe_num } from '../assert.js'

export function numToBytes (
  num    : number,
  size   : number = 4,
  endian : Endian = 'be'
) : Uint8Array {
  const use_le   = (endian === 'le')
  const buffer   = new ArrayBuffer(size)
  const dataView = new DataView(buffer)
    let offset   = (use_le) ? 0 : size - 1
  while (num > 0) {
    const byte = num & 255
    if (use_le) {
      dataView.setUint8(offset++, num)
    } else {
      dataView.setUint8(offset--, num)
    }
    num = (num - byte) / 256
  }
  return new Uint8Array(buffer)
}

export function bytesToNum (bytes : Uint8Array) : number {
  let num = 0
  for (let i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256) + bytes[i]
    is_safe_num(num)
  }
  return num
}
