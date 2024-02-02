import { Readable } from 'stream'

export const streamStringifier = async (stream: Readable): Promise<string> => {
    return new Promise((resolve, reject) => {
      const buffer: Buffer[] = []
      stream.on('data', (chunk) => buffer.push(chunk))
      stream.on('end', () => resolve(buffer.join('')))
      stream.on('error', (error) => reject(error))
    })
}