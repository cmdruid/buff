import { Buff } from '../src/index.js'

const u8 = new Uint8Array([ 1, 2 ,3 ,4 ]).buffer

console.log(u8)

console.log(Array.isArray(u8))

