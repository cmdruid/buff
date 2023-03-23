/**
 * This file implements base64 encoding and decoding.
 * Encoding is done by the function base64Encode(), decoding
 * by base64Decode(). The naming mimics closely the corresponding
 * library functions found in PHP. However, this implementation allows
 * for a more flexible use.
 *
 * This implementation follows RFC 3548 (http://www.faqs.org/rfcs/rfc3548.html),
 * so the copyright formulated therein applies.
 *
 * Dr.Heller Information Management, 2005 (http://www.hellerim.de).
 *
 * Code refactor performed by Christopher Scott.
 */

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const B64URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

const ec = new TextEncoder()

function b64encode (input : string | Uint8Array, url = false) : string {
  const buffer : number[] = []
  const encoding = (url) ? B64URL_ALPHABET : BASE64_ALPHABET

  if (typeof input === 'string') input = ec.encode(input)

  const n = 1     // length of read buffer
  let out = ''    // output string
  let c = 0       // holds character code (maybe 16 bit or 8 bit)
  let j = 1       // sextett counter
  let l = 0       // work buffer
  let s = 0       // holds sextett

  for (let i = 0; i < input.length; i++) {  // read input
    c = input[i] // fill read buffer
    for (let k = n - 1; k >= 0; k--) {
      buffer[k] = c & 0xff
      c >>= 8
    }
    for (let m = 0; m < n; m++) {           // run through read buffer.
      l = ((l << 8) & 0xff00) | buffer[m]   // shift remaining bits one byte to the left and append next byte.
      s = (0x3f << (2 * j)) & l             // extract sextett from buffer.
      l -= s                                // remove those bits from buffer.
      out += encoding.charAt(s >> (2 * j))  // convert leftmost sextett and append it to output.
      j++
      if (j === 4) {                        // another sextett is complete.
        out += encoding.charAt(l & 0x3f)    // convert and append it.
        j = 1
      }
    }
  }
  switch (j) {                              // handle left-over sextetts.
    case 2:
      s = 0x3f & (16 * l)                   // extract sextett from buffer.
      out += encoding.charAt(s)             // convert leftmost sextett and append it to output.
      out += '=='
      break
    case 3:
      s = 0x3f & (4 * l)                    // extract sextett from buffer.
      out += encoding.charAt(s)             // convert leftmost sextett and append it to output.
      out += '='
      break
    default:
      break
  }
  return out
}

function b64decode (input : string, url = false) : Uint8Array {
  const out = []
  const map : Record<string, number> = {}
  const encoding = (url) ? B64URL_ALPHABET : BASE64_ALPHABET

  for (let p = 0; p < encoding.length; p++) {
    map[encoding.charAt(p)] = p
  }

  let l = 0               // work area
  let i = 0               // index into input
  let j = 0               // sextett counter
  let c = 0               // input buffer
  let end = input.length  // one position past the last character to be processed

  // search for trailing '=''s.
  for (let p = 0; p < 2; p++) {
    if (input.charAt(end - 1) === '=') {
      end--
    } else {
      break
    }
  }

  // convert.
  for (i = 0; i < end; i++) {
    l <<= 6                          // clear space for next sextett
    c = map[input.charAt(i)]
    l |= (c & 0x3f)                  // append it
    if (j === 0) {
      j++
      continue                       // work area contains incomplete byte only
    }
    out.push(l >> (2 * (3 - j)))     // append byte to array
    l &= ~(0xff << (2 * (3 - j)))
    j = ++j % 4                      // increment sextett counter cyclically
  }

  return Uint8Array.of(...out)
}

export const Base64 = {
  encode : b64encode,
  decode : b64decode
}

export const B64URL = {
  encode : (data : string | Uint8Array) => b64encode(data, true),
  decode : (data : string) => b64decode(data, true)
}
