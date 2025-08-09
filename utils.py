import re
import math
import os
import json
import win32gui
import psutil
import winreg
import numpy as np # <-- Added for vector math

# --- BARU: Nama file untuk menyimpan data kalibrasi ---
SETTINGS_FILE = 'settings.json'

# --- BARU: Fungsi untuk menyimpan data kalibrasi ---
def save_calibration_data(time_sec):
    """Saves the reaction time to the settings file."""
    try:
        with open(SETTINGS_FILE, 'w') as f:
            json.dump({'last_reaction_time_sec': time_sec}, f, indent=4)
        print(f" -> Calibration data saved: {time_sec:.3f}s")
    except Exception as e:
        print(f" ! Could not save calibration data: {e}")

# --- BARU: Fungsi untuk memuat data kalibrasi ---
def load_calibration_data():
    """Loads the reaction time from the settings file. Returns None if not found."""
    if not os.path.exists(SETTINGS_FILE):
        return None
    try:
        with open(SETTINGS_FILE, 'r') as f:
            data = json.load(f)
            rt_sec = data.get('last_reaction_time_sec')
            if isinstance(rt_sec, (float, int)):
                print(f" -> Previous calibration data loaded: {rt_sec:.3f}s")
                return rt_sec
    except (json.JSONDecodeError, KeyError) as e:
        print(f" ! Could not read calibration data file: {e}")
    return None

# --- Cache untuk path direktori osu! untuk menghindari pencarian berulang ---
_OSU_PATH_CACHE = None

def _find_from_process():
    """Tries to find the osu! directory from a running osu!.exe process."""
    for proc in psutil.process_iter(['name', 'exe']):
        if proc.info['name'] == 'osu!.exe':
            exe_path = proc.info['exe']
            if exe_path and os.path.exists(exe_path):
                print(" -> Found running osu!.exe process.")
                return os.path.dirname(exe_path)
    return None

def _find_from_registry():
    """Tries to find the osu! directory from the Windows Registry (osu:// protocol)."""
    try:
        with winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, r"osu!\shell\open\command") as key:
            command, _ = winreg.QueryValueEx(key, None)
            match = re.search(r'"(.*?osu!\.exe)"', command)
            if match:
                exe_path = match.group(1)
                if os.path.exists(exe_path):
                    print(" -> Found osu! path in registry.")
                    return os.path.dirname(exe_path)
    except FileNotFoundError:
        pass
    except Exception as e:
        print(f" ! Error reading registry: {e}")
    return None

def _find_in_common_locations():
    """Searches for osu!.exe in common installation directories."""
    local_app_data = os.environ.get('LOCALAPPDATA')
    if local_app_data:
        potential_path = os.path.join(local_app_data, 'osu!')
        if os.path.exists(os.path.join(potential_path, 'osu!.exe')):
            print(" -> Found osu! in AppData (default location).")
            return potential_path
            
    program_files_x86 = os.environ.get('ProgramFiles(x86)')
    program_files = os.environ.get('ProgramW6432')
    
    locations_to_check = []
    if program_files_x86:
        locations_to_check.append(os.path.join(program_files_x86, 'osu!'))
    if program_files:
        locations_to_check.append(os.path.join(program_files, 'osu!'))
        
    for path in locations_to_check:
        if os.path.exists(os.path.join(path, 'osu!.exe')):
            print(f" -> Found osu! in {path}.")
            return path
            
    return None

def find_osu_directory():
    """
    Finds the osu! directory using a multi-step approach.
    Caches the result for subsequent calls.
    """
    global _OSU_PATH_CACHE
    if _OSU_PATH_CACHE and os.path.exists(_OSU_PATH_CACHE):
        return _OSU_PATH_CACHE

    print(" -> Searching for osu! directory...")
    
    path = _find_from_process()
    if path:
        _OSU_PATH_CACHE = path
        return path
        
    path = _find_from_registry()
    if path:
        _OSU_PATH_CACHE = path
        return path
        
    path = _find_in_common_locations()
    if path:
        _OSU_PATH_CACHE = path
        return path
        
    print(" -> FAILED: Could not automatically find the osu! directory.")
    return None

def get_active_window_title():
    """Gets the title of the currently active (foreground) window."""
    try:
        return win32gui.GetWindowText(win32gui.GetForegroundWindow())
    except Exception:
        return ""

def clean_filename(name):
    """Removes illegal characters from a filename."""
    return re.sub(r'[<>:"/\\|?*]', '', name)

def simplify_string(text):
    """Simplifies a string to lowercase alphanumeric characters for comparison."""
    return re.sub(r'[^a-z0-9]', '', text.lower())

def convert_coordinates(osu_x, osu_y, screen_width, screen_height):
    """Converts osu! playfield coordinates (512x384) to screen coordinates."""
    playfield_height = screen_height * 0.8
    playfield_width = playfield_height * (4 / 3)
    x_offset = (screen_width - playfield_width) / 2
    y_offset = (screen_height - playfield_height) / 2
    screen_x = ((osu_x / 512) * playfield_width) + x_offset
    screen_y = ((osu_y / 384) * playfield_height) + y_offset
    return int(screen_x), int(screen_y)

def ease_in_out_sine(t):
    """Easing function for smooth cursor movement."""
    return -(math.cos(math.pi * t) - 1) / 2

def calculate_ar_fadein_ms(ar):
    """Calculates the fade-in duration of a hit circle based on the Approach Rate (AR)."""
    if ar < 5:
        return 1200 + 600 * (5 - ar) / 5
    elif ar == 5:
        return 1200
    else:
        return 1200 - 750 * (ar - 5) / 5

# --- NEW: Function to calculate a point on a quadratic Bezier curve ---
def calculate_quadratic_bezier_point(p0, p1, p2, t):
    """
    Calculates a point on a quadratic Bezier curve.
    p0: start point, p1: control point, p2: end point.
    t: progress from 0.0 to 1.0.
    """
    p0 = np.array(p0)
    p1 = np.array(p1)
    p2 = np.array(p2)
    
    # Formula: (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
    point = ((1 - t)**2 * p0) + (2 * (1 - t) * t * p1) + (t**2 * p2)
    return tuple(point)