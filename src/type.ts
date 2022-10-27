interface TypeChecker {
  undefined : { k : string, v: (x : any) => boolean }
  infinity  : { k : string, v: (x : any) => boolean }
  null      : { k : string, v: (x : any) => boolean }
  hex       : { k : string, v: (x : any) => boolean }
  string    : { k : string, v: (x : any) => boolean }
  bigint    : { k : string, v: (x : any) => boolean }
  number    : { k : string, v: (x : any) => boolean }
  array     : { k : string, v: (x : any) => boolean }
  uint8     : { k : string, v: (x : any) => boolean }
  uint16    : { k : string, v: (x : any) => boolean }
  uint32    : { k : string, v: (x : any) => boolean }
  buffer    : { k : string, v: (x : any) => boolean }
  object    : { k : string, v: (x : any) => boolean }
}

interface ArrayChecker {
  isString : (x : any[]) => boolean
  isNumber : (x : any[]) => boolean
  isBigint : (x : any[]) => boolean
}

export default class Type {
  static is : TypeChecker = {
    undefined : { k: 'undefined', v: x => typeof x === 'undefined' },
    infinity  : { k: 'infinity',  v: x => x === Infinity },
    null   : { k: 'null', v: x => x === null },
    hex    : { k: 'hex',  v: x => isHex(x) },
    string : { k: 'string', v: x => typeof x === 'string' },
    bigint : { k: 'bigint', v: x => typeof x === 'bigint' },
    number : { k: 'number', v: x => typeof x === 'number' },
    array  : { k: 'array',  v: x => Array.isArray(x) },
    uint8  : { k: 'uint8',  v: x => x instanceof Uint8Array },
    uint16 : { k: 'uint16', v: x => x instanceof Uint16Array },
    uint32 : { k: 'uint32', v: x => x instanceof Uint32Array },
    buffer : { k: 'buffer', v: x => x instanceof ArrayBuffer },
    object : { k: 'object', v: x => typeof x === 'object' }
  }

  static array : ArrayChecker = {
    isString: x => x.every((e : any) => Type.is.string.v(e)),
    isNumber: x => x.every((e : any) => Type.is.number.v(e)),
    isBigint: x => x.every((e : any) => Type.is.bigint.v(e))
  }

  static of(x : any) {
    for (const [k,v] of Object.entries(Type.is)) {
      if (v(x)) {
        return k
      }
    }
    return 'unknown'
  }
}

function isHex(str : string) {
  switch (true) {
    case (typeof str !== 'string'):
      return false
    case (/[^0-9a-fA-F]/.test(str)):
      return false
    case (str.length % 2 !== 0):
      return false
    default:
      return true
  }
}
