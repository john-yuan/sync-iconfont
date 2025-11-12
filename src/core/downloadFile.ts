import fs from 'fs'

export async function downloadFile(url: string, filename: string) {
  return fetch(url).then(async (res) => {
    if (res.ok) {
      const buffer = await res.arrayBuffer()
      return fs.writeFileSync(filename, Buffer.from(buffer))
    } else {
      throw new Error('download failed')
    }
  })
}
