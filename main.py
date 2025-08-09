# main.py

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
    """Menginisialisasi dan menjalankan aplikasi."""
    
    mod_handler = ModHandler()
    # 1. Membuat instance Overlay. Ini juga membuat root tk.Tk() utama.
    overlay = OverlayWindow(mod_handler) 

    try:
        # 2. Memuat data kalibrasi sebelumnya
        previous_rt = utils.load_calibration_data()
        
        # 3. Menjalankan kalibrasi dengan meneruskan root dari overlay sebagai induk
        chosen_reaction_time = run_calibration(overlay.root, previous_rt)

        # 4. Jika kalibrasi baru selesai, simpan hasilnya.
        #    Gunakan toleransi kecil untuk perbandingan float.
        is_new_calibration = (chosen_reaction_time is not None and 
                              (previous_rt is None or not math.isclose(chosen_reaction_time, previous_rt)))
        
        if is_new_calibration:
             utils.save_calibration_data(chosen_reaction_time)

    except Exception as e:
        print(f"Tidak dapat menjalankan kalibrasi karena error: {e}.")
        chosen_reaction_time = REACTION_TIME_DEFAULT

    # Jika kalibrasi dibatalkan oleh pengguna, gunakan nilai default.
    if chosen_reaction_time is None:
        print("Kalibrasi dibatalkan, menggunakan nilai default.")
        chosen_reaction_time = REACTION_TIME_DEFAULT

    # 5. Perbarui UI overlay dengan nilai kalibrasi yang dipilih
    overlay.update_reaction_time(chosen_reaction_time)
    
    print("\nBot starting...")
    print("Press 'Ctrl + PgUp' to toggle overlay. Press 'Ctrl + PgDn' to exit.")

    osu_pilot = Pilot(overlay, chosen_reaction_time, mod_handler)

    bot_thread = threading.Thread(target=osu_pilot.run, daemon=True)
    bot_thread.start()

    keyboard.add_hotkey('ctrl+page up', overlay.toggle_visibility)
    keyboard.add_hotkey('ctrl+page down', lambda: overlay.root.quit())

    # 6. Jalankan mainloop utama aplikasi dari overlay.
    overlay.run()

    print("Exiting script.")

if __name__ == "__main__":
    main()