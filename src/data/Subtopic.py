import json

def extract_unique_subtopics_from_file(filepath):
    """
    Reads a JSON file, extracts all unique "Subtopic" values, and returns them.

    Args:
        filepath (str): The path to the JSON file.

    Returns:
        set: A set containing all unique subtopics, or an empty set if an error occurs.
    """
    subtopics = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

            # Ensure data is a list of objects
            if not isinstance(data, list):
                # If the file contains a single JSON object, put it in a list
                if isinstance(data, dict) and 'Subtopic' in data:
                    subtopics.add(data['Subtopic'])
                else:
                    print("Error: JSON file does not contain a list of objects or a single valid object.")
                return subtopics

            # Iterate through the list of objects
            for item in data:
                if isinstance(item, dict) and 'Subtopic' in item:
                    subtopics.add(item['Subtopic'])
                    
    except FileNotFoundError:
        print(f"Error: The file '{filepath}' was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file '{filepath}' is not a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    return subtopics

# --- How to use the script ---

# 1. Save the code above as a Python file (e.g., extract.py).
# 2. Make sure your JSON file is in the same directory, or provide the full path.
#    Let's assume your file is named 'data.json'.

# 3. Replace 'data.json' with the actual name of your file.
json_file_path = 'Physiologie Digestive (Février 2025).json' 
unique_subtopics = extract_unique_subtopics_from_file(json_file_path)

# 4. Print the results.
if unique_subtopics:
    print("Unique Subtopics found in the file:")
    # This is the corrected line:
    for subtopic in sorted(list(unique_subtopics)): # Sorted for consistent output
        print(f"- {subtopic}")
else:
    print("No subtopics were found.")
