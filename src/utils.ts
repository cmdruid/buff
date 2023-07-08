const { getRandomValues } = crypto ?? globalThis.crypto ?? window.crypto

export function random (size = 32) : Uint8Array {
  if (typeof getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint8Array(size))
  }
  throw new Error('Crypto module missing getRandomValues!')
}

export function pad_array (
  data : Uint8Array,
  size : number
) : Uint8Array {
  if (data.length > size) {
    throw new TypeError(`Data is larger than array size: ${data.length} > ${size}`)
  }
  const padding = new Uint8Array(size).fill(0)
  const offset  = size - data.length
  padding.set(data, offset)
  return padding
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
