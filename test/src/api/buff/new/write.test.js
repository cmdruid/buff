export default function (t, f) {
  const source = Uint8Array.of(0x02, 0xFF)
  const target = Uint8Array.of(0x00, 0x00, ...source)
  const tested = f.raw(new ArrayBuffer(4))
  tested.write(source, 2)
  t.plan(1)
  t.deepEqual(target, tested.raw)
}