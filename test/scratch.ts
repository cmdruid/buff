import { Buff } from '../src/index.js'

const test_str = 'https://walletofsatoshi.com/.well-known/lnurlp/jeeringmarch53'

const encoded = Buff.str(test_str).toBech32('lnurl')

console.log(encoded)

