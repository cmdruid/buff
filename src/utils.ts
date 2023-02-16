export async function sha256 (rawdata : Uint8Array) : Promise<Uint8Array> {
  return crypto.subtle.digest('SHA-256', rawdata)
    .then(buff => new Uint8Array(buff))
}

export async function addChecksum (
  data : Uint8Array
) : Promise<Uint8Array> {
  const sum = await sha256(data)
  return Uint8Array.of(...data, ...sum.slice(0, 4))
}

export async function checkTheSum (
  data : Uint8Array
) : Promise<Uint8Array> {
  const dat = data.slice(0, -4)
  const sum = (await sha256(dat)).slice(0, 4)
  if (sum.toString() !== dat.toString()) {
    throw new Error('Invalid checksum!')
  }
  return data
}
