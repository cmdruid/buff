export default function (t, f) {
  const source = 65408
  const targetBE = Uint8Array.from([ 0x00, 0x00, 0x80, 0xff ])
  const targetLE = Uint8Array.from([ 0xff, 0x80, 0x00, 0x00 ])
  const testedBE = Uint8Array.from(f(source, 4, 'be'))
  const testedLE = Uint8Array.from(f(source, 4, 'le'))
  t.plan(2)
  t.deepEqual(testedBE, targetBE, 'should be big endian')
  t.deepEqual(testedLE, targetLE, 'should be little endian')
}
