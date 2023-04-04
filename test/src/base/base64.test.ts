import { Test }     from 'tape'
import { Base64 }   from '../../../src/base64.js'
import { Buff }     from '../../../src/buff.js'
import test_vectors from './basex.vector.json' assert { type: 'json' }

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
        const decoded = Buff.raw(Base64.decode(enc)).str
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
      const random  = Buff.random()
      const encoded = Base64.encode(random)
      const decoded = Base64.decode(encoded)
      results.push([ Buff.raw(decoded).hex, random.hex ])
    }

    const failures = results.filter(([ t, e ]) => t !== e)
    t.plan(1)
    t.equal(failures.length, 0, 'Failure count should be zero.')
  })
}
