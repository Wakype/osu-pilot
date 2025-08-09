<p align="center">
  <img src="https://i.ibb.co/qYGtt2FK/osu-pilot.png" width="400" alt="osu!pilot logo/banner">
</p>

<div align="center">
  
# 🤖 osu!pilot ✍️

**An osu! bot that plays by reading the map, not the game's memory.**

<p align="center">
    <img src="https://img.shields.io/badge/version-1.0-red.svg" alt="Bot Version">
    <img src="https://img.shields.io/badge/python-3.8+-blue.svg" alt="Python Version">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/status-stable-brightgreen" alt="Status">
</p>
</div>

> osu!pilot redefines automation by playing the game based on what's visually present, not by hacking into game memory. It reads beatmap files in real-time, just like a human player would read notes, offering a unique gameplay simulation.

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDB6dWw5aGd6dDN6ZGJlYjN0Z3Q1eDBpMnVqZ3I4a2ZqYm02aWJtZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M9gUjQhSldv74g0a2n/giphy.gif" alt="osu!pilot demo" width="100%">
</p>

---

## ✨ Key Features

| Feature                  | Description                                                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Non-Intrusive Engine** | Reads the osu! window title to detect the current beatmap. **No memory reading or process injection.**                                                                          |
| **Full Beatmap Parser**  | Accurately parses `.osu` files to understand hit circles, sliders (all types), spinners, and complex timing points.                                                             |
| **Sleek GUI Overlay**    | A modern overlay that displays bot status, beatmap info, and provides toggles for gameplay mods.                                                                        |
| **Full Mod Support**     | Natively handles **Hard Rock (HR)**, **Double Time (DT)**, and **Nightcore (NC)** by dynamically modifying the beatmap data before execution.                                   |
| **Reaction Calibration** | A calibration tool measures your personal reaction time to ensure the bot's actions are perfectly synchronized with on-screen events.                                   |
| **Humanized Movement**   | Implements easing functions and randomized fluctuations for smoother, less robotic cursor paths and spinning motions.                                                           |
| **Full Hotkey Control**  | Manage the bot without ever leaving the game window. Start, stop, and toggle the overlay with simple hotkeys.                                                                   |

---

## ⚙️ How It Works

The bot operates in a clear, sequential lifecycle:

| State            | Description                                                                                                                                                       |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IDLE**         | Waits for user to select a beatmap in osu!. It constantly scans the active window's title.                                                                           |
| **DETECT & PARSE** | Once a beatmap is chosen, the title changes. The bot uses this title to find the exact `.osu` file in your `Songs` folder and parses all its data.                  |
| **ARMED**        | The overlay updates with the beatmap info, and the bot is now "armed". It waits for you to press `q` to signal the start of the map. This keypress is crucial for synchronization. |
| **EXECUTE**      | After syncing, the bot takes full control. It follows the parsed object data with precise timing, moving the cursor and pressing keys until the song ends or you press `Esc`. |
| **RESET**        | Once the map is finished or stopped, the bot returns to the `IDLE` state, ready for the next map.                                                                   |

---

## 🚀 Getting Started

<details>
<summary><strong>Step 1: Prerequisites & Installation</strong></summary>

**Requirements:**
*   Python 3.9+
*   Windows OS

**Installation Commands:**
1.  Clone this repository:
    ```bash
    git clone https://your-repository-url/osu-pilot.git
    cd osu-pilot
    ```
2.  Install the required packages:
    ```bash
    pip install keyboard pydirectinput pyautogui numpy pywin32
    ```
</details>

<details>
<summary><strong>Step 2: Critical Configuration</strong></summary>

> **THIS IS THE MOST IMPORTANT STEP.** The bot will not work if this is incorrect.

1.  Open the `config.py` file in a text editor.
2.  Find the `SONGS_DIRECTORY` variable.
3.  Replace the placeholder path with the **full, absolute path** to your osu! `Songs` folder.

**Example `config.py`:**
```python
# --- IMPORTANT ---
# SET YOUR OSU! SONGS FOLDER LOCATION HERE
# This is the full path to your osu! "Songs" folder.
SONGS_DIRECTORY = r"C:\Users\YourUsername\AppData\Local\osu!\Songs" 
```

</details>

<details>
<summary><strong>Step 3: Running the Bot</strong></summary>

1.  Ensure osu! is **not** running yet.
2.  Run the main script from your terminal:
    ```bash
    python main.py
    ```
3.  The **Reaction Time Calibration** will appear on the first launch. Follow the on-screen instructions.
4.  The bot's overlay will now be visible. You can now launch and use osu!.

</details>

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

## ⚠️ Disclaimer

This project was created for **educational purposes** to explore concepts in automation, real-time file parsing, and GUI development.

> Using this bot on official osu! servers is a direct violation of the game's terms of service. Doing so **will result in a swift and permanent ban** of your account. The developer assumes no responsibility for any misuse or consequences.

**Use responsibly and at your own risk.**