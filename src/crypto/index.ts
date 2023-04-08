import { PRNG } from './prng.js'

export interface Crypto {
  getRandomValues : <T extends ArrayBufferView | null> (array : T) => T
  subtle : {
    digest : (algorithm : AlgorithmIdentifier, data : BufferSource) => Promise<ArrayBuffer>
  } | undefined
}

export const webcrypto = (typeof crypto !== 'undefined')
  ? crypto
  : (typeof globalThis?.crypto !== 'undefined')
    ? globalThis.crypto
    : (typeof window !== 'undefined')
      ? window.crypto
      : {
          getRandomValues : PRNG.getRandomValues,
          subtle          : undefined
        }

// console.log('Report on webcrypto environment:')
// console.log('crypto:', typeof crypto)
// console.log('globalThis.crypto:', typeof globalThis?.crypto)
// console.log('window.crypto:', typeof window)
