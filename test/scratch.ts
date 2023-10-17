import { Buff } from '../src/index.js'

const key_1 = '91b64d5324723a985170e4dc5a0f84c041804f2cd12660fa5dec09fc21783605'
const key_2 = new Buff('91b64d5324723a985170e4dc5a0f84c041804f2cd12660fa5dec09fc21783605')
const key_3 = new Buff('91b64d5324723a985170e4dc5a0f84c041804f2cd12660fa5dec09fc21783605').big
const key_4 = Buff.random(32)

console.log('should be equal:', Buff.is_equal(key_1, key_2))
console.log('should be equal:', key_2.equals(key_3))
console.log('should be unequal:', Buff.is_equal(key_1, key_4))