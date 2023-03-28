import { Test } from 'tape'
import { Buff } from '../../../../../src/index.js'

export default function (t : Test, f : typeof Buff) {
  const source = f.random()
  const binary = f.raw(source).bin
  const target = f.bin(binary)

  t.plan(1)
  t.deepEqual(target.hex, source.hex)
}

