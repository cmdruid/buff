export default function (t, f) {
  const source = 65408
  const targetLE = Uint8Array.of(0x00, 0x00, 0xff, 0x80)
  const targetBE = Uint8Array.from(targetLE).reverse()
  const testedLE = Uint8Array.from(f(source, 4))
  const testedBE = Uint8Array.from(f(source, 4, 'be'))
  t.plan(2)
  t.deepEqual(testedLE, targetLE, 'should be little endian')
  t.deepEqual(testedBE, targetBE, 'should be big endian')
}

