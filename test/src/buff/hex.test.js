function hexToBytes(str) {
  const bytes = []; let i, idx = 0
  if (str.length % 2) {
    throw new Error(`Invalid hex string length: ${str.length}`)
  }
  for (i = 0; i < str.length; i += 2) {
    bytes[idx] = parseInt(str.slice(i, i + 2), 16)
    idx += 1
  }
  return Uint8Array.from(bytes)
}

export default function (t, f) {
  const source = '0102030405060708090a0b0c0d0e0f'
  const target = hexToBytes(source)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}