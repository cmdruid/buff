const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

interface Base58API {
  encode : Function,
  decode : Function,
}

const Base58 : Base58API = {
  encode, 
  decode
}

function encode(bytes : Uint8Array) : string {
  const d : number[] = []

  let s = ''
  let i, j = 0, c, n

  for (i of bytes) {
    j = 0
    c = bytes[i]
    s += c || s.length ^ i ? '' : 1

    while (j in d || c) {
      n = d[j]
      n = n ? n * 256 + c : c
      c = n / 58 | 0
      d[j] = n % 58
      j++
    }
  }

  while (j--) {
    s += ALPHABET[d[j]]
  }

  return s
}

function decode(str : string) : Uint8Array {
  const d : number[] = [], b = []

  let i, j = 0, c, n

  for (i = 0; i < str.length; i++) {
    j = 0
    c = ALPHABET.indexOf(str[i])

    if (c < 0) {
      throw new Error(`Character range out of bounds: ${c}`)
    }

    i = (c || b.length ^ i) ? i : b.push(0)

    while (j in d || c) {
      n = d[j]
      n = n ? n * 58 + c : c
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

export default Base58
