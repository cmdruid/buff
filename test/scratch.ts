import { Buff }  from '../src/buff.js'
import { Check } from '../src/check.js'
import * as C from '../src/convert.js'

// const random = Buff.random()

// const binary = random.bin

// const bytes  = Buff.bin(binary)

// console.log('random:', random.hex)
// console.log('binary:', binary)
// console.log('bytes:', bytes.hex)

const num = Uint8Array.of(255, 255, 0)
const bin = C.bytesToBinary(num)
const rev = C.binaryToBytes(bin)

console.log(num, bin, rev)

console.log(C.numToBytes(65534))

function test3(value ?: string) {
  if (Check.notType(value, new Object())) {
    console.log(value)
  }
}

const test  = 'bread'
const test2 = undefined

if (Check.notUndefined(test)) {

}

const res1 = Check.isUndefined(test)
const res2 = Check.notUndefined(test)
const res3 = Check.isUndefined(test2)
const res4 = Check.notUndefined(test2)
console.log(res1, res2, res3, res4)

// const num = 60001
// const bin = C.num2Bin(num)
// console.log(bin)