import { bech32 } from '@scure/base'

const test_enc  = 'lnbc1u1pjvy84epp5zrapr3w7tqelvjzwm0rwsac2ga79m982uruducydr2u6zwlhpasqhp5fe47lwjexge0lff7ru2g6757g35qajscy39hsz4dvqe97gnt3d3scqzzsxqyz5vqsp5ptv9dz544r5pxd3gkulqelakrtmx4nf47xw4mmm8a0u8j2up7mqs9qyyssqumxjespzkuwzdppw3hzkawgdedjyu2e0wnsk3t3y8g7mkpz49nn9rlrzsj07tz3hjnld80j749069puz9uanhr55p9ngw46cy2w295qpktsz9y'
const { bytes } = bech32.decodeToBytes(test_enc)
const decoded   = new TextDecoder().decode(bytes)

console.log('decoded:', decoded)
