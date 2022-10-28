export default function (t, f) {
  const source = 115792089237316195423570985008687907853269984665640564039457584007913129639935n
  const target = new Uint8Array(32).fill(0xFF)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}