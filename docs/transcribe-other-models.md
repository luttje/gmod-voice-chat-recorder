# 👄 Transcription: Other models

## Transducer models

These models are generally pretty fast and can be used for real-time transcription. Their accuracy can be great if your users speak clearly.

There are more transducer models available like Chinese and Cantonese, [check out the sherpa onnx documentation for those](https://k2-fsa.github.io/sherpa/onnx/pretrained_models/offline-transducer/index.html).

### GigaSpeech model

1. Download the model **`sherpa-onnx-zipformer-gigaspeech-2023-12-12` (English):**

    ```bash
    wget https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-gigaspeech-2023-12-12.tar.bz2
    tar xf sherpa-onnx-zipformer-gigaspeech-2023-12-12.tar.bz2
    ls -lh sherpa-onnx-zipformer-gigaspeech-2023-12-12
    ```

2. Run the server with `npm run start:transcribe -- --model gigaspeech`

### OpenAI Whisper

These models can be a lot more accurate than the transducer models, at the cost of being a lot slower (on CPU). They are best used for post-processing, not real-time transcription.

I've not tested them on GPU, but they should be a lot faster there.

#### English (Tiny)

1. Download the model **`csukuangfj/sherpa-onnx-whisper-tiny.en` from huggingface:**

    ```bash
    GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/csukuangfj/sherpa-onnx-whisper-tiny.en
    cd sherpa-onnx-whisper-tiny.en
    git lfs pull --include "*.onnx"
    ```

2. Run the server with `npm run start:transcribe -- --model whisper-tiny-en`

#### English Distil (Small)

1. Download the model **`csukuangfj/sherpa-onnx-whisper-distil-small.en` from huggingface:**

    ```bash
    GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/csukuangfj/sherpa-onnx-whisper-distil-small.en
    cd sherpa-onnx-whisper-distil-small.en
    git lfs pull --include "*.onnx"
    ```

2. Run the server with `npm run start:transcribe -- --model whisper-distil-small-en`

#### Multilingual (Medium)

This model supports multiple languages, but is quite heavy. You'll want to run it on a CUDA-enabled GPU.

1. Download the model **`csukuangfj/sherpa-onnx-whisper-medium` from huggingface:**

    ```bash
    GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/csukuangfj/sherpa-onnx-whisper-medium
    cd sherpa-onnx-whisper-medium
    git lfs pull --include "*.onnx"
    ```

2. Run the server with `npm run start:transcribe -- --model whisper-medium`
