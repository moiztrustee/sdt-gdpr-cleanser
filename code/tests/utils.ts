import { Readable } from 'stream'

const streamStringifier = async (stream: Readable): Promise<string> => new Promise((resolve, reject) => {
  const buffer: Buffer[] = []
  stream.on('data', (chunk) => buffer.push(chunk))
  stream.on('end', () => resolve(buffer.join('')))
  stream.on('error', (error) => reject(error))
})

export default streamStringifier;
