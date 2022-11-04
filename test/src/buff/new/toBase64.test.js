const ec = new TextEncoder()

export default function (t, f) {
  const source = ec.encode('Many hands make light work.')
  const target = 'TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu'
  const tested = f.buff(source).toBase64()
  t.plan(1)
  t.equal(target, tested)
}