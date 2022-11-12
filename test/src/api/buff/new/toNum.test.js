export default function (t, f) {
  const source = Uint8Array.of(0x00, 0x00, 0xff, 0x80)
  const targetLE = 65408
  const targetBE = 2164195328
  const testedLE = new f(source).toNum()
  const testedBE = new f(source).toNum('be')
  t.plan(2)
  t.equal(testedLE, targetLE, 'should be equal using LE')
  t.equal(testedBE, targetBE, 'should be equal using BE')
}
