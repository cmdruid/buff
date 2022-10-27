const ec = new TextEncoder()
const dc = new TextDecoder()

export function Buff(t, f) {
  t.plan(6)
  toStr(t, f)
  toHex(t, f)
  toNum(t, f)
  toBig(t, f)
  toBytes(t, f)
  toJson(t, f)
}

function toStr(t, f) {
  console.log('Testing .toStr()')
  const source = ec.encode('hello world')
  const target = dc.decode(source)
  const tested = new f(source).toStr()
  t.equal(target, tested)
}

function toHex(t, f) {
  console.log('Testing .toHex()')
  const source = new Uint8Array(16).fill(0x4F)
  const target = Buffer.from(source).toString('hex')
  const tested = new f(source).toHex()
  t.equal(target, tested)
}

function toNum(t, f) {
  console.log('Testing .toNum()')
  const source = Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1F)
  const target = Number.MAX_SAFE_INTEGER
  const tested = new f(source).toNum()
  t.equal(target, tested)
}

function toBig(t, f) {
  console.log('Testing .toBig()')
  const source = new Uint8Array(32).fill(0xFF)
  const target = 115792089237316195423570985008687907853269984665640564039457584007913129639935n
  const tested = new f(source).toBig()
  t.equal(target, tested)
}

function toBytes(t, f) {
  console.log('Testing .toBytes()')
  const source = 'hello world'
  const target = ec.encode(source)
  const tested = f.str(source).toBytes()
  t.deepEqual(target, tested)
}

function toJson(t, f) {
  console.log('Testing .toStr()')
  const target = { err: null, data: 'testing!' }
  const source = ec.encode(JSON.stringify(target))
  const tested = new f(source).toJson()
  t.deepEqual(target, tested)
}

export function str(t, f) {
  const source = 'hello world'
  const target = ec.encode(source)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}

export function hex(t, f) {
  const source = '0102030405060708090a0b0c0d0e0f'
  const target = Uint8Array.from(Buffer.from(source, 'hex'))
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}

export function num(t, f) {
  const source = Number.MAX_SAFE_INTEGER
  const target = Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1F)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}

export function big(t, f) {
  const source = 115792089237316195423570985008687907853269984665640564039457584007913129639935n
  const target = new Uint8Array(32).fill(0xFF)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}

export function buff(t, f) {
  const source = new ArrayBuffer(16)
  const target = new Uint8Array(source)
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}

export function json(t, f) {
  const source = { err: null, data: 'testing!' }
  const target = new Uint8Array(ec.encode(JSON.stringify(source)))
  const tested = Uint8Array.from(f(source))
  t.plan(1)
  t.deepEqual(target, tested)
}

// export function bech32(t, f) {
//   const source = 'thisisasuperseekritteststring'
//   const target = new Uint8Array(ec.encode(JSON.stringify(source)))
//   const tested = Uint8Array.from(f(source))
//   t.plan(1)
//   t.deepEqual(target, tested)
// }

// export function base58(t, f) {
//   const source = { err: null, data: 'testing!' }
//   const target = new Uint8Array(ec.encode(JSON.stringify(source)))
//   const tested = Uint8Array.from(f(source))
//   t.plan(1)
//   t.deepEqual(target, tested)
// }

// export function base64(t, f) {
//   const source = { err: null, data: 'testing!' }
//   const target = new Uint8Array(ec.encode(JSON.stringify(source)))
//   const tested = Uint8Array.from(f(source))
//   t.plan(1)
//   t.deepEqual(target, tested)
// }