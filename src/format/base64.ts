interface Base64API {
  encode : Function,
  decode : Function,
}

const Base64 : Base64API = {
  encode,
  decode
}

function encode(str : string) {
  if (typeof window !== 'undefined') {
    return btoa(str)
  }
  return Buffer.from(str).toString('base64')
}

function decode(str : string) {
  if (typeof window !== 'undefined') {
    return atob(str)
  }
  return Buffer.from(str, 'base64').toString('utf8')
}

export default Base64