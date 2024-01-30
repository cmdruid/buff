import { Test }        from 'tape'
import { randomBytes } from '@noble/hashes/utils'

import {
  Bech32,
  Bech32m,
  Hex
 } from '../../src/index.js'

import * as util  from '../../src/utils.js'

import pass_vectors from './vectors/bech32.pass.json' assert { type: 'json' }
import fail_vectors from './vectors/bech32.fail.json' assert { type: 'json' }

export default function bech32Test(t : Test) {

  // t.test('Bech32 pass test vectors.', async t => {

  //   t.plan(pass_vectors.length * 2)

  //   for (const [ encode_target, decode_target ] of pass_vectors) {
  //     const bytes = Hex.decode(decode_target)
  //     let [ prefix, encoded ] = encode_target.split('1')
  //     console.log('version:', encoded.slice(0, 1))
  //     let version = encoded.startsWith('p') ? 1 : 0

  //     prefix = prefix.toLowerCase()

  //     try {
  //       const encoded = (version === 1)
  //         ? bech32m.encode(prefix, bytes)
  //         : bech32.encode(prefix, bytes)
  //       t.equal(encoded, encode_target.toLowerCase(), 'Target should match encoding.')
  //     } catch(err) {
  //       t.fail(err.message)
  //     }

  //     try {
  //       const decoded = (version === 1)
  //         ? bech32m.decode(encode_target)
  //         : bech32.decode(encode_target)
  //       t.equal(Hex.encode(decoded.bytes), decode_target.toLowerCase(), 'Decoding should match target.')
  //     } catch(err) {
  //       t.fail(err.message)
  //     }
  //   }
  // })

  // t.test('Bech32 failure test vectors.', async t => {

  //   t.plan(fail_vectors.length)

  //   for (const [ encoded, reason ] of fail_vectors) {
  //     t.throws(() => {
  //       try {
  //         console.log(bech32.decode(encoded))
  //       } catch(err) {
  //         console.log(err.message)
  //         throw err
  //       }
  //     }, reason)
  //   }
  // })

  t.test('Bech32 stress test', t => {
    const rounds  = 1000
    const results :string[][] = []

    for (let i = 0; i < rounds; i++) {
      const version = Math.floor(Math.random())
      const random  = randomBytes(32)
      const words = (version === 1)
        ? Bech32m.to_words(random)
        : Bech32.to_words(random)
      const encoded = (version === 1)
        ? Bech32m.encode('bc', words)
        : Bech32.encode('bc', words)
      const decoded = (version === 1)
        ? Bech32m.decode(encoded)
        : Bech32.decode(encoded)
      const bytes = (version === 1)
        ? Bech32m.to_bytes(decoded.words)
        : Bech32.to_bytes(decoded.words)
      results.push([ Hex.encode(bytes), Hex.encode(random) ])
    }

    const failures = results.filter(([ t, e ]) => t !== e)
    t.plan(1)
    t.equal(failures.length, 0, 'Failure count should be zero.')
  })
}