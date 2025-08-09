# parser.py

import os
import re
import math
import numpy as np

import utils

def get_slider_duration(hit_object, difficulty_data, timing_points):
    """
    Calculates the total duration of a slider in milliseconds.
    This calculation is based on pixel length, slider multiplier, and timing points.
    """
    slider_multiplier = difficulty_data.get("SliderMultiplier", 1.4)
    beat_length_ms = -1

    # Find the relevant uninherited timing point before the hit object
    for tp in timing_points:
        if tp['time'] <= hit_object['time']:
            if tp['beatLength'] > 0:
                beat_length_ms = tp['beatLength']
        else:
            break

    # Apply relevant inherited timing points
    for tp in reversed(timing_points):
        if tp['time'] <= hit_object['time']:
            if tp['beatLength'] < 0:
                beat_length_ms *= (-tp['beatLength'] / 100.0)
                break

    if beat_length_ms == -1:
        return 0

    return (hit_object['pixelLength'] / (100.0 * slider_multiplier)) * beat_length_ms * hit_object['slides']

def get_bezier_point(t, control_points):
    """Calculates a point on a Bezier curve based on parameter t."""
    n = len(control_points) - 1
    point = np.zeros(2)
    for i, p in enumerate(control_points):
        bernstein = math.comb(n, i) * (t ** i) * ((1 - t) ** (n - i))
        point += p * bernstein
    return point

def _approximate_curve_length(control_points):
    """Approximates the length of a Bezier curve by summing distances between control points."""
    length = 0
    for i in range(len(control_points) - 1):
        length += np.linalg.norm(control_points[i+1] - control_points[i])
    return length

def calculate_slider_path(hit_object, num_points=100):
    """
    Generates a series of coordinate points that form a slider's path.
    Supports Linear (L), Perfect Circle (P), and Bezier (B) curve types.
    """
    curve_type = hit_object['curveType']
    control_points_raw = [np.array(p) for p in hit_object['curvePoints']]
    path = []

    if curve_type == 'L':  # Linear
        start_point, end_point = control_points_raw
        for i in range(num_points + 1):
            t = i / num_points
            pos = start_point * (1 - t) + end_point * t
            path.append(pos)

    elif curve_type == 'P':  # Perfect Circle
        start_point, mid_point, end_point = control_points_raw
        if abs(np.cross(mid_point - start_point, end_point - start_point)) < 1e-5:
            return calculate_slider_path({'curveType': 'L', 'curvePoints': [start_point, end_point]}, num_points)

        D = 2 * (start_point[0] * (mid_point[1] - end_point[1]) + mid_point[0] * (end_point[1] - start_point[1]) +
                 end_point[0] * (start_point[1] - mid_point[1]))
        if abs(D) < 1e-5: return []

        ux = ((start_point[0] ** 2 + start_point[1] ** 2) * (mid_point[1] - end_point[1]) +
              (mid_point[0] ** 2 + mid_point[1] ** 2) * (end_point[1] - start_point[1]) +
              (end_point[0] ** 2 + end_point[1] ** 2) * (start_point[1] - mid_point[1])) / D
        uy = ((start_point[0] ** 2 + start_point[1] ** 2) * (end_point[0] - mid_point[0]) +
              (mid_point[0] ** 2 + mid_point[1] ** 2) * (start_point[0] - end_point[0]) +
              (end_point[0] ** 2 + end_point[1] ** 2) * (mid_point[0] - start_point[0])) / D
        center = np.array([ux, uy])
        radius = np.linalg.norm(start_point - center)
        start_angle = np.arctan2(start_point[1] - center[1], start_point[0] - center[0])
        end_angle = np.arctan2(end_point[1] - center[1], end_point[0] - center[0])
        
        cross_product = np.cross(mid_point - start_point, end_point - start_point)
        if cross_product > 0:
            if end_angle < start_angle: end_angle += 2 * np.pi
        else:
            if start_angle < end_angle: start_angle += 2 * np.pi

        for i in range(num_points + 1):
            t = i / num_points
            angle = start_angle * (1 - t) + end_angle * t
            pos = np.array([center[0] + radius * np.cos(angle), center[1] + radius * np.sin(angle)])
            path.append(pos)

    elif curve_type == 'B':  # Bezier
        segments = []
        current_segment = [control_points_raw[0]]
        for i in range(1, len(control_points_raw)):
            current_segment.append(control_points_raw[i])
            if i < len(control_points_raw) - 1 and np.array_equal(control_points_raw[i], control_points_raw[i+1]):
                segments.append(current_segment)
                current_segment = [control_points_raw[i+1]]
        segments.append(current_segment)

        segment_lengths = [_approximate_curve_length(s) for s in segments]
        total_length = sum(segment_lengths)
        
        if total_length == 0:
             return [tuple(p.astype(int)) for p in control_points_raw]

        path = []
        for i, segment in enumerate(segments):
            segment_length = segment_lengths[i]
            points_for_segment = int(round(num_points * (segment_length / total_length)))
            
            if points_for_segment == 0:
                continue

            for j in range(points_for_segment):
                t = j / (points_for_segment - 1 if points_for_segment > 1 else 1)
                path.append(get_bezier_point(t, segment))
        
        if not any(np.array_equal(path[-1], control_points_raw[-1]) for p in path):
             path.append(control_points_raw[-1])

    return [tuple(p.astype(int)) for p in path]

def parse_osu_file(file_path):
    """
    Reads and parses a .osu file to extract beatmap data.
    """
    if not os.path.exists(file_path):
        return None

    beatmap_data = {"General": {}, "Difficulty": {}, "HitObjects": [], "TimingPoints": []}
    current_section = None

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('//'):
                    continue
                if line.startswith('[') and line.endswith(']'):
                    current_section = line[1:-1]
                    continue

                if current_section in ["General", "Difficulty"]:
                    if ':' in line:
                        key, value = map(str.strip, line.split(':', 1))
                        if current_section == "Difficulty":
                            try:
                                beatmap_data[current_section][key] = float(value)
                            except ValueError:
                                beatmap_data[current_section][key] = value
                        else:
                            beatmap_data[current_section][key] = value

                elif current_section == "TimingPoints":
                    parts = line.split(',')
                    if len(parts) >= 2:
                        beatmap_data["TimingPoints"].append({
                            'time': float(parts[0]),
                            'beatLength': float(parts[1])
                        })

                elif current_section == "HitObjects":
                    parts = line.split(',')
                    if len(parts) < 4: continue
                    try:
                        hit_object = {"x": int(parts[0]), "y": int(parts[1]), "time": int(parts[2]),
                                      "type": int(parts[3])}
                        obj_type = hit_object['type']

                        if obj_type & 8:  # Spinner
                            hit_object['endTime'] = int(parts[5])
                        elif obj_type & 2:  # Slider
                            slider_parts = parts[5].split('|')
                            hit_object['curveType'] = slider_parts[0]
                            curve_points = [(hit_object['x'], hit_object['y'])]
                            for point_str in slider_parts[1:]:
                                p = point_str.split(':')
                                curve_points.append((int(p[0]), int(p[1])))
                            hit_object['curvePoints'] = curve_points
                            hit_object['slides'] = int(parts[6])
                            hit_object['pixelLength'] = float(parts[7])
                        beatmap_data["HitObjects"].append(hit_object)
                    except (ValueError, IndexError):
                        pass
        return beatmap_data
    except Exception as e:
        print(f"   ! Error parsing file {os.path.basename(file_path)}: {e}")
        return None

def find_and_process_beatmap(beatmap_name_from_title, songs_directory):
    """
    Finds the corresponding .osu file based on the game window title.
    This function matches the song folder and the difficulty name.
    """
    print(f"Beatmap Detected: {beatmap_name_from_title}")
    cleaned_title = utils.clean_filename(beatmap_name_from_title)
    simplified_title = utils.simplify_string(cleaned_title)
    found_folder_path = None

    if not os.path.isdir(songs_directory):
        print(f" -> FAILED: Songs directory not found at '{songs_directory}'")
        return None
        
    for folder_name in os.listdir(songs_directory):
        parts = folder_name.split(' ', 1)
        folder_title_part = parts[1] if len(parts) > 1 else folder_name
        if utils.simplify_string(folder_title_part) in simplified_title:
            found_folder_path = os.path.join(songs_directory, folder_name)
            print(f" -> Found potential folder: {folder_name}")
            break

    if not found_folder_path:
        print(" -> FAILED: Could not find a matching folder.")
        return None

    try:
        difficulty_start_index = cleaned_title.rfind('[')
        if difficulty_start_index == -1: return None

        difficulty_part = cleaned_title[difficulty_start_index:]
        simplified_difficulty = utils.simplify_string(difficulty_part)

        for f in os.listdir(found_folder_path):
            if f.endswith(".osu"):
                simplified_filename_no_ext = utils.simplify_string(f[:-4])
                if simplified_filename_no_ext.endswith(simplified_difficulty):
                    full_path = os.path.join(found_folder_path, f)
                    print(f" -> Found .osu file: {f}")
                    return parse_osu_file(full_path)

        print(f" -> FAILED: Could not find .osu file with difficulty '{difficulty_part}'")
        return None
    except Exception as e:
        print(f" -> An error occurred: {e}")
        return None