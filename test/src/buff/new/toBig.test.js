export default function (t, f) {
  const source = new Uint8Array(32).fill(0xFF)
  const target = 115792089237316195423570985008687907853269984665640564039457584007913129639935n
  const tested = new f(source).toBig()
  t.plan(1)
  t.equal(target, tested)
}