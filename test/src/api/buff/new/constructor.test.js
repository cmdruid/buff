export default function (t, f) {
  const source = new Uint8Array(5).fill(0xFF).buffer
  const tested = new f(source, 10)
  t.plan(1)
  t.equal(10, tested.length, 'Buff should have a length of 10')
}