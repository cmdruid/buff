import { Test } from 'tape'
import { Buff } from '../../src/index.js'

const DEBUG = false

function getRandom(size = 0x80FFFFFF) {
  return Math.floor(Math.random() * size)
}

export default function integrityTest(t : Test) {

  t.test('Conversion integrity test', t => {
    const tnum = getRandom(),
          tbig = BigInt(tnum),
          thex = tnum.toString(16).padStart(8, '0'),
          tbin = tnum.toString(2).padStart(32, '0').split('').map(e => parseInt(e)).join('')

    const num2num = Buff.num(tnum).num
    const num2big = Buff.num(tnum).big
    const num2hex = Buff.num(tnum).hex
    const num2bin = Buff.num(tnum).bin

    const big2big = Buff.big(tbig).big
    const big2num = Buff.big(tbig).num
    const big2hex = Buff.big(tbig).hex
    const big2bin = Buff.big(tbig).bin

    const hex2hex = Buff.hex(thex).hex
    const hex2num = Buff.hex(thex).num
    const hex2big = Buff.hex(thex).big
    const hex2bin = Buff.hex(thex).bin

    const bin2num = Buff.bin(tbin).num
    const bin2big = Buff.bin(tbin).big
    const bin2hex = Buff.bin(tbin).hex
    const bin2bin = Buff.bin(tbin).bin

    if (DEBUG) {
      console.log(num2num, tnum, 'num => num')
      console.log(num2big, tbig, 'num => big')
      console.log(num2hex, thex, 'num => hex')
      console.log(num2bin, tbin, 'num => bin')

      console.log(hex2hex, thex, 'hex => hex')
      console.log(hex2num, tnum, 'hex => num')
      console.log(hex2big, tbig, 'hex => big')
      console.log(hex2bin, tbin, 'hex => bin')

      console.log(big2big, tbig, 'big => big')
      console.log(big2num, tnum, 'big => num')
      console.log(big2hex, thex, 'big => hex')
      console.log(big2bin, tbin, 'big => bin')
      
      console.log(bin2bin, tbin, 'bin => bin')
      console.log(bin2big, tbig, 'bin => big')
      console.log(bin2num, tnum, 'bin => num')
      console.log(bin2hex, thex, 'bin => hex')
    }

    t.plan(16)

    t.equal(num2num, tnum, 'num => num')
    t.equal(num2big, tbig, 'num => big')
    t.equal(num2hex, thex, 'num => hex')
    t.equal(num2bin, tbin, 'num => bin')

    t.equal(hex2hex, thex, 'hex => hex')
    t.equal(hex2num, tnum, 'hex => num')
    t.equal(hex2big, tbig, 'hex => big')
    t.equal(hex2bin, tbin, 'hex => bin')

    t.equal(big2big, tbig, 'big => big')
    t.equal(big2num, tnum, 'big => num')
    t.equal(big2hex, thex, 'big => hex')
    t.equal(big2bin, tbin, 'big => bin')
    
    t.equal(bin2bin, tbin, 'bin => bin')
    t.equal(bin2big, tbig, 'bin => big')
    t.equal(bin2num, tnum, 'bin => num')
    t.equal(bin2hex, thex, 'bin => hex')
  })
}
