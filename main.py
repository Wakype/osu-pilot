import threading
import keyboard
import math

from mods import ModHandler
from overlay import OverlayWindow
from pilot import Pilot
from calibration import run_calibration
from config import REACTION_TIME_DEFAULT
import utils

def main():
    """
    Initializes and runs the main application.

    This function serves as the primary entry point, orchestrating the setup
    and execution of all core components. The process includes:
    
    1.  Creating the main GUI overlay window.
    2.  Running a mandatory reaction time calibration test. It allows the user
        to perform a new test or use a previously saved value. If the calibration
        is cancelled or fails, it reverts to a default value.
    3.  Initializing the main 'Pilot' bot logic with the determined
        reaction time.
    4.  Spawning a separate daemon thread for the Pilot's continuous execution,
        ensuring the GUI remains responsive.
    5.  Registering global hotkeys (`Ctrl+PgUp` to toggle the overlay,
        `Ctrl+PgDn` to exit).
    6.  Starting the Tkinter main event loop, which listens for events and
        keeps the application running until explicitly quit.
    """
    mod_handler = ModHandler()
    overlay = OverlayWindow(mod_handler) 

    try:
        previous_rt = utils.load_calibration_data()
        
        chosen_reaction_time = run_calibration(overlay.root, previous_rt)

        is_new_calibration = (chosen_reaction_time is not None and 
                              (previous_rt is None or not math.isclose(chosen_reaction_time, previous_rt)))
        
        if is_new_calibration:
             utils.save_calibration_data(chosen_reaction_time)

    except Exception as e:
        print(f"Could not run calibration due to an error: {e}.")
        chosen_reaction_time = REACTION_TIME_DEFAULT

    if chosen_reaction_time is None:
        print("Calibration cancelled, using default value.")
        chosen_reaction_time = REACTION_TIME_DEFAULT

    overlay.update_reaction_time(chosen_reaction_time)
    
    print("\nBot starting...")
    print("Press 'Ctrl + PgUp' to toggle overlay. Press 'Ctrl + PgDn' to exit.")

    osu_pilot = Pilot(overlay, chosen_reaction_time, mod_handler)

    bot_thread = threading.Thread(target=osu_pilot.run, daemon=True)
    bot_thread.start()

    keyboard.add_hotkey('ctrl+page up', overlay.toggle_visibility)
    keyboard.add_hotkey('ctrl+page down', lambda: overlay.root.quit())

    overlay.run()

    print("Exiting script.")

if __name__ == "__main__":
    main()