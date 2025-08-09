import copy

class ModHandler:
    """
    Manages active gameplay mods and applies their effects to beatmap data.
    """
    def __init__(self):
        self.active_mods = set()

    def toggle_hr(self):
        """Toggles the Hard Rock (HR) mod."""
        if 'HR' in self.active_mods:
            self.active_mods.remove('HR')
            print(" -> HR mod DEACTIVATED")
        else:
            self.active_mods.add('HR')
            print(" -> HR mod ACTIVATED")

    def toggle_dt(self):
        """Toggles the Double Time (DT) mod. Deactivates NC if active."""
        if 'DT' in self.active_mods:
            self.active_mods.remove('DT')
            print(" -> DT mod DEACTIVATED")
        else:
            self.active_mods.add('DT')
            if 'NC' in self.active_mods:
                self.active_mods.remove('NC')
            print(" -> DT mod ACTIVATED")

    def toggle_nc(self):
        """Toggles the Nightcore (NC) mod. Deactivates DT if active."""
        if 'NC' in self.active_mods:
            self.active_mods.remove('NC')
            print(" -> NC mod DEACTIVATED")
        else:
            self.active_mods.add('NC')
            if 'DT' in self.active_mods:
                self.active_mods.remove('DT')
            print(" -> NC mod ACTIVATED")

    def is_mod_active(self, mod_name):
        """Checks if a specific mod is active."""
        return mod_name.upper() in self.active_mods

    def apply_mods(self, original_beatmap_data):
        """
        Applies all active mods to a copy of the beatmap data.

        Args:
            original_beatmap_data (dict): The original, unmodified beatmap data.

        Returns:
            dict: A new dictionary with all mod effects applied.
        """
        # Work on a deep copy to avoid modifying the original data
        modded_data = copy.deepcopy(original_beatmap_data)

        if not self.active_mods:
            return modded_data # Return original if no mods are active

        print(f" -> Applying mods: {', '.join(self.active_mods)}")

        # Apply mods in a specific order if necessary
        if 'HR' in self.active_mods:
            self._apply_hr(modded_data)
        
        if 'DT' in self.active_mods or 'NC' in self.active_mods:
            self._apply_dt_nc(modded_data)
            
        return modded_data

    def _apply_hr(self, data):
        """Flips all hit objects on the Y-axis."""
        for hit_object in data["HitObjects"]:
            hit_object['y'] = 384 - hit_object['y']
            # For sliders, flip all curve points as well
            if hit_object.get('curveType'):
                flipped_curve_points = []
                for x, y in hit_object['curvePoints']:
                    flipped_curve_points.append((x, 384 - y))
                hit_object['curvePoints'] = flipped_curve_points
        
        # HR also increases difficulty stats, but we will ignore this for now
        # as it doesn't affect the bot's ability to play the map.

    def _apply_dt_nc(self, data):
        """Speeds up the map by 1.5x."""
        speed_multiplier = 1.5
        
        # Speed up all timing-related values
        for hit_object in data["HitObjects"]:
            hit_object['time'] = int(hit_object['time'] / speed_multiplier)
            if 'endTime' in hit_object:
                hit_object['endTime'] = int(hit_object['endTime'] / speed_multiplier)

        for timing_point in data["TimingPoints"]:
            timing_point['time'] = int(timing_point['time'] / speed_multiplier)
            # Only change beatLength for uninherited timing points
            if timing_point['beatLength'] > 0:
                timing_point['beatLength'] /= speed_multiplier
        
        # Adjust AR and OD for the speed change.
        # This is a simplified formula, but effective for the bot's sync.
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
        
        # OD formula is simpler
        od_ms = 79.5 - (6 * od)
        new_od_ms = od_ms / speed_multiplier
        new_od = (79.5 - new_od_ms) / 6
        data["Difficulty"]["OverallDifficulty"] = round(new_od, 2)