import { Buff } from '../../src/index.js'

function getRandom(size = 0x80FFFFFF) {
  return Math.floor(Math.random() * size)
}

export default function integrityTest(t) {

  const tnum = getRandom(),
        tbig = BigInt(tnum),
        thex = tnum.toString(16)

  const num2num = Buff.num(tnum).toNum()
  const num2big = Buff.num(tnum).toBig()
  const big2big = Buff.big(tbig).toBig()
  const big2num = Buff.big(tbig).toNum()
  const hex2hex = Buff.hex(thex).toHex()
  const hex2num = Buff.hex(thex).toNum()
  const hex2big = Buff.hex(thex).toBig()
  const num2hex = Buff.num(tnum).toHex()
  const big2hex = Buff.big(tbig).toHex()

  t.plan(9)
  t.equal(num2num, tnum, 'num => num')
  t.equal(num2big, tbig, 'num => big')
  t.equal(num2hex, thex, 'num => hex')
  t.equal(big2big, tbig, 'big => big')
  t.equal(big2num, tnum, 'big => num')
  t.equal(big2hex, thex, 'big => hex')
  t.equal(hex2hex, thex, 'hex => hex')
  t.equal(hex2num, tnum, 'hex => num')
  t.equal(hex2big, tbig, 'hex => big')
}
