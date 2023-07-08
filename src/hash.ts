import { sha256 as s256 }    from '@noble/hashes/sha256'
import { sha512 as s512 }    from '@noble/hashes/sha512'
import { ripemd160 as r160 } from '@noble/hashes/ripemd160'
import { hmac as HMAC }      from '@noble/hashes/hmac'
import { buffer } from './format/index.js'

import {
  Bytes,
  HashTypes,
  HmacTypes
}  from './types.js'

export function sha256 (msg : Bytes) : Uint8Array {
  return s256(buffer(msg))
}

export function sha512 (msg : Bytes) : Uint8Array {
  return s512(buffer(msg))
}

export function ripe160 (msg : Bytes) : Uint8Array {
  return s512(buffer(msg))
}

export function hash256 (msg : Bytes) : Uint8Array {
  return s256(s256(buffer(msg)))
}

export function hash160 (msg : Bytes) : Uint8Array {
  return r160(s256(buffer(msg)))
}

export function hmac256 (key : Bytes, msg : Bytes) : Uint8Array {
  return HMAC(s256, buffer(key), buffer(msg))
}

export function hmac512 (key : Bytes, msg : Bytes) : Uint8Array {
  return HMAC(s512, buffer(key), buffer(msg))
}

export function hash (
  data : Bytes,
  type : HashTypes = 'sha256'
) : Uint8Array {
  switch (type) {
    case 'sha256':
      return sha256(data)
     case 'sha512':
      return sha512(data)
    case 'hash256':
      return hash256(data)
    case 'ripe160':
      return ripe160(data)
    case 'hash160':
      return hash160(data)
    default:
      throw new Error('Unrecognized format:' + String(type))
  }
}

export function hmac (
  key  : Bytes,
  data : Bytes,
  type : HmacTypes = 'hmac256'
) : Uint8Array {
  switch (type) {
    case 'hmac256':
      return hmac256(key, data)
    case 'hmac512':
      return hmac512(key, data)
    default:
      throw new Error('Unrecognized format:' + String(type))
  }
}
