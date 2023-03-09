const ec = new TextEncoder()

export default async function (t, f) {
  const source = ec.encode('73696d706c792061206c6f6e6720737472696e67')
  const target = '2cFupjhnEsSn59qHXstmK2ffpLv2'
  const tested = await f.raw(source).toBase58()
  t.plan(1)
  t.equal(target, tested)
}