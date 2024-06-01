const { createRecognizer } = require('./sherpa')
const { Readable } = require('stream')
const { Reader: WavReader } = require('wav')
const fs = require('fs')

// Based on: https://github.com/k2-fsa/sherpa-onnx/blob/2e0ee0e8c862ecccba11cba893289b090caf1915/nodejs-examples/test-offline-transducer.js
function transcribe(wavFileName, model) {
  const recognizer = createRecognizer(model)
  const stream = recognizer.createStream()
  const reader = new WavReader()
  const readable = new Readable().wrap(reader)
  const buffer = []

  reader.on('format', ({ audioFormat, bitDepth, channels, sampleRate }) => {
    if (sampleRate != recognizer.config.featConfig.sampleRate) {
      throw new Error(`Only support sampleRate ${recognizer.config.featConfig.sampleRate}. Given ${sampleRate}`)
    }

    if (audioFormat != 1) {
      throw new Error(`Only support PCM format. Given ${audioFormat}`)
    }

    if (channels != 1) {
      throw new Error(`Only a single channel. Given ${channel}`)
    }

    if (bitDepth != 16) {
      throw new Error(`Only support 16-bit samples. Given ${bitDepth}`)
    }
  })

  readable.on('readable', function () {
    let chunk

    while ((chunk = readable.read()) != null) {
      const int16Samples = new Int16Array(
        chunk.buffer, chunk.byteOffset,
        chunk.length / Int16Array.BYTES_PER_ELEMENT)

      const floatSamples = new Float32Array(int16Samples.length)

      for (let i = 0; i < floatSamples.length; i++) {
        floatSamples[i] = int16Samples[i] / 32768.0
      }

      buffer.push(floatSamples)
    }
  })

  return new Promise((resolve, reject) => {
    fs.createReadStream(wavFileName, { 'highWaterMark': 4096 })
      .pipe(reader)
      .on('finish', function (err) {
        // tail padding
        const floatSamples =
          new Float32Array(recognizer.config.featConfig.sampleRate * 0.5)

        buffer.push(floatSamples)
        const flattened =
          Float32Array.from(buffer.reduce((a, b) => [...a, ...b], []))

        stream.acceptWaveform(recognizer.config.featConfig.sampleRate, flattened)

        recognizer.decode(stream)

        try {
          const result = recognizer.getResult(stream)
          const text = result.text
          resolve(text)
        } catch (error) {
          reject(error)
        } finally {
          stream.free()
          recognizer.free()
        }
      })
    })
}

module.exports = {
  transcribe
}
