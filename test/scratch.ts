import { Buff, Encoder } from '../src/index.js'

const { encode, decode, to_bytes, to_words } = Encoder.bech32m

const address = 'bcrt1pjxmy65eywgafs5tsunw95ruycpqcqnev6ynxp7jaasylcgtcxczsqzdc9v'
const pubkey  = '91b64d5324723a985170e4dc5a0f84c041804f2cd12660fa5dec09fc21783605'

const ret = decode(address)

const [ version, ...rest ] = ret.words
const key = to_bytes(rest)
const hex = Buff.raw(key).hex

const words = to_words(Buff.hex(pubkey))

const addr = encode('bcrt', [ 1, ...words ])

console.log(version)
console.log(hex)
console.log(key.length)

console.log('ref addr:', address)
console.log('our addr:', addr)