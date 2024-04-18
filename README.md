# 🎤 Garry's Mod Voice Chat Recorder

This project is a demonstrates how to save Voice Chat audio on a Garry's Mod Server to `.wav` files. It uses [the awesome `gm_8bit` module](https://github.com/Meachamp/gm_8bit). This code or project might be useful for the purpose of moderating your game server.

## 🚀 Getting Started

1. Ensure you have [Node.js](https://nodejs.org/en/) installed.

2. Clone (or download) this repository.

3. Open a terminal (or command prompt) in the repository directory.

4. Run `npm install` in the repository directory.

5. Run `node .` in the repository directory.

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

9. Start the Node.js server by running `node .` in this repository directory.

10. Join your server, don't forget to plug in a microphone, then start voice chatting.

11. You'll see debug output marking how many bytes were received:

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

12. Each time a player speaks the data is saved to a file like `user_<STEAM_ID_64>_<CURRENT_TIMESTAMP>.wav` in this repository's directory.

    New files are created each time the player falls silent.

## 💡 Further ideas

I intend to use this in some form for moderating voice chat on a Garry's Mod server. Here are some ideas for further development:

- [ ] Automatically transcribe the audio to text.
- [ ] Use an LLM to detect toxic speech (for in-game text chat too).
- [ ] Flag the audio (or text) chat for review by a moderator.
- [ ] Create a mobile accessible web interface for easily reviewing flagged chats.
- [ ] Perform server actions after a moderator has reviewed the chat (e.g. mute, kick, ban).
