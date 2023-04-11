import { Test }     from 'tape'
import { Hex, Txt } from '../../../src/convert.js'
import { Base64 }   from '../../../src/base64.js'
import test_vectors from './basex.vector.json' assert { type: 'json' }
import { randomBytes } from '@noble/hashes/utils'

export default function base64Test(t : Test) {
  t.test('Base64 test vectors', t => {
    const vectors = test_vectors.base64
    t.plan(vectors.length * 2)
    for (const [ dec, enc ] of vectors) {
      try {
        const encoded = Base64.encode(dec)
        t.equal(encoded, enc, 'Encodings should match.')
      } catch(err) {
        t.fail(err.message)
      }
      try {
        const decoded = Txt.encode(Base64.decode(enc))
        t.equal(decoded, dec, 'Decodings should match.')
      } catch(err) {
        t.fail(err.message)
      }
    }
    t.end()
  })

  t.test('Base64 stress test', t => {
    const rounds  = 1000
    const results :string[][] = []

    for (let i = 0; i < rounds; i++) {
      const random  = randomBytes(32)
      const encoded = Base64.encode(random)
      const decoded = Base64.decode(encoded)
      results.push([ Hex.encode(decoded), Hex.encode(random) ])
    }

    const failures = results.filter(([ t, e ]) => t !== e)
    t.plan(1)
    t.equal(failures.length, 0, 'Failure count should be zero.')
  })
}
