import json

# ==============================================================================
# --- 1. CONFIGURE YOUR SCRIPT HERE ---
# ==============================================================================

# The name of your JSON file.
# This should be the correct name from your last attempt.
INPUT_FILENAME = 'Physiologie Digestive (Février 2025).json'

# The name for the new, updated JSON file that will be created.
OUTPUT_FILENAME = 'updated_questions_file.json'

# This MAP defines the transformations.
# The script will find the "key" on the left and replace it with the "value" on the right.
# For example, it will find any instance of "ABSORPTION INTESTINALE" and change it to "Absorption Intestinale".
SUBTOPIC_MAP = {
    "ABSORPTION INTESTINALE": "Absorption Intestinale",
    "Généralités sur le Tube Digestif": "Généralités sur le Tube Digestif",
    "La déglutition et motricité œsophagienne": "Déglutition et Motricité Œsophagienne",
    "La motricité gastrique": "Motricité Gastrique",
    "La sécrétion biliaire": "Sécrétion Biliaire",
    "La sécrétion gastrique": "Sécrétion Gastrique",
    "La sécrétion pancréatique": "Sécrétion Pancréatique",
    "La sécrétion salivaire": "Sécrétion Salivaire"
}


# ==============================================================================
# --- SCRIPT LOGIC (No need to change anything below this line) ---
# ==============================================================================

def update_subtopics_in_data(data_object):
    """
    Recursively iterates through the JSON data and updates the 'Subtopic' value
    based on the SUBTOPIC_MAP.
    Returns the number of changes made.
    """
    changes_count = 0

    if isinstance(data_object, dict):
        # If the object is a dictionary, check for the 'Subtopic' key
        if 'Subtopic' in data_object:
            old_value = data_object['Subtopic']
            # If the current subtopic is in our map, replace it
            if old_value in SUBTOPIC_MAP:
                new_value = SUBTOPIC_MAP[old_value]
                if old_value != new_value:
                    data_object['Subtopic'] = new_value
                    changes_count += 1

        # Also, recurse into any values that are dictionaries or lists
        for key, value in data_object.items():
            changes_count += update_subtopics_in_data(value)

    elif isinstance(data_object, list):
        # If the object is a list, iterate over its items and recurse
        for item in data_object:
            changes_count += update_subtopics_in_data(item)

    return changes_count

def main():
    """Main function to run the entire process."""
    print("--- Starting Subtopic Transformation Script ---")
    try:
        with open(INPUT_FILENAME, 'r', encoding='utf-8') as f:
            print(f"STEP 1: Reading JSON data from '{INPUT_FILENAME}'...")
            json_data = json.load(f)
    except FileNotFoundError:
        print(f"\n!!! ERROR: The file '{INPUT_FILENAME}' was not found.")
        print("    Please ensure the script and the JSON file are in the same folder,")
        print("    and that 'INPUT_FILENAME' is set correctly at the top of the script.")
        return
    except json.JSONDecodeError:
        print(f"\n!!! ERROR: Could not parse '{INPUT_FILENAME}'. It may be an invalid JSON file.")
        return

    print("STEP 2: Finding and updating 'Subtopic' values...")
    total_changes = update_subtopics_in_data(json_data)

    if total_changes == 0:
        print("\n--- Script Finished: No applicable 'Subtopic' values were found to update. ---")
        print("This could mean the values have already been updated or they don't match the map.")
        return

    print(f"--> Found and updated {total_changes} subtopic entries.")

    try:
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
            print(f"STEP 3: Saving updated data to '{OUTPUT_FILENAME}'...")
            json.dump(json_data, f, ensure_ascii=False, indent=4)
        print("\n--- All Done! ---")
        print(f"✓ Successfully created the updated file: '{OUTPUT_FILENAME}'")
    except Exception as e:
        print(f"\n!!! ERROR: An unexpected error occurred while saving the file: {e}")

if __name__ == "__main__":
    main()
