import tape from 'tape'
import endian_test    from './src/endian.test.js'
import integrity_test from './src/integrity.test.js'
import parity_test    from './src/parity.test.js'
import base58_test    from './src/base58.test.js'
import base64_test    from './src/base64.test.js'
import bech32_test    from './src/bech32.test.js'

tape('buff-utils test suite', t => {
  endian_test(t)
  integrity_test(t)
  parity_test(t)
  base58_test(t)
  base64_test(t)
  bech32_test(t)
})
