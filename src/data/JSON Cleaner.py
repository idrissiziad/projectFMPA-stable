import json

# --- Configuration ---
# Path to your original JSON file that has garbled characters
input_file_path = 'Bactériologie (Février 2025).json'

# Path for the new, cleaned JSON file that will be created
output_file_path = 'cleaned_data.json'
# ---------------------


def clean_json_file(input_path, output_path):
    """
    Reads a JSON file with Unicode escape sequences, decodes them,
    and writes the cleaned data to a new file.

    Args:
        input_path (str): The path to the source JSON file.
        output_path (str): The path to write the cleaned JSON file.
    """
    try:
        # Step 1: Read the original JSON file with the correct encoding.
        # The json.load() function will automatically handle the \uXXXX sequences.
        with open(input_path, 'r', encoding='utf-8') as f:
            print(f"Reading and decoding file: {input_path}...")
            data = json.load(f)
        
        print("File successfully decoded.")

        # Step 2: Write the cleaned data to a new JSON file.
        # ensure_ascii=False tells the writer to output the characters directly
        # instead of escaping them.
        with open(output_path, 'w', encoding='utf-8') as f:
            print(f"Writing cleaned data to: {output_path}...")
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        print("\nSuccessfully created the cleaned JSON file!")
        print(f"You can find it at: {output_path}")

    except FileNotFoundError:
        print(f"Error: The input file was not found at '{input_path}'")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from '{input_path}': {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# --- Run the script ---
if __name__ == "__main__":
    # Before you run:
    # 1. Make sure this script is in the same directory as your JSON file,
    #    or provide the full path to the file.
    # 2. Change 'your_data.json' to the name of your file.
    clean_json_file(input_file_path, output_file_path)
