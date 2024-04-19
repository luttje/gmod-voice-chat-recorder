# 🎤 Garry's Mod Voice Chat Recorder

This project is a demonstrates how to save Voice Chat audio on a Garry's Mod Server to `.wav` files. It uses [the awesome `gm_8bit` module](https://github.com/Meachamp/gm_8bit). This code or project might be useful for the purpose of moderating your game server.

## 🚀 Getting Started

1. Ensure you have [Node.js](https://nodejs.org/en/) installed.

2. Clone (or download) this repository.

3. Open a terminal (or command prompt) in the repository directory.

4. Run `npm install` in the repository directory.

5. Run `npm run start` in the repository directory.

6. Install `gm_8bit` by:

    1. Going to the [`gm_8bit` GitHub Actions](https://github.com/Meachamp/gm_8bit/actions)

    2. Clicking the latest workflow run that has a green checkmark.

    3. Scroll all the way down to the `Artifacts` section ([see for example the February 19 workflow artifacts](https://github.com/Meachamp/gm_8bit/actions/runs/7953375251#artifacts)).

    4. Download the `gmsv_eightbit_win64.dll` file if you're on Windows, or the `gmsv_eightbit_linux64.dll` file if you're on Linux (or choose the non-64-bit version if you're not running the server on a 64-bit system).

    5. Place the downloaded file in the `garrysmod/lua/bin` directory of your Garry's Mod server.

7. Start your Garry's Mod server, for example:

    ```bash
    srcds -console -game garrysmod +maxplayers 20 +gamemode sandbox +map gm_construct
    ```

8. In the console run:

    1. `lua_run require("eightbit")` to load the module.

    2. `lua_run eightbit.EnableBroadcast(true)` to have eightbit broadcast voice data to the Node.js server.

9. Join your server, don't forget to plug in a microphone, then start voice chatting.

10. You'll see debug output marking how many bytes were received:

    ```bash
    $ node .
    UDP socket listening at 0.0.0.0:4000
    Received: 534 bytes from 127.0.0.1:52909
    Received: 227 bytes from 127.0.0.1:52909
    Received: 277 bytes from 127.0.0.1:52909
    Received: 248 bytes from 127.0.0.1:52909
    Received: 172 bytes from 127.0.0.1:52909
    Received: 244 bytes from 127.0.0.1:52909
    ... etc ...
    ```

11. Each time a player speaks the data is saved to a file like `user_<STEAM_ID_64>_<CURRENT_TIMESTAMP>.wav` in the `recordings/untranscribed` directory.

    New files are created each time the player falls silent.

## 👄 Voice Chat Transcription

This example shows how to use [`sharpa-onnx`](https://github.com/k2-fsa/sherpa-onnx) to transcribe recorded voice chat to text. This uses a pre-trained model which works offline, even on your CPU.

For this basic example we've chosen the fastest English model we've tried, but **other models like OpenAI Whisper are also supported. [&raquo; Read more](./docs/transcribe-other-models.md)**

To get started transcribing voice chat automatically:

1. Download the pre-trained offline transducer model into this repository's directory:

    ```bash
    wget https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-en-2023-06-26.tar.bz2
    tar xvf sherpa-onnx-zipformer-en-2023-06-26.tar.bz2
    ```

2. Run the server with `npm run start:transcribe`

3. When a player speaks, the audio is transcribed to text. You'll find transcribed audio moved to the `recordings/transcribed` directory.

    Transcriptions can be found in `recordings/transcriptions/` where each transcription has the same name as the audio file (except with a `.log` extension).

4. During transcription you might see output like this being repeated in the console:

    ```bash
    YYYY-MM-DD HH:MM:SS.000000 [W:onnxruntime:, graph_utils.cc:139 CanUpdateImplicitInputNameInSubgraphs]  Implicit input name <number> cannot be safely updated to <number> in one of the subgraphs.
    ```

> [!WARNING]
> Note that transcription isn't perfect and will not work well with noisy audio or non-English speakers. In my experience it only works well if you articulate clearly and speak English with a neutral accent.
> Nevertheless, seeing how this is all done on-device (offline) it's still pretty impressive!

## 💡 Further ideas

I intend to use this in some form for moderating voice chat on a Garry's Mod server. Here are some ideas for further development:

- [x] Automatically transcribe the audio to text
- [ ] Use an LLM to detect toxic speech (for in-game text chat too).
- [ ] Flag the audio (or text) chat for review by a moderator.
- [ ] Create a mobile accessible web interface for easily reviewing flagged chats.
- [ ] Perform server actions after a moderator has reviewed the chat (e.g. mute, kick, ban).
