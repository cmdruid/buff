export default function (t, f) {
  const source = new ArrayBuffer(16)
  const target = new Uint8Array(source)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}