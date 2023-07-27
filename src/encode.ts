import { sha256 } from '@noble/hashes/sha256'

import {
  base58check,
  base64,
  base64url,
  bech32,
  bech32m
} from '@scure/base'

export const Encoder = {
  b58chk: {
    encode : (data : Uint8Array) => base58check(sha256).encode(data),
    decode : (data : string)     => base58check(sha256).decode(data)
  },
  base64: {
    encode : (data : Uint8Array) => base64.encode(data),
    decode : (data : string)     => base64.decode(data)
  },
  b64url: {
    encode : (data : Uint8Array) => base64url.encode(data),
    decode : (data : string)     => base64url.decode(data)
  },
  bech32: {
    into_words : bech32.toWords,
    from_words : bech32.fromWords,

    encode: (
      prefix : string,
      data   : Uint8Array,
      limit  : number | false = false
    ) => {
      return bech32.encode(prefix, bech32.toWords(data), limit)
    },
    decode: (
      data  : string,
      limit : number | false = false
    ) => {
      const { prefix, words } = bech32.decode(data, limit)
      return { prefix, words, bytes: bech32.fromWords(words) }
    }
  },
  bech32m: {
    into_words : bech32m.toWords,
    from_words : bech32m.fromWords,

    encode: (
      prefix : string,
      data   : Uint8Array,
      limit  : number | false = false
    ) => {
      return bech32m.encode(prefix, bech32m.toWords(data), limit)
    },
    decode: (
      data  : string,
      limit : number | false = false
    ) => {
      const { prefix, words } = bech32m.decode(data, limit)
      return { prefix, words, bytes: bech32m.fromWords(words) }
    }
  }
}
