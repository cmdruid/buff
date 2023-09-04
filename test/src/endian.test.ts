import { Test } from 'tape'
import { Buff, buffer } from '../../src/index.js'

const number = 4294901760
const bigint = BigInt(number)
const hex_be = 'ffff0000'
const hex_le = '0000ffff'
const raw_be = new Uint8Array([ 255, 255, 0, 0 ])
const raw_le = new Uint8Array([ 0, 0, 255, 255 ])

export default function endian_test(t : Test) {

  t.test('Endianess test.', t => {

    const num_be_to_raw = buffer(number, 4, 'be').raw
    const num_le_to_raw = buffer(number, 4, 'le').raw

    const big_be_to_raw = buffer(bigint, 4, 'be').raw
    const big_le_to_raw = buffer(bigint, 4, 'le').raw

    const hex_be_to_raw = buffer(hex_be).raw
    const hex_le_to_raw = buffer(hex_le).raw

    const raw_be_to_num = Buff.raw(raw_be).to_num('be')
    const raw_le_to_num = Buff.raw(raw_le).to_num('le')

    const raw_be_to_big = Buff.raw(raw_be).to_big('be')
    const raw_le_to_big = Buff.raw(raw_le).to_big('le')

    const raw_be_to_hex = Buff.raw(raw_be).hex
    const raw_le_to_hex = Buff.raw(raw_le).hex

    t.plan(12)

    t.deepEqual(num_be_to_raw, raw_be, 'num_be_to_raw should match target.')
    t.deepEqual(num_le_to_raw, raw_le, 'num_le_to_raw should match target.')

    t.deepEqual(big_be_to_raw, raw_be, 'big_be_to_raw should match target.')
    t.deepEqual(big_le_to_raw, raw_le, 'big_le_to_raw should match target.')

    t.deepEqual(hex_be_to_raw, raw_be, 'hex_be_to_raw should match target.')
    t.deepEqual(hex_le_to_raw, raw_le, 'hex_le_to_raw should match target.')

    t.equal(raw_be_to_num, number, 'raw_be_to_num should match target.')
    t.equal(raw_le_to_num, number, 'raw_le_to_num should match target.')

    t.equal(raw_be_to_big, bigint, 'raw_be_to_big should match target.')
    t.equal(raw_le_to_big, bigint, 'raw_le_to_big should match target.')

    t.equal(raw_be_to_hex, hex_be, 'raw_be_to_hex should match target.')
    t.equal(raw_le_to_hex, hex_le, 'raw_le_to_hex should match target.')
  })
}
