import { Buff } from '../../dist/module.mjs'

const test_hash = Buff.str('testing').digest.hex
const rand_hash = Buff.random(32).hex

console.log('test hash:', test_hash)
console.log('rand hash:', rand_hash)
