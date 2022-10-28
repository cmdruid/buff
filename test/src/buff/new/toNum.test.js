export default function (t, f) {
  const source = Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1F)
  const target = Number.MAX_SAFE_INTEGER
  const tested = new f(source).toNum()
  t.plan(1)
  t.equal(target, tested)
}