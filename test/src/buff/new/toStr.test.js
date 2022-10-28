const ec = new TextEncoder()
const dc = new TextDecoder()

export default function (t, f) {
  const source = ec.encode('hello world')
  const target = dc.decode(source)
  const tested = new f(source).toStr()
  t.plan(1)
  t.equal(target, tested)
}
