import { sha256 as s256 }    from '@noble/hashes/sha256'
import { sha512 as s512 }    from '@noble/hashes/sha512'
import { ripemd160 as r160 } from '@noble/hashes/ripemd160'
import { hmac }   from '@noble/hashes/hmac'
import { Bytes }  from './types.js'
import { buffer } from './convert.js'

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
  return hmac(s256, buffer(key), buffer(msg))
}

export function hmac512 (key : Bytes, msg : Bytes) : Uint8Array {
  return hmac(s512, buffer(key), buffer(msg))
}

export const Hash = {
  sha256,
  sha512,
  ripe160,
  hash256,
  hash160,
  hmac256,
  hmac512
}
