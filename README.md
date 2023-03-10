# Buff Utils
Cross-platform utility library for working with array buffers and moving between formats.

## Installation
```html
<script src="https://unpkg.com/@cmdcode/buff-utils">
```
```bash
yarn add @cmdcode/buff-utils | npm install @cmdcode/buff-utils
```

## How to Use
```ts
/**
 * Buff class extends Uint8Array object
 * and provides simple format conversion. 
 * */
import { Buff } from '@cmdcode/buff-utils'

Buff
  .str(strData)    => Buff<Uint8Array>
  .hex(hexData)    => Buff<Uint8Array>
  .num(numData)    => Buff<Uint8Array>
  .big(bigData)    => Buff<Uint8Array>
  .raw(buffer)     => Buff<Uint8Array>
  .json(jsonData)  => Buff<Uint8Array>
  .bech32(strData) => Buff<Uint8Array>
  .base58(strData) => Buff<Uint8Array>
  .base64(strData) => Buff<Uint8Array>
  .b64url(strData) => Buff<Uint8Array>

new Buff(data: ArrayBufferLike, size: number)
  .toArr()    => number[]
  .toStr()    => string
  .toHex()    => hexstring
  .toNum()    => number
  .toBig()    => bigint
  .toBytes()  => Uint8Array
  .toJson()   => object
  .toBech32() => b32string
  .toBase58() => b58string
  .toBase64() => b64string
  .toB64url() => b64string

/* There's also a number of helpful utiltiy methods. */

Buff.
  // Same as TextEncoder.
  encode(string)     => Uint8Array
  // Same as TextEncoder.  
  decode(Uint8Array) => string
  // Normalizes typed arrays and hex strings.
  normalize(hexstring | Uint8Array)
  // Serializes json objects and strings.
  serialize(string  | Uint8Array | Json) => Uint8Array
  // Safely revives json objects or strings.
  revitalize(string | Uint8Array) => Json | string

// Some of this utility has been separated into smaller 
// libraries for convenience and code readability
import { Base64, Hex, Txt } from '@cmdcode/buff-utils'
```

```ts
/** 
 * In addition to the standard Uint8Array API,
 * you can also perform other convenient tasks.
 * */

Buff
  .readVarint(num : number)   => Uint8Array // Reads the first byte as a varint.
  .join(arr: Uint8Array[])    => Uint8Array // Returns a concatenated byte array.
  .random (size : number)     => Uint8Array // Returns an array with random bytes.

new Bytes(data: Uint8Array)
  .prepend(data: Uint8Array)  => Uint8Array // Returns prepended byte array.
  .append(data: Uint8Array)   => Uint8Array // Returns appended byte array.
  .prependVarint(num: number) => Uint8Array // Returns appended byte array.
  .write(
    bytes : Uint8Array, 
    offset ?: number
  ) => void // Wraps Uint8Array.set().
```

```ts
/**
 * Stream class reads from a Uint8Array,
 * and consumes the data on each read.
 * */
import { Stream } from '@cmdcode/buff-utils'

new Stream(data: ArrayBufferLike)
  .peek(len: number) => bytes // Reads the array, does not consume.
  .read(len: number) => bytes // Reads the array, shrinks the array.
  .varint() => number // Reads the next byte as varint, returns number.
```

```ts
/**
 * Type class is an extention of 'typeof'.
 * It will attempt to return a proper string
 * for the variable type.
 */
import { Type } from '@cmdcode/buff-utils'

Type.of(data: any) => string [
  'undefined'
  'infinity'
  'null'
  'hex'
  'string'
  'bigint'
  'number'
  'array'
  'uint8'
  'uint16'
  'uint32'
  'buffer'
  'object'
  'unknown'
]
```
## Issues
Please feel free to post any questions or bug reports on the issues page!

This library is currently in heavy development. Watch out for dragons!

## Testing
This project uses tape for writing unit tests. I have a script that scans the API of each library and tries to import tests dynamically. The benefit of this is I can run the same tests on any bundle of the source code, so all bundle targets are tested (except cjs, gotta figure out one out).

There's also a test/index.html that will launch testing for the browser bundle, and test within the browser. Pretty neat!

## Development
This project uses the following development tools:

  - ESLint     : For linting and catching linter errors.
  - Nyc        : For test code coverage and reports.
  - Rollup     : Bundling/optimizing code for different platforms.
  - Tape       : A simple, easy to use testing library. 
  - Typescript : Type-checking and generating declaration files.

It should be straight-forward to setup a development environment:
```bash
yarn install | npm install
```

## Contributions
All contributions are welcome!
