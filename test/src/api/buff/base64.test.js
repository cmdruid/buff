const ec = new TextEncoder()

export default function (t, f) {
  const source = 'TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu'
  const target = ec.encode('Many hands make light work.')
  const tested = f(source).toBytes()

  t.plan(1)
  t.deepEqual(target, tested)
}