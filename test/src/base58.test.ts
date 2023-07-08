import { Test }  from 'tape'
import { Hex }   from '../../src/index.js'
import * as util from '../../src/utils.js'

import { Base58, Base58C } from '../../src/index.js'

import test_vectors from './vectors/basex.json' assert { type: 'json' }

export default function base58Test(t : Test) {
  t.test('Base58 test vectors', t => {
    const vectors = test_vectors.base58
    t.plan(vectors.length * 2)
    for (const [ dec, enc ] of vectors) {
      try {
        const encoded = Base58.encode(Hex.decode(dec))
        t.equal(encoded, enc, 'Encodings should match.')
      } catch(err) {
        t.fail(err.message)
      }
      try {
        const decoded = Hex.encode(Base58.decode(enc))
        t.equal(decoded, dec, 'Decodings should match.')
      } catch(err) {
        t.fail(err.message)
      }
    }
  })

  t.test('Base58 stress test', t => {
    const rounds  = 1000
    const results : string[][] = []

    t.plan(1)

    for (let i = 0; i < rounds; i++) {
      const random  = util.random(32)
      const encoded = Base58C.encode(random)
      const decoded = Base58C.decode(encoded)
      results.push([ Hex.encode(decoded), Hex.encode(random) ])
    }

    const failures = results.filter(([ t, e ]) => t !== e)
    t.equal(failures.length, 0, 'Failure count should be zero.')
  })
}
