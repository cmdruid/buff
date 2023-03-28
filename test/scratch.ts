import { Buff }  from '../src/buff.js'
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

// const num = 60001
// const bin = C.num2Bin(num)
// console.log(bin)