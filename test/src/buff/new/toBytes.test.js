const ec = new TextEncoder()

export default function (t, f) {
  const source = 'hello world'
  const target = ec.encode(source)
  const tested = f.str(source).toBytes()
  t.plan(1)
  t.deepEqual(target, tested)
}