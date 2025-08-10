import time
import random
from enum import Enum, auto
import os

import keyboard
import pydirectinput
import pyautogui
import numpy as np
import noise

import utils
import parser
import config

class State(Enum):
    IDLE = auto()
    ARMED = auto()
    RUNNING = auto()

class Pilot:
    def __init__(self, overlay, reaction_time_sec, mod_handler):
        self.overlay = overlay
        self.calibrated_reaction_time_sec = reaction_time_sec
        self.mod_handler = mod_handler
        self.state = State.IDLE
        self.beatmap_data = None
        self.last_beatmap_title = None
        self.screen_width, self.screen_height = pyautogui.size()
        pydirectinput.PAUSE = 0
        self.q_pressed_flag = False
        self.q_press_time = 0
        self.esc_pressed_flag = False
        self.noise_strength = 2.5
        self.noise_scale = 10.0
        self.noise_octaves = 2
        self.noise_persistence = 0.6
        self.noise_lacunarity = 2.0
        self.noise_base_x = random.randint(0, 1024)
        self.noise_base_y = random.randint(0, 1024)

    def _on_q_press(self):
        if self.state == State.ARMED:
            self.q_press_time = time.time()
            self.q_pressed_flag = True

    def _on_esc_press(self):
        if self.state == State.RUNNING:
            self.esc_pressed_flag = True
    
    def _setup_hotkeys(self):
        keyboard.add_hotkey('q', self._on_q_press)
        keyboard.add_hotkey('esc', self._on_esc_press)
        print(" -> 'q' and 'esc' hotkeys are now active.")

    def run(self):
        self._setup_hotkeys()
        try:
            while True:
                self.overlay.update_status(self.state.name)
                if self.state == State.IDLE:
                    self._handle_idle_state()
                elif self.state == State.ARMED:
                    self._handle_armed_state()
                time.sleep(0.01)
        except KeyboardInterrupt:
            self.overlay.root.quit()
        except Exception as e:
            print(f"\nAn unexpected critical error occurred: {e}")
            self.overlay.root.quit()

    def _reset_to_idle(self):
        self.overlay.update_debug_visuals(None)
        self.overlay.update_note_info(None, None)
        self.state = State.IDLE
        self.last_beatmap_title = None
        self.beatmap_data = None
        self.overlay.update_beatmap()
        self.overlay.update_difficulty()
        self.esc_pressed_flag = False
        self.q_pressed_flag = False

    def _handle_idle_state(self):
        active_title = utils.get_active_window_title()
        is_in_map = active_title.startswith("osu!") and " - " in active_title
        if is_in_map:
            current_beatmap_title = active_title.split(" - ", 1)[1]
            if current_beatmap_title != self.last_beatmap_title:
                self.last_beatmap_title = current_beatmap_title
                osu_dir = utils.find_osu_directory()
                if not osu_dir:
                    self.overlay.update_beatmap("CRITICAL: osu! directory not found.")
                    self.last_beatmap_title = None
                    time.sleep(5)
                    return
                songs_dir = os.path.join(osu_dir, "Songs")
                original_data = parser.find_and_process_beatmap(current_beatmap_title, songs_dir)
                if original_data and original_data.get("HitObjects"):
                    self.beatmap_data = self.mod_handler.apply_mods(original_data)
                    self.overlay.update_beatmap(current_beatmap_title)
                    self.overlay.update_difficulty(self.beatmap_data.get("Difficulty"))
                    self.state = State.ARMED
                else:
                    self.last_beatmap_title = None
                    self.overlay.update_beatmap("Beatmap file not found.")
                    self.overlay.update_difficulty(None)

    def _handle_armed_state(self):
        active_title = utils.get_active_window_title()
        is_in_map = active_title.startswith("osu!") and " - " in active_title
        if not is_in_map:
            self._reset_to_idle()
            return
        if self.q_pressed_flag:
            self.q_pressed_flag = False
            print("  -> 'q' press detected. Synchronizing...")
            ar = self.beatmap_data["Difficulty"].get("ApproachRate", 9)
            ar_fadein_ms = utils.calculate_ar_fadein_ms(ar)
            first_note_time_ms = self.beatmap_data["HitObjects"][0]['time']
            song_timeline_at_keypress_sec = (first_note_time_ms - ar_fadein_ms) / 1000.0
            time_circle_actually_appeared = self.q_press_time - self.calibrated_reaction_time_sec
            start_time = time_circle_actually_appeared - song_timeline_at_keypress_sec
            print("  -> Sync complete. Engaging.")
            self._execute_beatmap(start_time)
    
    def _execute_beatmap(self, start_time):
        self.state = State.RUNNING
        hit_object_index = 0
        use_s_key = True
        last_action_time_sec = time.time()
        last_screen_pos = pyautogui.position()
        p_minus_1 = None

        while hit_object_index < len(self.beatmap_data["HitObjects"]):
            if self.esc_pressed_flag:
                print("  -> ESC press detected. Autopilot STOPPED.")
                self.overlay.update_debug_visuals(None)
                break
            
            self.overlay.update_status(self.state.name)
            hit_object = self.beatmap_data["HitObjects"][hit_object_index]
            self.overlay.update_note_info(hit_object, hit_object_index)

            offset_sec = config.TIMING_OFFSET_MS / 1000.0
            target_time_sec = start_time + (hit_object['time'] / 1000.0) + offset_sec
            target_screen_pos = utils.convert_coordinates(hit_object['x'], hit_object['y'], self.screen_width, self.screen_height)
            time_to_move_sec = target_time_sec - last_action_time_sec
            
            p0 = np.array(last_screen_pos)
            p2 = np.array(target_screen_pos)
            dist = np.linalg.norm(p2 - p0)
            
            if self.overlay.is_flow_aim_active():
                midpoint = (p0 + p2) / 2
                if p_minus_1 is not None and dist > 0:
                    vec_in = p0 - p_minus_1; vec_out = p2 - p0
                    norm_in = np.linalg.norm(vec_in); norm_out = np.linalg.norm(vec_out)
                    if norm_in > 0 and norm_out > 0:
                        flow_vec = (vec_in / norm_in) + (vec_out / norm_out)
                        norm_flow = np.linalg.norm(flow_vec)
                        if norm_flow > 0: perp_vec = np.array([-flow_vec[1], flow_vec[0]]) / norm_flow
                        else: perp_vec = np.array([-(p2-p0)[1], (p2-p0)[0]]) / dist
                    else: perp_vec = np.array([-(p2-p0)[1], (p2-p0)[0]]) / dist
                    max_offset = dist * 0.4; offset = random.uniform(max_offset * 0.25, max_offset)
                    if np.cross(vec_in, vec_out) < 0: offset = -offset
                    p1 = midpoint + perp_vec * offset
                else:
                    if dist > 0: perp_vec = np.array([-(p2-p0)[1], (p2-p0)[0]]) / dist
                    else: perp_vec = np.array([0, 0])
                    max_offset = dist * 0.25; offset = random.uniform(-max_offset, max_offset)
                    p1 = midpoint + perp_vec * offset
            else:
                midpoint = (p0 + p2) / 2; vec = p2 - p0
                if dist > 0: perp_vec = np.array([-vec[1], vec[0]]) / dist
                else: perp_vec = np.array([0, 0])
                max_offset = dist * 0.20; offset = random.uniform(-max_offset, max_offset)
                p1 = midpoint + perp_vec * offset

            if self.overlay.is_debug_mode_active():
                future_notes_to_draw = []
                # Look ahead for the next 3 objects
                for i in range(1, 4):
                    if hit_object_index + i < len(self.beatmap_data["HitObjects"]):
                        note = self.beatmap_data["HitObjects"][hit_object_index + i]
                        is_slider = note.get('curveType') is not None
                        
                        note_info = {}
                        if is_slider:
                            # Calculate the full slider path in osu! pixels
                            osu_pixel_path = parser.calculate_slider_path(note)
                            # Convert the entire path to screen coordinates
                            screen_path = [utils.convert_coordinates(px, py, self.screen_width, self.screen_height) for px, py in osu_pixel_path]
                            note_info['type'] = 'slider'
                            note_info['path'] = screen_path
                        else: # It's a circle
                            pos = utils.convert_coordinates(note['x'], note['y'], self.screen_width, self.screen_height)
                            note_info['type'] = 'circle'
                            note_info['screen_pos'] = pos
                            note_info['radius'] = 40 - (i * 5) # Decrease radius for notes further away
                        
                        future_notes_to_draw.append(note_info)

                self.overlay.update_debug_visuals({
                    'future_notes': future_notes_to_draw
                })
            else:
                self.overlay.update_debug_visuals(None)

            if time_to_move_sec > 0.01:
                move_start_time = last_action_time_sec
                while time.time() < move_start_time + time_to_move_sec:
                    if self.esc_pressed_flag: break
                    progress = (time.time() - move_start_time) / time_to_move_sec
                    eased_progress = utils.ease_in_out_sine(min(progress, 1.0))
                    bezier_pos = utils.calculate_quadratic_bezier_point(p0, p1, p2, eased_progress)
                    noise_input = progress * self.noise_scale
                    noise_x = noise.pnoise1(noise_input, octaves=self.noise_octaves, persistence=self.noise_persistence, lacunarity=self.noise_lacunarity, base=self.noise_base_x)
                    noise_y = noise.pnoise1(noise_input, octaves=self.noise_octaves, persistence=self.noise_persistence, lacunarity=self.noise_lacunarity, base=self.noise_base_y)
                    final_x = bezier_pos[0] + noise_x * self.noise_strength
                    final_y = bezier_pos[1] + noise_y * self.noise_strength
                    pydirectinput.moveTo(int(final_x), int(final_y))
                    time.sleep(0.001)

            if self.esc_pressed_flag: break
            
            pydirectinput.moveTo(target_screen_pos[0], target_screen_pos[1])
            while time.time() < target_time_sec:
                pass

            if self.esc_pressed_flag: break

            key_to_press = 's' if use_s_key else 'a'
            is_spinner = hit_object['type'] & 8
            is_slider = hit_object.get('curveType') is not None
            if is_spinner:
                duration = (hit_object['endTime'] - hit_object['time']) / 1000.0
                spin_center_screen = utils.convert_coordinates(256, 192, self.screen_width, self.screen_height)
                pydirectinput.keyDown(key_to_press)
                spinner_start_time = time.time()
                while time.time() < spinner_start_time + duration:
                    if self.esc_pressed_flag: break
                    elapsed = time.time() - spinner_start_time
                    angle = (elapsed * (config.SPINNER_RPM / 60)) * (2 * np.pi)
                    radius = config.SPINNER_RADIUS + random.uniform(-config.SPINNER_RADIUS_FLUCTUATION, config.SPINNER_RADIUS_FLUCTUATION) * utils.ease_in_out_sine(elapsed / duration if duration > 0 else 1)
                    screen_x = spin_center_screen[0] + radius * np.cos(angle)
                    screen_y = spin_center_screen[1] + radius * np.sin(angle)
                    pydirectinput.moveTo(int(screen_x), int(screen_y))
                    time.sleep(0.001)
                pydirectinput.keyUp(key_to_press)
                last_screen_pos = spin_center_screen
            elif is_slider:
                duration_per_slide = parser.get_slider_duration(hit_object, self.beatmap_data["Difficulty"], self.beatmap_data["TimingPoints"]) / hit_object['slides']
                path = parser.calculate_slider_path(hit_object)
                if path:
                    pydirectinput.keyDown(key_to_press)
                    for slide_num in range(hit_object['slides']):
                        if self.esc_pressed_flag: break
                        slide_start_time = time.time()
                        current_path = path if slide_num % 2 == 0 else path[::-1]
                        time_to_spend_on_slide = duration_per_slide / 1000.0
                        while time.time() < slide_start_time + time_to_spend_on_slide:
                            if self.esc_pressed_flag: break
                            progress = (time.time() - slide_start_time) / time_to_spend_on_slide if time_to_spend_on_slide > 0 else 1.0
                            path_index = int((len(current_path) - 1) * min(progress, 1.0))
                            current_pos = current_path[path_index]
                            screen_x, screen_y = utils.convert_coordinates(current_pos[0], current_pos[1], self.screen_width, self.screen_height)
                            pydirectinput.moveTo(screen_x, screen_y)
                            time.sleep(0.001)
                    pydirectinput.keyUp(key_to_press)
                    if not self.esc_pressed_flag:
                        final_slider_pos_osu = path[-1] if hit_object['slides'] % 2 == 1 else path[0]
                        last_screen_pos = utils.convert_coordinates(final_slider_pos_osu[0], final_slider_pos_osu[1], self.screen_width, self.screen_height)
            else:
                pydirectinput.keyDown(key_to_press)
                time.sleep(0.01)
                pydirectinput.keyUp(key_to_press)
                last_screen_pos = target_screen_pos
            
            p_minus_1 = np.array(last_screen_pos)
            last_action_time_sec = time.time()
            use_s_key = not use_s_key
            hit_object_index += 1
        
        if hit_object_index >= len(self.beatmap_data["HitObjects"]):
            print("  -> Beatmap finished!")

        self._reset_to_idle()