import tape from 'tape'

import { BaseX } from '../../src/basex.js'
import { Buff }  from '../../src/buff.js'
import vectors   from './vectors/base58.vector.json' assert { type: 'json' }

export function base58Test() {
  tape('Base58 test vectors', t => {
    for (const [ dec, enc ] of vectors) {
      const encoded = BaseX.encode(Buff.hex(dec), 'base58')
      const decoded = Buff.raw(BaseX.decode(enc, 'base58')).hex
      t.equal(encoded, enc, 'Encodings should match.')
      t.equal(decoded, dec, 'Decodings should match.')
    }
    t.end()
  })
}
