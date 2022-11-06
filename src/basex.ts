
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

  const len : number   = alphabet.length
  const d   : number[] = []

  let s : string = '',
      i : number,
      j : number = 0, 
      c : number,
      n : number

  for (i = 0; i < data.length; i++) {
    j = 0
    c = data[i]
    s += (c > 0 || (s.length ^ i) > 0) ? '' : '1'
    while (j in d || c > 0) {
      n = d[j]
      n = n > 0? n * 256 + c : c
      c = n / len | 0
      d[j] = n % len
      j++
    }
  }

  while (j-- > 0) {
    s += alphabet[d[j]]
  }

  return (padding && s.length % 4 > 0)
    ? s + '='.repeat(4 - s.length % 4)
    : s
}

function decode(
  encoded : string,
  charset : string
) : Uint8Array {
  const alphabet = getAlphabet(charset)

  const len : number   = alphabet.length,
        d   : number[] = [],
        b   : number[] = []

  encoded = encoded.replace('=', '')

  let i : number, 
      j : number = 0, 
      c : number, 
      n : number

  for (i = 0; i < encoded.length; i++) {
    j = 0
    c = alphabet.indexOf(encoded[i])

    if (c < 0) {
      throw new Error(`Character range out of bounds: ${c}`)
    }

    i = (c > 0 || (b.length ^ i) > 0) ? i : b.push(0)

    while (j in d || c > 0) {
      n = d[j]
      n = n > 0 ? n * len + c : c
      c = n >> 8
      d[j] = n % 256
      j++
    }
  }

  while (j-- > 0) {
    b.push(d[j])
  }

  return Uint8Array.from(b)
}

const BaseX = {
  encode,
  decode
}

export default BaseX
