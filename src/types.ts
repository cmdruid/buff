import { Buff } from './buff.js'

export type Bytes   = string | number | bigint | Uint8Array | Buff
export type Endian  = 'le' | 'be'

export type Replacer = (this : any, key : string, value : any) => any
export type Reviver  = (this : any, key : string, value : any) => any
