<p align="center">
  <img src="https://i.ibb.co/qYGtt2FK/osu-pilot.png" width="400" alt="osu!pilot logo/banner">
</p>

<div align="center">
  
# 🤖 osu!pilot ✍️

**An osu! bot that plays by reading the map, not the game's memory.**

<p align="center">
    <img src="https://img.shields.io/badge/version-1.1-purple.svg" alt="Bot Version">
    <img src="https://img.shields.io/badge/python-3.8+-blue.svg" alt="Python Version">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/status-stable-brightgreen" alt="Status">
</p>
</div>

> osu!pilot is a smart and unique bot designed to play osu! with realistic, human-like movements. It works externally by reading beatmap files in real-time—just like a human player reads notes on the screen—to offer a truly unique gameplay simulation.

<p align="center">
  <a href="https://go.screenpal.com/player/cTjQqZnIWSm" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Watch Demo-Here-red" alt="Watch osu!pilot Demo Video" width="30%">
  </a>
</p>

---

## 🌐 Website

For more information, live demo, and more detailed feature breakdowns, please visit the official website:

**[Visit the osu!pilot Website](https://wakype.github.io/osu-pilot/)**

---

## 🎮 How to Use

> **⚠️ Important:** Before starting, make sure your in-game keybinds for hitting notes are set to **`A`** and **`S`**. The bot uses these keys to play.

1.  **Launch the Bot**
    - Run the program (`python main.py` or the `.exe`). The bot's overlay will appear on your screen.
    - If it's your first time, a calibration window will pop up. Complete the simple reaction time test. On future launches, you can skip this step.

2.  **Select a Beatmap in osu!**
    - Open osu! and choose any beatmap. When you are at the song selection screen, the bot's overlay will automatically update with the map's information.

3.  **Choose Your Options (Optional)**
    - Before starting the map, you can click the checkboxes on the overlay to enable mods like `HR`, `DT`, `NC`, or the `Flow Aim` movement style.
    - > *Tip: If you can't click the checkboxes, press the `Windows` key to unfocus the osu! window, make your selections, then click back into the game.*

4.  **Sync and Play**
    - Start the beatmap in osu!. As soon as the very first hit circle begins to appear (when its approach circle shows up), press the **`Q`** key.
    - This single keypress synchronizes the bot, and it will immediately take over and start playing.

5.  **Controlling the Bot**
    - To **stop the bot** mid-play, press the **`Esc`** key.
    - To **close the entire program**, press **`Ctrl + Page Down`**.
    - For a complete list of controls, please refer to the **Hotkeys** section.

---

## ⌨️ Hotkeys

A quick reference for all available controls.

| Key Combination    | Action                                                |
| ------------------ | ----------------------------------------------------- |
| `Q`                | Synchronizes and starts the bot when a map begins.    |
| `Esc`              | Immediately stops the bot during gameplay.            |
| `Ctrl + Page Up`   | Toggles the visibility of the GUI overlay.            |
| `Ctrl + Page Down` | Safely shuts down the bot script.                     |

---

## ✨ Key Features

| Feature                 | Description                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Mechanism** | Works by reading `.osu` files. **Does not read game memory or modify files.** |
| **Human-like Aim** | A layered system with curved paths, natural jitter, and an optional "Flow Aim" mode for realistic movement.       |
| **Zero Setup Required** | Auto-detects your Songs folder and saves your calibration. No manual config needed.                           |
| **Mod Support** | Supports HR, DT, and NC, which can be toggled directly from the overlay.                                      |
| **In-Game Overlay** | Shows bot status, map info, and has toggles for mods and aim style. You can also drag it around.             |
| **Hotkey Control** | Start, stop, and hide the overlay with simple hotkeys without leaving the game.                               |

---

## ⚙️ How It Works

The bot operates in a clear, sequential lifecycle:

| State            | Description                                                                                                                                                       |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IDLE** | Waits for you to select a beatmap in osu!. It constantly scans the active window's title.                                                                           |
| **DETECT & PARSE** | Once a beatmap is chosen, the title changes. The bot uses this title to find the exact `.osu` file in your `Songs` folder and parses all its data.                  |
| **ARMED** | The overlay updates with the beatmap info, and the bot is now "armed". It waits for you to press `q` to signal the start of the map. This keypress is crucial for synchronization. |
| **EXECUTE** | After syncing, the bot takes full control. It follows the parsed object data with precise timing, moving the cursor and pressing keys until the song ends or you press `Esc`. |
| **RESET** | Once the map is finished or stopped, the bot returns to the `IDLE` state, ready for the next map.                                                                   |

---

## 🚀 Getting Started (For Dev)

<details>
<summary><strong>Step 1: Prerequisites & Installation</strong></summary>

**Requirements:**
* Python 3.8+
* Windows OS

**Installation Commands:**
1.  Clone this repository:
    ```bash
    git clone https://github.com/Wakype/osu-pilot.git
    cd osu-pilot
    ```
2.  Install the required packages from the `requirements.txt` file:
    ```bash
    pip install -r requirements.txt
    ```
</details>

<details>
<summary><strong>Step 2: Running the Bot</strong></summary>

That's it! There is no manual configuration.

1.  Run the main script from your terminal:
    ```bash
    python main.py
    ```
2.  The **Reaction Time Calibration** will appear on the first launch. Follow the on-screen instructions. On subsequent launches, you can use the "Use Previous" button to skip this.
3.  The bot's overlay will now be visible. You can now launch and play osu!.

</details>

---

## ⚠️ Disclaimer

This project was created for **educational purposes** to explore concepts in automation, real-time file parsing, and human-like algorithm design.

> Using this bot on official osu! servers is a direct violation of the game's terms of service. Doing so **will result in a swift and permanent ban** of your account. The developer assumes no responsibility for any misuse or consequences.

**Use responsibly and at your own risk.**
