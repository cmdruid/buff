import { Buff }  from '../src/buff.js'

const random = Buff.random()

const binary = random.toBinary()

const bytes  = Buff.binary(binary)

console.log('random:', random.hex)
console.log('binary:', binary)
console.log('bytes:', bytes.hex)