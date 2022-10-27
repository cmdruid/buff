export function varintToBytes(num) {
  const bytes = Convert.number(num).toBytes
  if (num < 0xfd) {
    return bytes
  } else if (num < 0x10000) {
    return new Uint8Array(3).set([254, ...bytes])
  } else if (num < 0x100000000) {
    return new Uint8Array(5).set([254, ...bytes])
  } else if (num < 0x10000000000000000) {
    return new Uint8Array(9).set([254, ...bytes])
  } else {
    throw new Error('Int value is too large:', num)
  }
}
