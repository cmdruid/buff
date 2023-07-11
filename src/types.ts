import { Buff } from './buff.js'

export type Bytes   = string | number | bigint | Uint8Array | Buff
export type Endian  = 'le' | 'be'
