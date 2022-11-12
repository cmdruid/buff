export default function (t, f) {
  const source = BigInt('0xFF0000000000000000000000')
  const targetLE = new Uint8Array(12).fill(0xFF, 0, 1)
  const targetBE = new Uint8Array(12).fill(0xFF, 11)
  const testedLE = Uint8Array.from(f(source))
  const testedBE = Uint8Array.from(f(source, null, 'be'))
  t.plan(2)
  t.deepEqual(testedLE, targetLE, 'should be little endian')
  t.deepEqual(testedBE, targetBE, 'should be big endian')
}
