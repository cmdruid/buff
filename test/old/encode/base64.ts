const BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const B64URL_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

const ec = new TextEncoder()

function b64encode (
  input : string | Uint8Array,
  urlSafe = false,
  padding = true
) : string {
  // Normalize the input to the encoder.
  if (typeof input === 'string') input = ec.encode(input)

  // Determine which map to use based on the input string.
  const map = urlSafe ? B64URL_MAP : BASE64_MAP

  let output = ''
  let bits   = 0
  let buffer = 0

  // Encode the input array.
  for (let i = 0; i < input.length; i++) {
    buffer = (buffer << 8) | input[i]
    bits += 8
    while (bits >= 6) {
      bits -= 6
      output += map[(buffer >> bits) & 0x3f]
    }
  }

  // Add padding characters if necessary.
  if (bits > 0) {
    buffer <<= 6 - bits
    output += map[buffer & 0x3f]
    while (bits < 6) {
      output += padding ? '=' : ''
      bits += 2
    }
  }

  return output
}

function b64decode (input : string, urlSafe = false) : Uint8Array {
  // Determine which map to use based on the input string.
  const map = (urlSafe || input.includes('-') || input.includes('_'))
    ? B64URL_MAP.split('')
    : BASE64_MAP.split('')

  // Remove any padding characters from the input string.
  input = input.replace(/=+$/, '')

  // Convert the input string to an array of characters.
  const chars = input.split('')

  // Initialize variables for decoding.
  let   bits  = 0
  let   value = 0
  const bytes = []

  // Decode the input string.
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]
    const index = map.indexOf(c)
    if (index === -1) {
      throw new Error('Invalid character: ' + c)
    }
    bits += 6
    value <<= 6
    value |= index
    if (bits >= 8) {
      bits -= 8
      bytes.push((value >>> bits) & 0xff)
    }
  }

  // Return the decoded bytes as a Uint8Array.
  return new Uint8Array(bytes)
}

export const Base64 = {
  encode : b64encode,
  decode : b64decode
}

export const B64URL = {
  encode : (data : string | Uint8Array) => b64encode(data, true, false),
  decode : (data : string) => b64decode(data, true)
}
