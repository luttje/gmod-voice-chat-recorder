const sherpa_onnx = require('sherpa-onnx')

// Checkout https://k2-fsa.github.io/sherpa/onnx/pretrained_models/offline-transducer/index.html for more models
const transducerModels = {
  en: {
    transducer: {
      encoder:
        `./sherpa-onnx-zipformer-en-2023-06-26/encoder-epoch-99-avg-1.int8.onnx`,
      decoder:
        `./sherpa-onnx-zipformer-en-2023-06-26/decoder-epoch-99-avg-1.onnx`,
      joiner:
        `./sherpa-onnx-zipformer-en-2023-06-26/joiner-epoch-99-avg-1.int8.onnx`,
    },
    tokens: `./sherpa-onnx-zipformer-en-2023-06-26/tokens.txt`,
  },

  gigaspeech: {
    transducer: {
      encoder:
        `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/encoder-epoch-30-avg-1.int8.onnx`,
      decoder:
        `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/decoder-epoch-30-avg-1.onnx`,
      joiner:
        `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/joiner-epoch-30-avg-1.int8.onnx`,
    },
    tokens: `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/tokens.txt`,
  },
}

// Based on: https://github.com/k2-fsa/sherpa-onnx/blob/2e0ee0e8c862ecccba11cba893289b090caf1915/nodejs-examples/test-offline-transducer.js
function createOfflineRecognizer(model) {
  const transducerModel = transducerModels[model]
  const featConfig = {
    sampleRate: 24000,
    featureDim: 80,
  }

  const modelConfig = {
    ...transducerModel,
    paraformer: {
      model: '',
    },
    nemoCtc: {
      model: '',
    },
    whisper: {
      encoder: '',
      decoder: '',
      language: '',
      task: '',
    },
    tdnn: {
      model: '',
    },
    numThreads: 1,
    debug: 0,
    provider: 'cpu',
    modelType: 'transducer',
  }

  const lmConfig = {
    model: '',
    scale: 1.0,
  }

  const config = {
    featConfig: featConfig,
    modelConfig: modelConfig,
    lmConfig: lmConfig,
    decodingMethod: 'greedy_search',
    maxActivePaths: 4,
    hotwordsFile: '',
    hotwordsScore: 1.5,
  }

  return sherpa_onnx.createOfflineRecognizer(config)
}

module.exports = {
  createOfflineRecognizer
}
