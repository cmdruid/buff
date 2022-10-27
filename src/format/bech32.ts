// Copyright (c) 2017, 2021 Pieter Wuille
// Revisions made by Christopher Scott (2022)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

interface Bech32API {
  encode : Function
  decode : Function
}

const Bech32 : Bech32API = {
  encode,
  decode
}

const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]

const encodings = {
  BECH32: 'bech32',
  BECH32M: 'bech32m'
}

function getEncodingConst(enc : string) : number {
  switch (enc) {
    case encodings.BECH32:
      return 1
    case encodings.BECH32M:
      return 0x2bc830a3
    default:
      throw new Error(`Unrecognized encoding: ${enc}`)
  }
}

function polymod(values : number[]) : number {
  let chk = 1
  for (let p = 0; p < values.length; ++p) {
    const top = chk >> 25
    chk = (chk & 0x1ffffff) << 5 ^ values[p]
    for (let i = 0; i < 5; ++i) {
      if ((top >> i) & 1) {
        chk ^= GENERATOR[i]
      }
    }
  }
  return chk
}

function hrpExpand(hrp : string) : number[] {
  /** Expand the HRP into values for checksum computation. */
  const ret = []
  let p
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) >> 5)
  }
  ret.push(0)
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) & 31)
  }
  return ret
}

function convertBits(
  data     : number[],
  fromBits : number,
  toBits   : number,
  pad      : boolean = true
) : number[] {
  /** Power of 2 base conversion. */
  const ret = []

  let acc = 0; let bits = 0

  const maxVal = (1 << toBits) - 1
  const maxAcc = (1 << (fromBits + toBits - 1)) - 1

  for (const val of data) {
    if (val < 0 || (val >> fromBits)) {
      return []
    }
    acc = ((acc << fromBits) | val) & maxAcc
    bits += fromBits
    while (bits >= toBits) {
      bits -= toBits
      ret.push((acc >> bits) & maxVal)
    }
  }

  if (pad) {
    if (bits) {
      ret.push((acc << (toBits - bits)) & maxVal)
    }
  } else if (bits >= fromBits || (acc << (toBits - bits)) & maxVal) {
    return []
  }
  return ret
}

function verifyChecksum(hrp : string, data : number[], enc : string) {
  const combined = hrpExpand(hrp).concat(data)
  return polymod(combined) === getEncodingConst(enc)
}

function createChecksum(hrp : string, data : number[], enc : string) {
  const values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0])
  const mod = polymod(values) ^ getEncodingConst(enc)
  const ret = []
  for (let p = 0; p < 6; ++p) {
    ret.push((mod >> 5 * (5 - p)) & 31)
  }
  return ret
}

function b32encode(hrp : string, data : number[], enc : string) {
  const combined = data.concat(createChecksum(hrp, data, enc))
  let ret = hrp + '1'
  for (let p = 0; p < combined.length; ++p) {
    ret += CHARSET.charAt(combined[p])
  }
  return ret
}

function b32decode(bechstr : string, version : number) {
  const enc : string = (version) ? 'bech32m' : 'bech32'

  if (!checkBounds(bechstr)) {
    return { hrp: null, data: [0xFF]}
  }

  bechstr = bechstr.toLowerCase()

  if (!checkSeparatorPos(bechstr)) {
    return { hrp: null, data: [0xFF] }
  }

  const data : number[] = []

  const pos = bechstr.lastIndexOf('1')
  const hrp = bechstr.substring(0, pos)

  for (let p = pos + 1; p < bechstr.length; ++p) {
    const d = CHARSET.indexOf(bechstr.charAt(p))
    if (d === -1) {
      return { hrp: null, data: [0xFF] }
    }
    data.push(d)
  }

  return (verifyChecksum(hrp, data, enc))
    ? { hrp, data: data.slice(0, data.length - 6) }
    : { hrp: null, data: [0xFF] }
}

function checkBounds(bechstr : string) {
  let p; let char; let hasLower = false; let hasUpper = false

  for (p = 0; p < bechstr.length; ++p) {
    char = bechstr.charCodeAt(p)
    if (char < 33 || char > 126) {
      return false
    }
    if (char >= 97 && char <= 122) {
      hasLower = true
    }
    if (char >= 65 && char <= 90) {
      hasUpper = true
    }
  }

  return !(hasLower && hasUpper)
}

function checkSeparatorPos(bechstr : string) {
  const pos = bechstr.lastIndexOf('1')
  return !(
    pos < 1 ||
    pos + 7 > bechstr.length ||
    bechstr.length > 90
  )
}

function encode(
  data    : Uint8Array,
  hrp     : string = 'bch',
  version : number = 0
) : string {
  const dat = [version, ...convertBits([...data], 8, 5)]
  const enc = (version) ? 'bech32m' : 'bech32'
  const str = b32encode(hrp, dat, enc)
  const chk = decode(str, version)

  if (!chk) {
    throw new Error(`Failed to decode string: ${str}`)
  }

  return str
}

function decode(
  str : string,
  version : number = 0
) : Uint8Array {
  const hrp = str.split('1', 1)[0]
  const { hrp: hrpgot, data } = b32decode(str, version)
  const decoded = convertBits(data.slice(1), 5, 8, false)
  const length = decoded.length

  switch (true) {
    case (hrp !== hrpgot):
      throw new Error('Returned hrp string is invalid.')
    case (decoded === null || length < 2 || length > 40):
      throw new Error('Decoded string is invalid or out of spec.')
    case (data[0] > 16):
      throw new Error('Returned version bit is out of range.')
    case (data[0] === 0 && length !== 20 && length !== 32):
      throw new Error('Decoded string does not match version 0 spec.')
    case (data[0] === 0 && version !== 0):
      throw new Error('Decoded version bit does not match.')
    case (data[0] !== 0 && version !== 1):
      throw new Error('Decoded version bit does not match.')
    default:
      return Uint8Array.from(decoded)
  }
}

export default Bech32
