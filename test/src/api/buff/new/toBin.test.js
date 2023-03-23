export default function (t, f) {
  const source = f.random()
  const target = source
  const binary = f.raw(source).bin
  const tested = f.bin(binary)

  t.plan(1)
  t.deepEqual(target, tested)
}

