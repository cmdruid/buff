export type Literal  = string | number | boolean | null
export type Json     = Literal | { [key: string]: Json } | Json[]
export type Bytes    = string | number | bigint | Uint8Array
export type Data     = Json | Uint8Array