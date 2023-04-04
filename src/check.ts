interface TypeChecker {
  undefined : (x : any) => boolean
  infinity  : (x : any) => boolean
  null      : (x : any) => boolean
  hex       : (x : any) => boolean
  string    : (x : any) => boolean
  bigint    : (x : any) => boolean
  number    : (x : any) => boolean
  array     : (x : any) => boolean
  uint8     : (x : any) => boolean
  uint16    : (x : any) => boolean
  uint32    : (x : any) => boolean
  buffer    : (x : any) => boolean
  class     : (x : any) => boolean
  function  : (x : any) => boolean
  object    : (x : any) => boolean
}

interface ArrayChecker {
  isString : (x : any[]) => boolean
  isNumber : (x : any[]) => boolean
  isBigint : (x : any[]) => boolean
}

// interface TypeConfig {
//   value  ?: any
//   label  ?: string
//   negate ?: boolean
//   throws ?: boolean
// }

// function exception (
//   value : any,
//   label : string,
//   negate = false
// ) : void {
//   const not = (negate) ? '' : 'not'
//   throw new TypeError(`Value is ${not} ${label}: ${String(value)}`)
// }

// function isUndefined<T> (value : T, throws = false) : value is Extract<T, undefined> {
//   const result = typeof value === 'undefined'
//   if (throws && !result) exception(value, 'undefined')
//   return result
// }

// function notUndefined<T> (value : T, throws = false) : value is Exclude<T, undefined> {
//   const result = typeof value !== 'undefined'
//   if (throws && !result) exception(value, 'undefined', true)
//   return result
// }

// function isType <T, U> (
//   value  : T,
//   symbol : U,
//   config : TypeConfig = {}
// ) : value is Extract<T, U> {
//   const {
//     label  = typeof symbol,
//     negate = false,
//     throws = false
//   } = config

//   let result = (value as any === symbol)
//   if (negate) result = !result
//   if (throws && !result) {
//     const not = (negate) ? 'not' : ''
//     throw new TypeError(`Value is ${not} ${label}: ${String(value)}`)
//   }
//   return result
// }

// function notType <T, U> (
//   value  : T,
//   symbol : U,
//   config : TypeConfig = {}
// ) : value is Exclude<T, U> {
//   return isType(value, symbol, { ...config, negate: true })
// }

const is : TypeChecker = {
    null      : x => x === null,
    undefined : x => typeof x === 'undefined',
    hex       : x => isHex(x),
    string    : x => typeof x === 'string',
    infinity  : x => x === Infinity,
    bigint    : x => typeof x === 'bigint',
    number    : x => typeof x === 'number',
    class     : x => (
      typeof x?.prototype === 'object' &&
      x.toString().startsWith('class')
    ),
    function : x => typeof x === 'function',
    uint8    : x => x instanceof Uint8Array,
    uint16   : x => x instanceof Uint16Array,
    uint32   : x => x instanceof Uint32Array,
    buffer   : x => x instanceof ArrayBuffer,
    array    : x => Array.isArray(x),
    object   : x => typeof x === 'object'
  }

const array : ArrayChecker = {
  isString : x => x.every((e : any) => is.string(e)),
  isNumber : x => x.every((e : any) => is.number(e)),
  isBigint : x => x.every((e : any) => is.bigint(e))
}

const type = (x : any) : string => {
  for (const [ k, v ] of Object.entries(is)) {
    if (v(x) === true) {
      return k
    }
  }
  return 'unknown'
}

function isHex (str : string) : boolean {
  switch (true) {
    case (typeof str !== 'string'):
      return false
    case (str.length % 2 !== 0):
      return false
    case (/[^0-9a-fA-F]/.test(str)):
      return false
    default:
      return true
  }
}

export const Check = {
  type,
  array,
  is
  // isType,
  // notType
}
