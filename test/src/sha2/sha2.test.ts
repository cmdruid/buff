import { Buff }    from '../../../src/index.js'
import { sha256 }  from '../../../src/index.js'
import { Test }    from 'tape'

const { crypto } = globalThis

export default async function sha2Test(t : Test) : Promise<void> {

  t.test('SHA-256 integrity stress test.', async t => {

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