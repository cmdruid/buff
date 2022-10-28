export default function (t, f) {
  const source = Number.MAX_SAFE_INTEGER
  const target = Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1F)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}