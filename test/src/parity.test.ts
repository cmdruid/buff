import { Test } from 'tape'
import { Buff } from '../../src/index.js'

import { concatBytes } from '@noble/hashes/utils'

import {
  bytesToHex,
  hexToBytes,
  bytesToNumberBE,
  bytesToNumberLE,
  numberToBytesBE,
  numberToBytesLE
} from '@noble/curves/abstract/utils'

function getRandom(size = 0x80FFFFFF) {
  return Math.floor(Math.random() * size)
}

export default function parity_test (t : Test) {

  const tnum = getRandom(),
        tbig = BigInt(tnum),
        thex = tnum.toString(16).padStart(8, '0')

  t.test('Testing conversion between buff and noble library.', t => {
    // Number to bytes LE conversion.
    const buff_num_to_bytes_le = Buff.num(tnum, 4, 'le').raw
    const nobl_num_to_bytes_le = numberToBytesLE(tnum, 4)
    // Number to bytes BE conversion.
    const buff_num_to_bytes_be = Buff.num(tnum, 4, 'be').raw
    const nobl_num_to_bytes_be = numberToBytesBE(tnum, 4)
    // Bigint to bytes LE conversion.
    const buff_big_to_bytes_le = Buff.big(tbig, 4, 'le').raw
    const nobl_big_to_bytes_le = numberToBytesLE(tbig, 4)
    // Bigint to bytes BE conversion.
    const buff_big_to_bytes_be = Buff.big(tbig, 4, 'be').raw
    const nobl_big_to_bytes_be = numberToBytesBE(tbig, 4)
    // Hex to bytes conversion.
    const buff_hex_to_bytes    = Buff.hex(thex).raw
    const nobl_hex_to_bytes    = hexToBytes(thex)
    // Bytes to number LE conversion.
    const buff_bytes_to_num_le = Buff.raw(buff_num_to_bytes_le).toNum('le')
    const nobl_bytes_to_num_le = Number(bytesToNumberLE(nobl_num_to_bytes_le))
    // Bytes to number BE conversion.
    const buff_bytes_to_num_be = Buff.raw(buff_num_to_bytes_be).toNum('be')
    const nobl_bytes_to_num_be = Number(bytesToNumberBE(nobl_num_to_bytes_be))
    // Bytes to bigint LE conversion.
    const buff_bytes_to_big_le = Buff.raw(buff_big_to_bytes_le).toBig('le')
    const nobl_bytes_to_big_le = bytesToNumberLE(nobl_big_to_bytes_le)
    // Bytes to bigint BE conversion.
    const buff_bytes_to_big_be = Buff.raw(buff_big_to_bytes_be).toBig('be')
    const nobl_bytes_to_big_be = bytesToNumberBE(nobl_big_to_bytes_be)
    // Bytes to hex conversion.
    const buff_bytes_to_hex    = Buff.raw(buff_hex_to_bytes).toHex()
    const nobl_bytes_to_hex    = bytesToHex(nobl_hex_to_bytes)

    const buff_concat = Buff.join([
      buff_num_to_bytes_be,
      buff_big_to_bytes_be,
      buff_hex_to_bytes
    ]).raw

    const nobl_concat = concatBytes(
      nobl_num_to_bytes_be,
      nobl_big_to_bytes_be,
      nobl_hex_to_bytes
    )

    t.plan(14)
    t.deepEqual(buff_num_to_bytes_le, nobl_num_to_bytes_le, 'num_le array should be equal.')
    t.deepEqual(buff_num_to_bytes_be, nobl_num_to_bytes_be, 'num_be array should be equal.')
    t.deepEqual(buff_big_to_bytes_le, nobl_big_to_bytes_le, 'big_le array should be equal.')
    t.deepEqual(buff_big_to_bytes_be, nobl_big_to_bytes_be, 'big_be array should be equal.')
    t.deepEqual(buff_hex_to_bytes, nobl_hex_to_bytes, 'hex array should be equal.')
    t.equal(buff_bytes_to_num_le, nobl_bytes_to_num_le, 'num_le number should be equal.')
    t.equal(buff_bytes_to_num_be, nobl_bytes_to_num_be, 'num_be number should be equal.')
    t.equal(buff_bytes_to_big_le, nobl_bytes_to_big_le, 'big_le number should be equal.')
    t.equal(buff_bytes_to_big_be, nobl_bytes_to_big_be, 'big_be number should be equal.')
    t.equal(buff_bytes_to_hex, nobl_bytes_to_hex, 'hex string should be equal.')
    t.equal(buff_bytes_to_num_le, tnum, 'num_le number should match target.')
    t.equal(buff_bytes_to_big_le, tbig, 'big_le number should match target.')
    t.equal(buff_bytes_to_hex, thex, 'hex string should match target.')
    t.deepEqual(buff_concat, nobl_concat, 'Both concatenated arrays should be equal.')
  })
}
