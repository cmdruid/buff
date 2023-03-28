import tape from 'tape'
import APICrawler    from './src/api.test.js'
import { baseTest }  from './src/base.test.js'
import integrityTest from './src/integrity.test.js'

tape('Buff-Utils Test Suite', async t => {
  await APICrawler(t)
  await integrityTest(t)
  await baseTest()
})
