const ec = new TextEncoder()

export default function (t, f) {
  const target = { err: null, data: 'testing!' }
  const source = ec.encode(JSON.stringify(target))
  const tested = new f(source).toJson()
  t.plan(1)
  t.deepEqual(target, tested)
}