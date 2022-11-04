const BaseX = {
  encode,
  decode
}

interface Alphabet {
  name    : string
  charset : string
}

const ALPHABETS : Alphabet[] = [
  {
    name    : 'base58',
    charset : '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  },
  {
    name    : 'base64',
    charset : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  },
  {
    name    : 'base64url',
    charset : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  },
]

function getAlphabet(name : string) : string {
  for (const alpha of ALPHABETS) {
    if (alpha.name === name) {
      return alpha.charset
    }
  }
  throw TypeError('Charset does not exist: ' + name)
}

function encode(
  data    : Uint8Array, 
  charset : string,
  padding : boolean = false
) : string {
  const alphabet = getAlphabet(charset)
  const len = alphabet.length
  const d : number[] = []

  let s = ''
  let i, j = 0, c, n

  for (i = 0; i < data.length; i++) {
    j = 0
    c = data[i]
    s += c || s.length ^ i ? '' : 1
    while (j in d || c) {
      n = d[j]
      n = n ? n * 256 + c : c
      c = n / len | 0
      d[j] = n % len
      j++
    }
  }

  while (j--) {
    s += alphabet[d[j]]
  }

  return (padding && s.length % 4)
    ? s + '='.repeat(4 - s.length % 4)
    : s
}

function decode(
  encoded : string,
  charset : string
) : Uint8Array {
  const alphabet = getAlphabet(charset)
  const len = alphabet.length
  const d : number[] = [], b = []

  encoded = encoded.replace('=', '')

  let i, j = 0, c, n

  for (i = 0; i < encoded.length; i++) {
    j = 0
    c = alphabet.indexOf(encoded[i])

    if (c < 0) {
      throw new Error(`Character range out of bounds: ${c}`)
    }

    i = (c || b.length ^ i) ? i : b.push(0)

    while (j in d || c) {
      n = d[j]
      n = n ? n * len + c : c
      c = n >> 8
      d[j] = n % 256
      j++
    }
  }

  while (j--) {
    b.push(d[j])
  }

  return Uint8Array.from(b)
}

export default BaseX
