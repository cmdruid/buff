export default function (t, f) {
  const source = new Uint8Array(8).fill(0xFF, 4)
  const targetLE = 4294967295n
  const targetBE = 18446744069414584320n
  const testedLE = new f(source).toBig()
  const testedBE = new f(source).toBig('be')
  t.plan(2)
  t.equal(testedLE, targetLE, 'should be equal using LE')
  t.equal(testedBE, targetBE, 'should be equal using BE')
}
