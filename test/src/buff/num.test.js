export default function (t, f) {
  const source = 2164260863
  const targetLE = Uint8Array.of(0x80, 0xff, 0xff, 0xff)
  const targetBE = Uint8Array.from(targetLE).reverse()
  const testedLE = Uint8Array.from(f(source, 4))
  const testedBE = Uint8Array.from(f(source, 4, 'be'))
  t.plan(2)
  t.deepEqual(testedLE, targetLE, 'should be little endian')
  t.deepEqual(testedBE, targetBE, 'should be big endian')
}

