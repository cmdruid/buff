import { Endian } from '../types.js'

const _0n   = BigInt(0)
const _255n = BigInt(255)
const _256n = BigInt(256)

export function bigToBytes (
  big    : bigint,
  size   : number = 4,
  endian : Endian = 'be'
) : Uint8Array {
  const use_le   = (endian === 'le')
  const buffer   = new ArrayBuffer(size)
  const dataView = new DataView(buffer)
    let offset   = (use_le) ? 0 : size - 1
  while (big > _0n) {
    const byte = big & _255n
    const num  = Number(byte)
    if (use_le) {
      dataView.setUint8(offset++, num)
    } else {
      dataView.setUint8(offset--, num)
    }
    big = (big - byte) / _256n
  }
  return new Uint8Array(buffer)
}

export function bytesToBig (bytes : Uint8Array) : bigint {
  let num = BigInt(0)
  for (let i = bytes.length - 1; i >= 0; i--) {
    num = (num * _256n) + BigInt(bytes[i])
  }
  return BigInt(num)
}
