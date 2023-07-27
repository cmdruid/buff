import { Test }  from 'tape'

import {
  Encoder,
  Hex
} from '../../src/index.js'

import * as util from '../../src/utils.js'

const { b58chk } = Encoder

export default function base58Test(t : Test) {
  t.test('Base58 Check stress test', t => {
    const rounds  = 1000
    const results : string[][] = []

    t.plan(1)

    for (let i = 0; i < rounds; i++) {
      const random  = util.random(32)
      const encoded = b58chk.encode(random)
      const decoded = b58chk.decode(encoded)
      results.push([ Hex.encode(decoded), Hex.encode(random) ])
    }

    const failures = results.filter(([ t, e ]) => t !== e)
    t.equal(failures.length, 0, 'Failure count should be zero.')
  })
}
