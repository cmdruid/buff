const ec = new TextEncoder()

export default function (t, f) {
  const source = { err: null, data: 'testing!' }
  const target = new Uint8Array(ec.encode(JSON.stringify(source)))
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}