const sherpa_onnx = require('sherpa-onnx')

const noTransducer = {
  transducer: {
    encoder: '',
    decoder: '',
    joiner: '',
  },
}

const noParaformer = {
  paraformer: {
    model: '',
  },
}

const noNemoCtc = {
  nemoCtc: {
    model: '',
  },
}

const noWhisper = {
  whisper: {
    encoder: '',
    decoder: '',
    language: '',
    task: '',
  },
}

const noTdnn = {
  tdnn: {
    model: '',
  },
}

// Check out https://k2-fsa.github.io/sherpa/onnx/pretrained_models/offline-transducer/index.html for more models
// For available provider types see: https://github.com/k2-fsa/sherpa-onnx/blob/2e0ee0e8c862ecccba11cba893289b090caf1915/sherpa-onnx/csrc/provider.cc#L14-L31
const models = {
  en: {
    modelType: 'transducer',
    transducer: {
      encoder:
        `./sherpa-onnx-zipformer-en-2023-06-26/encoder-epoch-99-avg-1.int8.onnx`,
      decoder:
        `./sherpa-onnx-zipformer-en-2023-06-26/decoder-epoch-99-avg-1.onnx`,
      joiner:
        `./sherpa-onnx-zipformer-en-2023-06-26/joiner-epoch-99-avg-1.int8.onnx`,
    },
    tokens: `./sherpa-onnx-zipformer-en-2023-06-26/tokens.txt`,
    provider: 'cpu',
    numThreads: 1,
    debug: 0,
    ...noParaformer,
    ...noNemoCtc,
    ...noWhisper,
    ...noTdnn,
  },

  // These online models don't seem to work with our current setup (and I can't get them to work atm)
  // fr: {
  //   isOnline: true,
  //   modelType: 'zipformer',
  //   transducer: {
  //     encoder:
  //       `./sherpa-onnx-streaming-zipformer-fr-2023-04-14/encoder-epoch-29-avg-9-with-averaged-model.int8.onnx`,
  //     decoder:
  //       `./sherpa-onnx-streaming-zipformer-fr-2023-04-14/decoder-epoch-29-avg-9-with-averaged-model.onnx`,
  //     joiner:
  //       `./sherpa-onnx-streaming-zipformer-fr-2023-04-14/joiner-epoch-29-avg-9-with-averaged-model.int8.onnx`,
  //   },
  //   tokens:
  //       './sherpa-onnx-streaming-zipformer-fr-2023-04-14/tokens.txt',
  //   numThreads: 1,
  //   provider: 'cpu',
  //   debug: 1,
  //   paraformer: {
  //     encoder: '',
  //     decoder: '',
  //   },
  //   zipformer2Ctc: {
  //     model: '',
  //   },
  // },

  // 'zh-en': {
  //   isOnline: true,
  //   modelType: 'zipformer',
  //   transducer: {
  //     encoder:
  //       `./sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/encoder-epoch-99-avg-1.int8.onnx`,
  //     decoder:
  //       `./sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/decoder-epoch-99-avg-1.onnx`,
  //     joiner:
  //       `./sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/joiner-epoch-99-avg-1.int8.onnx`,
  //   },
  //   tokens: `./sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/tokens.txt`,
  //   provider: 'cpu',
  //   numThreads: 1,
  //   debug: 0,
  //   paraformer: {
  //     encoder: '',
  //     decoder: '',
  //   },
  //   zipformer2Ctc: {
  //     model: '',
  //   },
  // },

  gigaspeech: {
    modelType: 'transducer',
    transducer: {
      encoder:
        `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/encoder-epoch-30-avg-1.int8.onnx`,
      decoder:
        `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/decoder-epoch-30-avg-1.onnx`,
      joiner:
        `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/joiner-epoch-30-avg-1.int8.onnx`,
    },
    tokens: `./sherpa-onnx-zipformer-gigaspeech-2023-12-12/tokens.txt`,
    provider: 'cpu',
    numThreads: 1,
    debug: 0,
    ...noParaformer,
    ...noNemoCtc,
    ...noWhisper,
    ...noTdnn,
  },

  'whisper-tiny-en': {
    modelType: 'whisper',
    whisper: {
      encoder: './sherpa-onnx-whisper-tiny.en/tiny.en-encoder.int8.onnx',
      decoder: './sherpa-onnx-whisper-tiny.en/tiny.en-decoder.int8.onnx',
      language: '',
      task: 'transcribe',
    },
    tokens: `./sherpa-onnx-whisper-tiny.en/tiny.en-tokens.txt`,
    provider: 'cpu',
    numThreads: 1,
    debug: 0,
    ...noTransducer,
    ...noParaformer,
    ...noNemoCtc,
    ...noTdnn,
  },

  'whisper-distil-small-en': {
    modelType: 'whisper',
    whisper: {
      encoder: './sherpa-onnx-whisper-distil-small.en/distil-small.en-encoder.int8.onnx',
      decoder: './sherpa-onnx-whisper-distil-small.en/distil-small.en-decoder.int8.onnx',
      language: '',
      task: 'transcribe',
    },
    tokens: `./sherpa-onnx-whisper-distil-small.en/distil-small.en-tokens.txt`,
    provider: 'cpu',
    numThreads: 1,
    debug: 0,
    ...noTransducer,
    ...noParaformer,
    ...noNemoCtc,
    ...noTdnn,
  },


  'whisper-medium': {
    modelType: 'whisper',
    whisper: {
      encoder: './sherpa-onnx-whisper-medium/medium-encoder.int8.onnx',
      decoder: './sherpa-onnx-whisper-medium/medium-decoder.int8.onnx',
      language: '',
      task: 'transcribe',
    },
    tokens: `./sherpa-onnx-whisper-medium/medium-tokens.txt`,
    provider: 'cuda', // won't work on 'cpu'
    numThreads: 1,
    debug: 0,
    ...noTransducer,
    ...noParaformer,
    ...noNemoCtc,
    ...noTdnn,
  },
}

// Based on: https://github.com/k2-fsa/sherpa-onnx/blob/2e0ee0e8c862ecccba11cba893289b090caf1915/nodejs-examples/test-offline-transducer.js
function createRecognizer(model) {
  const modelConfig = models[model]
  const featConfig = {
    sampleRate: 24000,
    featureDim: 80,
  }

  const lmConfig = {
    model: '',
    scale: 1.0,
  }

  const isOnline = modelConfig.isOnline || false

  if (isOnline) {
    const config = {
      featConfig: featConfig,
      modelConfig: {
        ...modelConfig,
      },
      decodingMethod: 'greedy_search',
      maxActivePaths: 4,
      enableEndpoint: 1,
      rule1MinTrailingSilence: 2.4,
      rule2MinTrailingSilence: 1.2,
      rule3MinUtteranceLength: 20,
      hotwordsFile: '',
      hotwordsScore: 1.5,
      ctcFstDecoderConfig: {
        graph: '',
        maxActive: 3000,
      }
    }

    // not for sherpa, used by us to determine if online or offline by us
    delete config.modelConfig.isOnline

    return sherpa_onnx.createOnlineRecognizer(config)
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
  createRecognizer
}
