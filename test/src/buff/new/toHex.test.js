function bytesToHex(bytes) {
  const hex = []; let i
  for (i = 0; i < bytes.length; i++) {
    hex.push(bytes[i].toString(16).padStart(2, '0'))
  }
  return hex.join('')
}

export default function (t, f) {
  const source = new Uint8Array(16).fill(0x4F)
  const target = bytesToHex(source)
  const tested = new f(source).toHex()
  t.plan(1)
  t.equal(target, tested)
}