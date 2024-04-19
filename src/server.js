const { processAndSavePackets } = require('./packet-processor')
const { transcribe } = require('./transcribe')
const dgram = require('dgram')
const fs = require('fs')

const shouldTranscribe = process.argv.includes('--transcribe')
const modelArgIndex = process.argv.indexOf('--model')
let model = 'en'

if (modelArgIndex !== -1) {
  model = process.argv[modelArgIndex + 1]
}

const outputDirectoryNotTranscribed = 'recordings/untranscribed/'
const outputDirectoryTranscribed = 'recordings/transcribed/'
const outputDirectoryTranscriptions = 'recordings/transcriptions/'

const server = dgram.createSocket('udp4')

server.on('error', (err) => {
  console.error(`Server error:\n${err.stack}`)
  server.close()
})

server.on('message', (msg, remoteInfo) => {
  console.log(`Received: ${msg.length} bytes from ${remoteInfo.address}:${remoteInfo.port}`)

  try {
    processAndSavePackets(msg, outputDirectoryNotTranscribed, function (wavFileName) {
      if (shouldTranscribe) {
        const notTranscribedFilePath = `${outputDirectoryNotTranscribed}/${wavFileName}`

        transcribe(notTranscribedFilePath, model).then((text) => {
          const transcriptionFileName = `${outputDirectoryTranscriptions}/${wavFileName}.log`

          fs.appendFileSync(transcriptionFileName, `${text}\n`)

          fs.renameSync(notTranscribedFilePath, `${outputDirectoryTranscribed}/${wavFileName}`)
        })
      }
    })


    console.log(`Processed and saved packets from ${remoteInfo.address}:${remoteInfo.port}`)
  } catch (error) {
    console.error(`Error processing packet from ${remoteInfo.address}:${remoteInfo.port}:`, error)
  }
})

server.on('listening', () => {
  const { address, port } = server.address()

  console.log(`UDP socket listening at ${address}:${port}`)
})

const PORT = process.env.PORT || 4000
server.bind(PORT)
