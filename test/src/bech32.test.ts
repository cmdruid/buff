import { Test }   from 'tape'
import { Hex }    from '../../src/index.js'
import { Bech32 } from '../../src/index.js'
import * as util  from '../../src/utils.js'

import pass_vectors from './vectors/bech32.pass.json' assert { type: 'json' }
import fail_vectors from './vectors/bech32.fail.json' assert { type: 'json' }

export default function bech32Test(t : Test) {

  t.test('Bech32 pass test vectors.', async t => {

    t.plan(pass_vectors.length * 2)

    for (const [ encode_target, decode_target ] of pass_vectors) {
      const bytes = Hex.decode(decode_target)
      let [ hrp ] = encode_target.split('1', 1)
      let version = 0
      
      try {
        version = Bech32.version(encode_target)
      } catch(err) {
        console.log('Version checking failed:', err.message)
        version = 0
      }

      hrp = hrp.toLowerCase()

      try {
        const encoded = Bech32.encode(bytes, hrp, version)
        t.equal(encoded, encode_target.toLowerCase(), 'Target should match encoding.')
      } catch(err) {
        t.fail(err.message)
      }
      try {
        const decoded = Bech32.decode(encode_target)
        t.equal(Hex.encode(decoded), decode_target.toLowerCase(), 'Decoding should match target.')
      } catch(err) {
        t.fail(err.message)
      }
    }
  })

  t.test('Bech32 failure test vectors.', async t => {

    t.plan(fail_vectors.length)

    for (const [ encoded, reason ] of fail_vectors) {
      t.throws(() => {
        try {
          Bech32.decode(encoded)
        } catch(err) {
          console.log(err.message)
          throw err
        }
      }, reason)
    }
  })

  t.test('Bech32 stress test', t => {
    const rounds  = 1000
    const results :string[][] = []

    for (let i = 0; i < rounds; i++) {
      const random  = util.random(32)
      const version = Math.floor(Math.random())
      const encoded = Bech32.encode(random, 'bc', version)
      const decoded = Bech32.decode(encoded)
      results.push([ Hex.encode(decoded), Hex.encode(random) ])
    }

    const failures = results.filter(([ t, e ]) => t !== e)
    t.plan(1)
    t.equal(failures.length, 0, 'Failure count should be zero.')
  })
}