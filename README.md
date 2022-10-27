# Bytes Utils
Cross-platform utility library for working with byte-arrays and moving between formats.

## Installation
```html
<script src="https://unpkg.com/@cmdcode/bytes-utils">
```
```bash
yarn add @cmdcode/bytes-utils | npm install @cmdcode/bytes-utils
```

## How to Use
```ts
/* Buff class extends Uint8Array object
 * and provides simple format conversion. 
 */
import { Buff } from '@cmdcode/bytes-utils'

Buff
  .str(strData)    => Buff<Uint8Array>
  .hex(hexData)    => Buff<Uint8Array>
  .num(numData)    => Buff<Uint8Array>
  .big(bigData)    => Buff<Uint8Array>
  .buff(buffer)    => Buff<Uint8Array>
  .json(jsonData)  => Buff<Uint8Array>
  .bech32(strData) => Buff<Uint8Array>
  .base58(strData) => Buff<Uint8Array>
  .base64(strData) => Buff<Uint8Array>

new Buff(data: ArrayBufferLike, size: number)
  .toStr()    => string
  .toHex()    => hexstring
  .toNum()    => number
  .toBig()    => bigint
  .toBytes()  => Uint8Array
  .toJson()   => object
  .toBech32() => b32string
  .toBase58() => b58string
  .toBase64() => b64string
```

```ts
/* Bytes class extends the Buff object
 * even further, adds byte manipualtion. 
 */
import { Bytes } from '@cmdcode/bytes-utils'

Bytes
  .varint(num: number)     => bytes // Returns a byte array of the varint.
  .join(arr: Uint8Array[]) => bytes // Returns a concatenated byte array.    

new Bytes(data: ArrayBufferLike, size: number)
  .prepend(bytes: Uint8Array) => bytes // Returns prepended byte array.
  .append(bytes: Uint8Array)  => bytes // Returns appended byte array.
  .varint(num: number)        => bytes // Returns appended byte array.
```

```ts
/* Stream class reads from a Uint8Array,
 * and consumes the data on each read.
 */
import { Stream } from '@cmdcode/bytes-utils'

new Stream(data: ArrayBufferLike)
  .peek(len: number) => bytes // Reads the array, does not consume.
  .read(len: number) => bytes // Reads the array, shrinks the array.
  .varint() => number // Reads the next byte as varint, returns number.
```

```ts
/* Type class is an extention of 'typeof',
 * tries to determine a 'type' to any data.
 */
import { Type } from '@cmdcode/bytes-utils'

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
  - Prettier   : For enforcing standard code formatting.
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
