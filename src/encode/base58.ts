import { sha256 }     from '@noble/hashes/sha256'
import { join_array } from '../utils.js'

const ec = new TextEncoder()

interface Alphabet {
  name    : string
  charset : string
}

const ALPHABETS : Alphabet[] = [
  {
    name    : 'base58',
    charset : '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  }
]

function getAlphabet (name : string) : string {
  for (const alpha of ALPHABETS) {
    if (alpha.name === name) {
      return alpha.charset
    }
  }
  throw TypeError('Charset does not exist: ' + name)
}

function encode (
  data    : string | Uint8Array,
  charset : string,
  padding : boolean = false
) : string {
  if (typeof data === 'string') data = ec.encode(data)

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
      n = n > 0 ? n * 256 + c : c
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

function decode (
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

    if (!(c > 0 || (b.length ^ i) > 0)) b.push(0)

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

  return new Uint8Array(b)
}

function hash256 (data : Uint8Array) : Uint8Array {
  return sha256(sha256(data))
}

function addChecksum (
  data : Uint8Array
) : Uint8Array {
  const sum = hash256(data)
  return join_array([ data, sum.slice(0, 4) ])
}

function checkTheSum (
  data : Uint8Array
) : Uint8Array {
  const ret = data.slice(0, -4)
  const chk = data.slice(-4)
  const sum = hash256(ret).slice(0, 4)
  if (sum.toString() !== chk.toString()) {
    throw new Error('Invalid checksum!')
  }
  return ret
}

const BaseX = {
  encode,
  decode
}

export const Base58 = {
  encode : (data : string | Uint8Array) => BaseX.encode(data, 'base58'),
  decode : (data : string) => BaseX.decode(data, 'base58')
}

export const B58CHK = {
  encode: (data : Uint8Array) => {
    const withSum = addChecksum(data)
    return BaseX.encode(withSum, 'base58')
  },
  decode: (data : string) =>  {
    const decoded = BaseX.decode(data, 'base58')
    return checkTheSum(decoded)
  }
}
