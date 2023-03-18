import { hash256 } from './sha2.js'

export function addChecksum (
  data : Uint8Array
) : Uint8Array {
  const sum = hash256(data)
  return Uint8Array.of(...data, ...sum.slice(0, 4))
}

export function checkTheSum (
  data : Uint8Array
) : Uint8Array {
  const ret = data.slice(0, -4)
  const chk = data.slice(-4)
  const sum = hash256(ret).slice(0, 4)
  if (sum.toString() !== chk.toString()) {
    throw new Error('Invalid checksum!')
  }
  return ret
}
