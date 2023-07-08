export type Literal = string | number | boolean | null
export type Json    = Literal | { [key : string] : Json } | Json[]
export type Bytes   = string | number | bigint | Uint8Array
export type Data    = Json | Uint8Array

export type HashTypes  = 'sha256'  | 'sha512' | 'hash256' | 'ripe160' | 'hash160'
export type HmacTypes  = 'hmac256' | 'hmac512'
export type Endian     = 'le' | 'be'
