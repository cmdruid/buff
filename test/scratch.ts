import { Buff }  from '../src/buff.js'
import { BaseX } from '../src/basex.js'

const dc = new TextDecoder()

const enc2 = BaseX.encode(Buff.hex('00000000000000000000'), 'base58')

console.log(enc2)
console.log(BaseX.decode(enc2, 'base58'))

const msg = '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31'
const encoded = await Buff.hex(msg).tob58check()
const decoded = (await Buff.b58check(encoded)).hex

console.log(encoded, encoded === '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs')
console.log(decoded, msg === decoded)