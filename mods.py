import copy

class ModHandler:
    """
    Manages game modifications and applies their effects to beatmap data.

    This class provides a centralized way to handle gameplay mods such as
    Hard Rock (HR), Double Time (DT), and Nightcore (NC). It maintains the
    state of which mods are currently active and contains the logic to
    transform beatmap data according to the rules of those mods.

    Attributes:
        active_mods (set): A set of strings containing the names of the
                           currently active mods (e.g., {'HR', 'DT'}).

    Key Methods:
        - toggle_hr(), toggle_dt(), toggle_nc():
            Methods to enable or disable specific mods. They handle mutually
            exclusive mods like DT and NC automatically.
        - apply_mods(original_beatmap_data):
            The primary method for transformation. It takes the original
            beatmap data, creates a deep copy, and then applies all active
            mod effects to it, returning the new, modded data.

    Mod Effect Logic:
        - Hard Rock (HR): Flips the entire playfield vertically. All Y-coordinates
          for hit circles and slider paths are inverted.
        - Double Time (DT) / Nightcore (NC): Speeds up the map by a factor of 1.5.
          This shortens all timing values (hit times, slider durations) and
          recalculates difficulty settings like Approach Rate (AR) and Overall
          Difficulty (OD) to match the increased speed.
    """
    def __init__(self):
        self.active_mods = set()

    def toggle_hr(self):
        if 'HR' in self.active_mods:
            self.active_mods.remove('HR')
            print(" -> HR mod DEACTIVATED")
        else:
            self.active_mods.add('HR')
            print(" -> HR mod ACTIVATED")

    def toggle_dt(self):
        if 'DT' in self.active_mods:
            self.active_mods.remove('DT')
            print(" -> DT mod DEACTIVATED")
        else:
            self.active_mods.add('DT')
            if 'NC' in self.active_mods:
                self.active_mods.remove('NC')
            print(" -> DT mod ACTIVATED")

    def toggle_nc(self):
        if 'NC' in self.active_mods:
            self.active_mods.remove('NC')
            print(" -> NC mod DEACTIVATED")
        else:
            self.active_mods.add('NC')
            if 'DT' in self.active_mods:
                self.active_mods.remove('DT')
            print(" -> NC mod ACTIVATED")

    def is_mod_active(self, mod_name):
        return mod_name.upper() in self.active_mods

    def apply_mods(self, original_beatmap_data):
        modded_data = copy.deepcopy(original_beatmap_data)

        if not self.active_mods:
            return modded_data

        print(f" -> Applying mods: {', '.join(self.active_mods)}")

        if 'HR' in self.active_mods:
            self._apply_hr(modded_data)
        
        if 'DT' in self.active_mods or 'NC' in self.active_mods:
            self._apply_dt_nc(modded_data)
            
        return modded_data

    def _apply_hr(self, data):
        for hit_object in data["HitObjects"]:
            hit_object['y'] = 384 - hit_object['y']
            if hit_object.get('curveType'):
                flipped_curve_points = []
                for x, y in hit_object['curvePoints']:
                    flipped_curve_points.append((x, 384 - y))
                hit_object['curvePoints'] = flipped_curve_points
        
    def _apply_dt_nc(self, data):
        speed_multiplier = 1.5
        
        for hit_object in data["HitObjects"]:
            hit_object['time'] = int(hit_object['time'] / speed_multiplier)
            if 'endTime' in hit_object:
                hit_object['endTime'] = int(hit_object['endTime'] / speed_multiplier)

        for timing_point in data["TimingPoints"]:
            timing_point['time'] = int(timing_point['time'] / speed_multiplier)
            if timing_point['beatLength'] > 0:
                timing_point['beatLength'] /= speed_multiplier
        
        ar = data["Difficulty"].get("ApproachRate", 9)
        od = data["Difficulty"].get("OverallDifficulty", 9)

        if ar <= 5:
            new_ar_ms = 1800 - (120 * ar)
        else:
            new_ar_ms = 1200 - (150 * (ar - 5))
        
        new_ar_ms /= speed_multiplier

        if new_ar_ms > 1200:
            new_ar = (1800 - new_ar_ms) / 120
        else:
            new_ar = 5 + (1200 - new_ar_ms) / 150
            
        data["Difficulty"]["ApproachRate"] = round(new_ar, 2)
        
        od_ms = 79.5 - (6 * od)
        new_od_ms = od_ms / speed_multiplier
        new_od = (79.5 - new_od_ms) / 6
        data["Difficulty"]["OverallDifficulty"] = round(new_od, 2)