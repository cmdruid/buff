import { is_safe_num } from '../assert.js'

export function numToBytes (num : number) : Uint8Array {
  if (num === 0) return Uint8Array.of(0x00)
  const bytes : number[] = []
  while (num > 0) {
    const byte = num & 0xff
    bytes.push(byte)
    num = (num - byte) / 256
  }
  return new Uint8Array(bytes)
}

export function bytesToNum (bytes : Uint8Array) : number {
  let num = 0
  for (let i = bytes.length - 1; i >= 0; i--) {
    num = (num * 256) + bytes[i]
    is_safe_num(num)
  }
  return num
}
