import tape from 'tape'

import { BaseX } from '../../src/basex.js'
import { Buff }  from '../../src/buff.js'
import vectors   from './vectors/basex.vector.json' assert { type: 'json' }

import { Base64 } from '../../src/base64.js'

export function baseTest() {
  tape('Base58 test vectors', t => {
    for (const [ dec, enc ] of vectors.base58) {
      const encoded = BaseX.encode(Buff.hex(dec), 'base58')
      const decoded = Buff.raw(BaseX.decode(enc, 'base58')).hex
      t.equal(encoded, enc, 'Encodings should match.')
      t.equal(decoded, dec, 'Decodings should match.')
    }
    t.end()
  })

  tape('Base64 test vectors', t => {
    for (const [ dec, enc ] of vectors.base64) {
      const encoded = Base64.encode(dec)
      const decoded = Buff.raw(Base64.decode(enc)).str
      t.equal(encoded, enc, 'Encodings should match.')
      t.equal(decoded, dec, 'Decodings should match.')
    }
    t.end()
  })
}
