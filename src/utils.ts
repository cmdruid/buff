export function joinArray (arr : Array<Uint8Array | number[]>) : Uint8Array {
  let i, idx = 0
  const size = arr.reduce((prev, curr) => prev + curr.length, 0)
  const buff = new Uint8Array(size)
  for (const bytes of arr) {
    for (i = 0; i < bytes.length; idx++, i++) {
      buff[idx] = bytes[i]
    }
  }
  return buff
}
