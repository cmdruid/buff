import { Test }   from 'tape'
import { Buff }   from '../../../src/index.js'
import { sha256 } from '../../../src/index.js'
import { webcrypto as crypto } from '../../../src/crypto/index.js'

export default async function sha2Test(t : Test) : Promise<void> {

  t.test('SHA-256 integrity stress test.', async t => {

    if (crypto.subtle === undefined) {
      t.skip('SubtleCrypto is not supported in this environment. Skipping test ...')
      return
    }

    const rounds  = 1000
    const results : string[][] = []

    for (let i = 0; i < rounds; i++) {
      const randomData = Buff.random().raw

      const target  = sha256(randomData)
      const example = await crypto.subtle.digest('SHA-256', randomData)

      results.push([ Buff.raw(target).hex, Buff.raw(example).hex ])
    }

    const failures = results.filter(([ t, e ]) => t !== e)

    t.plan(1)
    t.equal(failures.length, 0, 'Failure count should be zero.')
  })
}
