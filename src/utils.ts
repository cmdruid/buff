export async function sha256 (data : Uint8Array) : Promise<Uint8Array> {
  return crypto.subtle.digest('SHA-256', data)
    .then(buff => new Uint8Array(buff))
}

export async function hash256 (data : Uint8Array) : Promise<Uint8Array> {
  return sha256(await sha256(data))
}

export async function addChecksum (
  data : Uint8Array
) : Promise<Uint8Array> {
  const sum = await hash256(data)
  return Uint8Array.of(...data, ...sum.slice(0, 4))
}

export async function checkTheSum (
  data : Uint8Array
) : Promise<Uint8Array> {
  const ret = data.slice(0, -4)
  const chk = data.slice(-4)
  const sum = (await hash256(ret)).slice(0, 4)
  if (sum.toString() !== chk.toString()) {
    throw new Error('Invalid checksum!')
  }
  return ret
}
