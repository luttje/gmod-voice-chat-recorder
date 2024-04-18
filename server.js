const dgram = require('dgram')
const { OpusEncoder } = require('@discordjs/opus')
const fs = require('fs')
const { Writer: WavWriter } = require('wav')

const server = dgram.createSocket('udp4')
const encoders = {}

// Utility function to get a new Opus encoder instance
const getEncoder = () => new OpusEncoder(24000, 1)

// Generates a unique WAV filename based on user ID
const getUniqueFilename = (id64, ext = 'wav') => `user_${id64}_${Date.now()}.${ext}`

// Decodes Opus frames and handles lost frames
const decodeOpusFrames = (buf, encoderState, id64) => {
  let readPos = 0
  let frames = []

  while (readPos < buf.length - 4) {
    const len = buf.readUInt16LE(readPos)
    readPos += 2
    const seq = buf.readUInt16LE(readPos)
    readPos += 2

    if (!encoderState.seq || seq < encoderState.seq) {
      encoderState.encoder = getEncoder()
      encoderState.seq = seq
    } else if (encoderState.seq !== seq) {
      let lostFrames = seq - encoderState.seq
      for (let i = 0; i < lostFrames; i++) {
        frames.push(encoderState.encoder.decodePacketloss())
      }
      encoderState.seq = seq
    }

    encoderState.seq++

    if (len <= 0 || seq < 0 || readPos + len > buf.length) {
      console.error(`Invalid packet LEN: ${len}, SEQ: ${seq}`)
      return
    }

    const data = buf.slice(readPos, readPos + len)
    readPos += len

    const decodedFrame = encoderState.encoder.decode(data)
    frames.push(decodedFrame)
  }

  const decompressedData = Buffer.concat(frames)
  encoderState.stream.push(decompressedData)
}

const OP_CODES = {
  OP_CODEC_OPUSPLC: 6,
  OP_SAMPLERATE: 11,
  OP_SILENCE: 0
}

// Processes incoming packets and saves them to a WAV file
const processAndSavePackets = (buf) => {
  let readPos = 0
  const id64 = buf.readBigInt64LE(readPos)
  readPos += 8

  if (!encoders[id64]) {
    const wavFilename = getUniqueFilename(id64)
    const wavFileStream = fs.createWriteStream(wavFilename)
    const wavWriter = new WavWriter({ sampleRate: 24000, channels: 1, bitDepth: 16 })

    wavWriter.pipe(wavFileStream)

    encoders[id64] = {
      encoder: getEncoder(),
      stream: wavWriter,
    }
  }

  encoders[id64].time = Date.now() / 1000

  const maxRead = buf.length - 4

  while (readPos < maxRead - 1) {
    let opCode = buf.readUInt8(readPos)
    readPos++

    switch (opCode) {
      case OP_CODES.OP_SAMPLERATE:
        let sampleRate = buf.readUInt16LE(readPos)

        readPos += 2

        break
      case OP_CODES.OP_SILENCE:
        let samples = buf.readUInt16LE(readPos)

        readPos += 2

        encoders[id64].stream.push(Buffer.alloc(samples * 2))

        // Close the current file after they fall silent
        encoders[id64] = null

        break
      case OP_CODES.OP_CODEC_OPUSPLC:
        let dataLen = buf.readUInt16LE(readPos)

        readPos += 2

        decodeOpusFrames(buf.slice(readPos, readPos + dataLen), encoders[id64], id64)

        readPos += dataLen

        break
      default:
        console.error(`Unhandled opcode ${opCode}`)
        fs.writeFileSync(getUniqueFilename(id64, 'bin'), buf)
        break
    }
  }
}

server.on('error', (err) => {
  console.error(`Server error:\n${err.stack}`)
  server.close()
})

server.on('message', (msg, rinfo) => {
  console.log(`Received: ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`)
  try {
    processAndSavePackets(msg)
  } catch (error) {
    console.error(`Error processing packet from ${rinfo.address}:${rinfo.port}:`, error)
  }
})

server.on('listening', () => {
  const { address, port } = server.address()
  console.log(`UDP socket listening at ${address}:${port}`)
})

const PORT = process.env.PORT || 4000
server.bind(PORT)
