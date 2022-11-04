import BaseX from '../src/basex.js'

const ec = new TextEncoder()
const dc = new TextDecoder()

const msg = 'Many hands make light work.'
const encoded = BaseX.encode(ec.encode(msg), 'base64')
const decoded = dc.decode(BaseX.decode(encoded, 'base64'))

console.log(encoded, encoded === 'TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu')
console.log(decoded, msg === decoded)

console.log(BaseX.encode(ec.encode('light work.'), 'base64', true))
console.log(BaseX.encode(ec.encode('light work'), 'base64', true))
console.log(BaseX.encode(ec.encode('light wor'), 'base64', true))
console.log(BaseX.encode(ec.encode('light wo'), 'base64', true))