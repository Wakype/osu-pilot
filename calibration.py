import tkinter as tk
from tkinter import ttk, font
import time
import random
import statistics

class CalibrationState:
    """Class untuk mengelola state dari tes reaksi."""
    def __init__(self):
        self.reaction_times = []
        self.trials_left = 5
        self.test_start_time = 0
        self.waiting_for_press = False
        self.window = None

def run_calibration(parent, previous_reaction_time_sec=None):
    """
    Menjalankan proses kalibrasi menggunakan Toplevel sebagai anak dari parent.

    Args:
        parent (tk.Tk): Root window utama dari aplikasi.
        previous_reaction_time_sec (float, optional): Waktu reaksi yang disimpan sebelumnya.

    Returns:
        float or None: Waktu reaksi yang dipilih, atau None jika dibatalkan.
    """
    # Fungsi helper untuk menggambar persegi dengan sudut tumpul
    def _create_round_rect(canvas, x1, y1, x2, y2, r, **kwargs):
        canvas.create_polygon(x1 + r, y1, x2 - r, y1, x2, y1, x2, y1 + r, x2, y2 - r, x2, y2, x2 - r, y2, x1 + r, y2, x1, y2, x1, y2 - r, x1, y1 + r, x1, y1, smooth=True, **kwargs)

    # --- Container untuk menyimpan pilihan pengguna ---
    choice_container = {'choice': None}
    
    # --- STAGE 1: JENDELA PILIHAN ---
    choice_window = tk.Toplevel(parent)
    choice_window.overrideredirect(True)
    choice_window.attributes("-topmost", True, "-transparentcolor", "black", "-alpha", 0.95)
    
    width, height = 400, 320
    screen_width, screen_height = choice_window.winfo_screenwidth(), choice_window.winfo_screenheight()
    x, y = (screen_width // 2) - (width // 2), (screen_height // 2) - (height // 2)
    choice_window.geometry(f"{width}x{height}+{x}+{y}")
    
    # Setup UI jendela pilihan...
    canvas = tk.Canvas(choice_window, bg="black", highlightthickness=0)
    canvas.pack(fill="both", expand=True)
    colors = {"background": "#1A1B26", "foreground": "#A9B1D6", "header": "#FFFFFF", "accent": "#7AA2F7", "border": "#7AA2F7", "hover_bg": "#414868"}
    fonts = {"title": font.Font(family="Segoe UI", size=12, weight="bold"), "main": font.Font(family="Segoe UI", size=9)}
    _create_round_rect(canvas, 5, 5, width - 5, height - 5, r=15, fill=colors["background"], outline=colors["border"], width=1)
    frame = tk.Frame(canvas, bg=colors["background"])
    frame.pack(expand=True, fill="both", padx=15, pady=30)
    tk.Label(frame, text="Reaction Time Calibration", font=fonts["title"], fg=colors["header"], bg=colors["background"]).pack(pady=(5, 10))
    tk.Label(frame, text="When the screen flashes WHITE, \npress the [ q ] key as fast as you can.\n\nThis will happen 5 times.", font=fonts["main"], fg=colors["foreground"], bg=colors["background"], justify="center").pack(pady=5, expand=True)
    button_frame = tk.Frame(frame, bg=colors["background"])
    button_frame.pack(pady=10, expand=True)
    
    def set_choice(choice):
        choice_container['choice'] = choice
        choice_window.destroy()

    tk.Button(button_frame, text="Start New Calibration", command=lambda: set_choice('start'), font=fonts["title"], bg=colors["accent"], fg=colors["header"], relief="flat", activebackground=colors["border"], activeforeground=colors["header"], width=20, cursor="hand2").pack(pady=5)
    if previous_reaction_time_sec is not None:
        prev_rt_ms = previous_reaction_time_sec * 1000
        tk.Button(button_frame, text=f"Use Previous ({prev_rt_ms:.0f} ms)", command=lambda: set_choice('use_previous'), font=fonts["title"], bg="#2A2D3B", fg=colors["header"], relief="flat", activebackground=colors["border"], activeforeground=colors["header"], width=20, cursor="hand2").pack(pady=5)

    choice_window.focus_force()
    # Cara yang benar untuk menunggu Toplevel ditutup
    parent.wait_window(choice_window)

    if choice_container['choice'] == 'use_previous':
        return previous_reaction_time_sec
    elif choice_container['choice'] != 'start':
        return None # Pengguna menutup jendela, dianggap batal

    # --- STAGE 2: TES REAKSI LAYAR PENUH ---
    state = CalibrationState()
    test_window = tk.Toplevel(parent)
    state.window = test_window
    test_window.attributes("-fullscreen", True)
    test_window.configure(bg="black", cursor="none")
    test_window.focus_force()

    def on_q_press(event):
        if state.waiting_for_press:
            reaction_time = time.time() - state.test_start_time
            state.waiting_for_press = False
            state.reaction_times.append(reaction_time)
            print(f"  Test {6 - state.trials_left}/5: {reaction_time:.3f} seconds")
            state.window.configure(bg="black")
            state.trials_left -= 1
            if state.trials_left > 0:
                state.window.after(random.randint(1000, 3000), schedule_flash)
            else:
                state.window.after(500, state.window.destroy)

    def flash_screen():
        if state.window.winfo_exists():
            state.window.configure(bg="white")
            state.test_start_time = time.time()
            state.waiting_for_press = True

    def schedule_flash():
        if state.window.winfo_exists():
            state.window.configure(bg="black")
            state.window.after(random.randint(2000, 4000), flash_screen)

    test_window.bind('<q>', on_q_press)
    test_window.bind('<Escape>', lambda e: test_window.destroy())
    
    schedule_flash()
    parent.wait_window(test_window)

    if not state.reaction_times:
        return None # Tes dibatalkan

    median_reaction_time = statistics.median(state.reaction_times)

    # --- STAGE 3: JENDELA HASIL ---
    # Implementasi jendela hasil yang lengkap
    result_window = tk.Toplevel(parent)
    result_window.overrideredirect(True)
    result_window.attributes("-topmost", True, "-transparentcolor", "black", "-alpha", 0.95)
    width, height = 400, 400
    x, y = (screen_width // 2) - (width // 2), (screen_height // 2) - (height // 2)
    result_window.geometry(f"{width}x{height}+{x}+{y}")
    res_canvas = tk.Canvas(result_window, bg="black", highlightthickness=0)
    res_canvas.pack(fill="both", expand=True)
    _create_round_rect(res_canvas, 5, 5, width - 5, height - 5, r=15, fill=colors["background"], outline=colors["border"], width=1)
    res_frame = tk.Frame(res_canvas, bg=colors["background"])
    res_frame.pack(expand=True, fill="both", padx=20, pady=30)
    tk.Label(res_frame, text="Calibration Complete", font=fonts["title"], fg=colors["header"], bg=colors["background"]).pack(pady=(0, 10))
    results_list_frame = tk.Frame(res_frame, bg=colors["background"])
    results_list_frame.pack(pady=5)
    for i, rt in enumerate(state.reaction_times):
        tk.Label(results_list_frame, text=f"Test {i + 1}/5: {rt * 1000:.0f} ms", font=fonts["main"], fg=colors["foreground"], bg=colors["background"]).pack(anchor="w")
    tk.Label(res_frame, text=f"\nYour Median Reaction Time: {median_reaction_time * 1000:.0f} ms", font=fonts["main"], fg="#76F776", bg=colors["background"]).pack(pady=(0, 10))
    ttk.Separator(res_frame, orient='horizontal').pack(fill="x", pady=10)
    tk.Label(res_frame, text="Press [ Ctrl + PgUp ] to toggle overlay.\nPress [ Ctrl + PgDn ] to exit.", font=fonts["main"], fg=colors["foreground"], bg=colors["background"], justify="center").pack(pady=10)
    tk.Button(res_frame, text="Close", command=result_window.destroy, font=fonts["title"], bg=colors["accent"], fg=colors["header"], relief="flat", width=12, cursor="hand2").pack(expand=True, pady=(15, 0))
    
    parent.wait_window(result_window)
    
    return median_reaction_time