import tkinter as tk
from tkinter import font, ttk

class OverlayWindow:
    """
    Manages the graphical user interface (GUI) overlay for the application.

    This class is responsible for creating, displaying, and updating two distinct,
    movable overlay windows using Tkinter. It serves as the primary visual
    component, providing real-time feedback and user controls.

    Windows Managed:
      - Idle Window: A compact window displayed when no beatmap is loaded. It
        shows the bot's current status (e.g., IDLE) and provides checkboxes
        for toggling gameplay mods (HR, DT, NC) and movement styles (Flow Aim).
      - Detail Window: A more comprehensive window that appears when a beatmap
        is successfully loaded. It displays detailed information such as beatmap
        title, difficulty stats (CS, AR, OD, HP), the user's calibrated
        reaction time, and data about the next upcoming hit object.

    Key Features:
      - State-driven display that automatically switches between idle and detail views.
      - Draggable interface, allowing the user to reposition the windows on screen.
      - A public API of `update_*` methods to dynamically change the displayed
        information (e.g., status, beatmap name, difficulty).
      - Integration with a ModHandler to reflect and control active gameplay mods.
      - A `toggle_visibility` method to hide or show the entire overlay.
      - Exposes configuration options like "Flow Aim" for other modules to query.

    The class encapsulates all Tkinter setup, styling, and event handling,
    and runs the main GUI loop via its `run()` method.
    """
    def __init__(self, mod_handler=None):
        self.root = tk.Tk()
        self.root.withdraw()

        self.mod_handler = mod_handler

        self._initialize_vars()
        self._create_idle_window()
        self._create_detail_window()

        self.show_idle_window()

    def _initialize_vars(self):
        self.colors = {
            "background": "#1A1B26", "foreground": "#A9B1D6", "header": "#FFFFFF",
            "accent": "#7AA2F7", "border": "#7AA2F7", "status_idle": "#FFC777",
            "status_armed": "#7AA2F7", "status_running": "#76F776", "not_found": "#F7768E",
            "separator": "#414868", "mod_button_bg": "#2A2D3B", "mod_button_active": "#7AA2F7"
        }
        self.fonts = {
            "title": font.Font(family="Segoe UI", size=10, weight="bold"),
            "main": font.Font(family="Segoe UI", size=9),
        }
        self.status_var = tk.StringVar(value="IDLE")
        self.beatmap_var = tk.StringVar(value="...")
        self.difficulty_var = tk.StringVar(value="...")
        self.note_info_var = tk.StringVar(value="...")
        self.rt_var = tk.StringVar(value="RT: N/A")

        self.hr_var = tk.BooleanVar()
        self.dt_var = tk.BooleanVar()
        self.nc_var = tk.BooleanVar()
        self.flow_aim_var = tk.BooleanVar(value=False)

        self._offset_x = 0
        self._offset_y = 0
        self.is_visible = True
        self.padding = 20

    def _configure_toplevel(self, window):
        window.overrideredirect(True)
        window.attributes("-topmost", True, "-transparentcolor", "black", "-alpha", 1)
        window.configure(bg="black")
        window.geometry(f"+{self.padding}+{self.padding}")

        canvas = tk.Canvas(window, bg="black", highlightthickness=0)
        canvas.pack(fill="both", expand=True)

        canvas.bind("<ButtonPress-1>", lambda e: self._start_move(e))
        canvas.bind("<B1-Motion>", lambda e: self._do_move(e, window))
        return canvas

    def _create_idle_window(self):
        self.idle_window = tk.Toplevel(self.root)
        canvas = self._configure_toplevel(self.idle_window)
        frame = tk.Frame(canvas, bg=self.colors["background"])

        header_frame = tk.Frame(frame, bg=self.colors["background"])
        self.idle_status_indicator = tk.Frame(header_frame, bg=self.colors["status_idle"], width=10, height=10)
        self.idle_status_indicator.pack(side="left", padx=(0, 5), anchor="center")
        tk.Label(header_frame, textvariable=self.status_var, font=self.fonts["main"],
                 fg=self.colors["foreground"], bg=self.colors["background"]).pack(side="left", anchor="center")
        tk.Label(header_frame, text="osu!pilot v1.0", font=self.fonts["title"],
                 fg=self.colors["header"], bg=self.colors["background"]).pack(side="right", anchor="center")
        header_frame.pack(side="top", fill="x", padx=10, pady=5)

        ttk.Separator(frame, orient='horizontal').pack(side="top", fill="x", padx=5, pady=5)
        
        tk.Label(frame, text="BEATMAP NOT FOUND", font=self.fonts["main"],
                 fg=self.colors["not_found"], bg=self.colors["background"]).pack(side="top", anchor="w", padx=10, pady=(0, 5))

        mod_frame = tk.Frame(frame, bg=self.colors["background"])
        style = ttk.Style()
        style.configure("TCheckbutton",
                        background=self.colors["mod_button_bg"], foreground=self.colors["foreground"],
                        indicatorcolor=self.colors["mod_button_bg"], relief="flat",
                        font=self.fonts["main"], padding=5)
        style.map("TCheckbutton",
                  background=[('active', self.colors["mod_button_bg"]), ('selected', self.colors["mod_button_active"])],
                  foreground=[('selected', self.colors["header"])])

        hr_button = ttk.Checkbutton(mod_frame, text="HR", variable=self.hr_var, command=self._toggle_hr, style="TCheckbutton")
        dt_button = ttk.Checkbutton(mod_frame, text="DT", variable=self.dt_var, command=self._toggle_dt, style="TCheckbutton")
        nc_button = ttk.Checkbutton(mod_frame, text="NC", variable=self.nc_var, command=self._toggle_nc, style="TCheckbutton")
        
        hr_button.pack(side="left", padx=2, fill="x", expand=True)
        dt_button.pack(side="left", padx=2, fill="x", expand=True)
        nc_button.pack(side="left", padx=2, fill="x", expand=True)
        
        mod_frame.pack(side="top", fill="x", padx=10, pady=(5, 0))
        
        style_frame = tk.Frame(frame, bg=self.colors["background"])
        flow_aim_button = ttk.Checkbutton(style_frame, text="Flow Aim", variable=self.flow_aim_var, style="TCheckbutton")
        flow_aim_button.pack(side="left", padx=2, fill="x", expand=True)
        style_frame.pack(side="top", fill="x", padx=10, pady=(5, 10))

        self.idle_frame = frame
        self.idle_canvas = canvas

    def _toggle_hr(self):
        if self.mod_handler: self.mod_handler.toggle_hr()

    def _toggle_dt(self):
        if self.mod_handler:
            self.mod_handler.toggle_dt()
            if self.dt_var.get(): self.nc_var.set(False)

    def _toggle_nc(self):
        if self.mod_handler:
            self.mod_handler.toggle_nc()
            if self.nc_var.get(): self.dt_var.set(False)

    def is_flow_aim_active(self):
        return self.flow_aim_var.get()

    def _create_detail_window(self):
        self.detail_window = tk.Toplevel(self.root)
        canvas = self._configure_toplevel(self.detail_window)
        frame = tk.Frame(canvas, bg=self.colors["background"])

        header_frame = tk.Frame(frame, bg=self.colors["background"])
        self.status_indicator = tk.Frame(header_frame, bg=self.colors["status_armed"], width=10, height=10)
        self.status_indicator.pack(side="left", padx=(0, 5), anchor="center")
        tk.Label(header_frame, textvariable=self.status_var, font=self.fonts["main"],
                 fg=self.colors["foreground"], bg=self.colors["background"]).pack(side="left", anchor="center")

        right_header_frame = tk.Frame(header_frame, bg=self.colors["background"])
        tk.Label(right_header_frame, textvariable=self.rt_var, font=self.fonts["main"],
                 fg=self.colors["accent"], bg=self.colors["background"]).pack(side="left", padx=(0, 10))
        tk.Label(right_header_frame, text="osu!pilot v1.0", font=self.fonts["title"],
                 fg=self.colors["header"], bg=self.colors["background"]).pack(side="left")
        right_header_frame.pack(side="right")
        header_frame.pack(side="top", fill="x", padx=10, pady=(5, 0))

        s = ttk.Style()
        s.configure('TSeparator', background=self.colors["separator"])
        ttk.Separator(frame, orient='horizontal').pack(side="top", fill="x", padx=5, pady=5)

        tk.Label(frame, textvariable=self.beatmap_var, font=self.fonts["main"],
                 fg=self.colors["foreground"], bg=self.colors["background"], justify="left").pack(side="top", anchor="w", padx=10)
        tk.Label(frame, textvariable=self.difficulty_var, font=self.fonts["main"],
                 fg=self.colors["foreground"], bg=self.colors["background"], justify="left").pack(side="top", anchor="w", padx=10, pady=2)
        tk.Label(frame, textvariable=self.note_info_var, font=self.fonts["main"],
                 fg=self.colors["accent"], bg=self.colors["background"], justify="left").pack(side="top", anchor="w", padx=10, pady=(0, 5))

        self.detail_frame = frame
        self.detail_canvas = canvas

    def _update_geometry(self, window, canvas, frame):
        frame.update_idletasks()
        req_width = frame.winfo_reqwidth()
        req_height = frame.winfo_reqheight()
        new_width = req_width + self.padding
        new_height = req_height + self.padding
        window.geometry(f"{new_width}x{new_height}")
        canvas.config(width=new_width, height=new_height)
        canvas.delete("all")
        self._create_round_rect(canvas, 5, 5, new_width - 5, new_height - 5, r=15,
                                fill=self.colors["background"], outline=self.colors["border"], width=1)
        frame.place(relx=0.5, rely=0.5, anchor="center")

    def show_idle_window(self):
        self.detail_window.withdraw()
        if self.is_visible:
            self.idle_window.deiconify()
        self.root.after_idle(lambda: self._update_geometry(self.idle_window, self.idle_canvas, self.idle_frame))

    def show_detail_window(self):
        self.idle_window.withdraw()
        if self.is_visible:
            self.detail_window.deiconify()
        self.root.after_idle(lambda: self._update_geometry(self.detail_window, self.detail_canvas, self.detail_frame))

    def update_status(self, status):
        current_status = status.upper()
        self.status_var.set(current_status)
        color = self.colors["status_idle"]
        if current_status == 'ARMED':
            color = self.colors["status_armed"]
        elif current_status == 'RUNNING':
            color = self.colors["status_running"]
        self.status_indicator.config(bg=color)
        self.idle_status_indicator.config(bg=color)
        if current_status == 'IDLE':
            self.show_idle_window()

    def update_beatmap(self, beatmap_name=None):
        is_valid = beatmap_name and "not found" not in str(beatmap_name).lower()
        if is_valid:
            active_mods_str = ""
            if self.mod_handler and self.mod_handler.active_mods:
                active_mods_str = " +" + "".join(sorted(list(self.mod_handler.active_mods)))
            self.beatmap_var.set(beatmap_name + active_mods_str)
            self.show_detail_window()
        else:
            self.show_idle_window()

    def update_difficulty(self, diff_dict=None):
        if diff_dict:
            hp = diff_dict.get('HPDrainRate', '?')
            cs = diff_dict.get('CircleSize', '?')
            od = diff_dict.get('OverallDifficulty', '?')
            ar = diff_dict.get('ApproachRate', '?')
            self.difficulty_var.set(f"HP:{hp} | CS:{cs} | OD:{od} | AR:{ar}")
        else:
            self.difficulty_var.set("...")

    def update_note_info(self, hit_object=None, index=None):
        if hit_object and index is not None:
            self.note_info_var.set(f"Note #{index + 1}: (X: {hit_object['x']}, Y: {hit_object['y']}) @ {hit_object['time']}ms")
        else:
            self.note_info_var.set("...")

    def update_reaction_time(self, rt_sec=None):
        if rt_sec is not None and isinstance(rt_sec, (int, float)):
            self.rt_var.set(f"RT: {rt_sec * 1000:.0f}ms")
        else:
            self.rt_var.set("RT: N/A")

    def toggle_visibility(self):
        self.is_visible = not self.is_visible
        if self.is_visible:
            if self.status_var.get() == 'IDLE':
                self.show_idle_window()
            else:
                self.show_detail_window()
        else:
            self.idle_window.withdraw()
            self.detail_window.withdraw()

    def _create_round_rect(self, canvas, x1, y1, x2, y2, r=25, **kwargs):
        canvas.create_polygon(
            x1+r, y1, x2-r, y1, x2, y1, x2, y1+r, x2, y2-r, x2, y2,
            x2-r, y2, x1+r, y2, x1, y2, x1, y2-r, x1, y1+r, x1, y1,
            smooth=True, **kwargs)

    def _start_move(self, event):
        self._offset_x = event.x
        self._offset_y = event.y

    def _do_move(self, event, window):
        x = window.winfo_pointerx() - self._offset_x
        y = window.winfo_pointery() - self._offset_y
        window.geometry(f"+{x}+{y}")

    def run(self):
        try:
            self.root.mainloop()
        except (KeyboardInterrupt, tk.TclError):
            pass
        finally:
            try:
                for window in self.root.winfo_children():
                    if isinstance(window, tk.Toplevel):
                        window.destroy()
                self.root.destroy()
            except tk.TclError:
                pass