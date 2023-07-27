import { Buff } from '../src/index.js'

const test_str = `https://some_domain/.well-known/lnurlp/user`

const encoded = Buff.str(test_str).toBech32('lnurl')

console.log(encoded)

