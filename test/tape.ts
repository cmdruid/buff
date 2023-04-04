import tape from 'tape'
import APICrawler    from './src/api.test.js'
import integrityTest from './src/integrity.test.js'
import base58Test    from './src/base/base58.test.js'
import base64Test    from './src/base/base64.test.js'
import bech32Test    from './src/bech32/bech32.test.js'
import sha2Test      from './src/sha2/sha2.test.js'

tape('Buff-Utils Test Suite', async t => {
  await APICrawler(t)
  await integrityTest(t)
  await base58Test(t)
  await base64Test(t)
  await bech32Test(t)
  await sha2Test(t)
})
