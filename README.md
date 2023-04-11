# Buff Utils

The swiss-army-knife of byte manipulation.

Features:
 * Move between all data formats with ease!
 * Encode / decode between Base58, Base64, Bech32 and more.
 * Main buffer object recognized naturally as Uint8Array.
 * Includes sync versions of sha256, ripemd160, hash160 and hash256.
 * Prepend, append, split and join multiple arrays.
 * Read and prefix varints.
 * Convert byte blobs into consumable streams.
 * Supports endianess for all the things!

## Import

Example import into a browser-based project:

```html
<script src="https://unpkg.com/@cmdcode/buff-utils"></script>
<script> const { Buff } = window.buffUtils </script>
```

Example import into a commonjs project:

```bash
yarn add @cmdcode/buff-utils | npm install @cmdcode/buff-utils
```
```ts
const { Buff } = require('@cmdcode/buff-utils')
```

Example import into an ES module project:

```bash
yarn add @cmdcode/buff-utils | npm install @cmdcode/buff-utils
```
```ts
import { Buff } from '@cmdcode/buff-utils'
```

## How to Use

The `Buff` class is an extention of the base Uint8Array class. It provides the same default functionality of a Uint8Array, and can be used as a drop-in replacement for Uint8Array. Typescript will treat Buff as a BufferLike and Uint8Array object.

With Buff, you get access to an extensive API for converting between formats, and performing byte manipulation.

```ts
import { Buff } from '@cmdcode/buff-utils'

type BufferLike = Buff | ArrayBuffer | ArrayBufferLike | Uint8Array | string | number | bigint | boolean

Buff = {
  // Convert from any format into a Buff object.
  .any    = (data : any, size ?: number)               => Buff,
  .raw    = (data : ArrayBufferLike, size ?: number)   => Buff,
  .str    = (data : string, size ?: number)            => Buff,
  .hex    = (data : string, size ?: number)            => Buff,
  .bin    = (data : string | number[], size ?: number) => Buff,
  .num    = (data : number, size ?: number)            => Buff,
  .big    = (data : bigint, size ?: number)            => Buff,
  .bytes  = (data : BufferLike, size ?: number)        => Buff,
  .json   = (data : Json)   => Buff,
  .bech32 = (data : string) => Buff,
  .b58chk = (data : string) => Buff,
  .base64 = (data : string) => Buff,
  .b64url = (data : string) => Buff
}

const buff = new Buff(data, size)

buff
  // Convert a Buff object back into any format.
  .arr     => number[]    // Convert to a number array.
  .raw     => Uint8Array  // Convert to a pure Uint8Array.
  .str     => string      // Convert to a UTF8 string.
  .hex     => string      // Convert to a hex string.
  .num     => number      // Convert to a Number.
  .big     => bigint      // Convert to a BigInt.
  .bits    => number[]    // Convert to a binary array.
  .bin     => string      // Convert to a binary string.
  .b58chk  => string      // Convert to base58 with checksum.
  .base64  => string      // Convert to base64 string.
  .b64url  => string      // Convert to base64url string.
  .digest  => Buff        // Convert to a sha256 digest.
  .id      => string      // Convert to a digest (hex string).
  .stream  => Stream      // Convert to a Stream object.

buff
  // There are a few export methods that allow extra params.
  toNum    : (endian : Endian = 'le')          => number
  toBig    : (endian : Endian = 'le')          => bigint
  toBech32 : (hrp : string, version ?: number) => string
  toHmac   : (key : Bytes, type : HmacTypes)   => Buff
  toHash   : (type : HashTypes)                => Buff

// Some additional types are used with the Buff library.
type Literal    = string | number | boolean | null
type Json       = Literal | { [key : string] : Json } | Json[]
type Bytes      = string | number | bigint | Uint8Array
type HashTypes  = 'sha256' | 'hash256' | 'ripe160' | 'hash160'
type Endian     = 'le' | 'be'
```

In addition to format conversion, you can perform many other convenient tasks.

```ts
Buff = {
  // Same as Uint8Array.from(), but returns a Buff object.
  from (data : Uint8Array | number[]) => Buff
  // Same as Uint8Array.of(), but returns a Buff object.
  of (...data : number[]) => Buff,
  // Joins multiple arrays and data types together.
  join   : (array : BufferLike[]) => Buff,
  // Standard UTF-8 string-to-bytes encoding.
  encode : (str : string) => Uint8Array,
  // Standard UTF-8 bytes-to-string decoding.
  decode : (bytes : Uint8Array) => string,
  // Converts a number into a 'varint' for byte streams.
  varInt : (num : number, endian ?: Endian) => Buff
}

const buff = new Buff(data, size)

buff
  // Same as Uint8Array.reverse(), but returns a Buff object.
  .reverse () => Buff
  // Same as Uint8Array.slice(), but returns a Buff object.
  .slice (start ?: number, end ?: number) => Buff
  // Prepend data to your buffer object.
  .prepend (data : BufferLike) => Buff
  // Append data to your ubber object
  .append (data : BufferLike) => Buff
  // Same as Uint8Array.set().
  .write (data : Uint8Array, offset ?: number) => void
  // Encode the size of your buffer as a varint and prepend it.
  .prefixSize (endian ?: Endian) => Buff
  // Return a buffer object with random data (uses webcrypto).
  .random (size : number) => Buff
```

The `Stream` tool will take a blob of data and allow you to consume it byte-per-byte.

```ts
import { Stream } from '@cmdcode/buff-utils'

// Convert data into a stream object.
const stream = new Stream(data)

// You can convert a buff object into a stream.
const stream = new Buff(data).stream

stream
  // Reads x number of bytes, does not consume the stream.
  .peek(size: number) => Buff
  // Reads x number of bytes, consumes the stream.
  .read(size: number) => bytes
  // Reads the next bytes(s) as a varint, returns the number value.
  .readSize (endian ?: Endian) => number
```

A number of utilities are available as stand-alone packages for import.

```ts
import { Bech32, Base58C, Base64, B64URL, Hash, Hex, Txt } from '@cmdcode/buff-utils'
```

## Bugs / Issues

Please feel free to post any questions or bug reports on the issues page!

## Testing

This project uses tape for writing unit tests.

## Development

This project uses the following development tools:

  - ESLint     : For linting and catching linter errors.
  - NYC        : For test code coverage and reports.
  - Rollup     : Bundling/optimizing code for different platforms.
  - Tape       : A simple, easy to use testing library. 
  - Typescript : Type-checking and generating declaration files.

It should be straight-forward to setup a development environment:
```bash
yarn install | npm install
```

## Contributions

All contributions are welcome!

## License

Use this code however you like! No warranty!
