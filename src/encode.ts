import { sha256 } from '@noble/hashes/sha256'

import {
  bytesToStr,
  bytesToHex,
  hexToBytes,
  strToBytes
} from './format/str.js'

import {
  base58check,
  base64,
  base64urlnopad,
  bech32,
  bech32m
} from '@scure/base'

export const Hex = {
  encode : bytesToHex,
  decode : hexToBytes
}

export const Txt = {
  encode : strToBytes,
  decode : bytesToStr
}

export const B58chk = {
  encode : (data : Uint8Array) => base58check(sha256).encode(data),
  decode : (data : string)     => base58check(sha256).decode(data)
}

export const Base64 = {
  encode : (data : Uint8Array) => base64.encode(data),
  decode : (data : string)     => base64.decode(data)
}

export const B64url = {
  encode : (data : Uint8Array) => base64urlnopad.encode(data),
  decode : (data : string)     => base64urlnopad.decode(data)
}

export const Bech32 = {
  to_words : bech32.toWords,
  to_bytes : bech32.fromWords,

  encode: (
    prefix : string,
    words  : number[],
    limit  : number | false = false
  ) => {
    return bech32.encode(prefix, words, limit)
  },
  decode: (
    data  : string,
    limit : number | false = false
  ) => {
    const { prefix, words } = bech32.decode(data, limit)
    return { prefix, words }
  }
}

export const Bech32m = {
  to_words : bech32m.toWords,
  to_bytes : bech32m.fromWords,

  encode: (
    prefix : string,
    words  : number[],
    limit  : number | false = false
  ) => {
    return bech32m.encode(prefix, words, limit)
  },
  decode: (
    data  : string,
    limit : number | false = false
  ) => {
    const { prefix, words } = bech32m.decode(data, limit)
    return { prefix, words }
  }
}
